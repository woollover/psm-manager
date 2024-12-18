import { randomUUID } from "crypto";
import { AggregateRoot } from "../../../../core/src/AggregateRoot";
import { CreatePoetCommand } from "../commands/CreatePoet.command";
import { PoetCommands } from "../commands";
import {
  PoetCreatedEvent,
  PoetDeletedEvent,
  PoetEditedEvent,
  PoetEvent,
  PoetSetAsMCEvent,
} from "../events";
import { EditPoetCommand } from "../commands/EditPoet.command";
import { DeletePoetCommand } from "../commands/DeletePoet.command";
import { SetPoetAsMCCommand } from "../commands/SetPoetAsMC.command";

export class Poet extends AggregateRoot<string> {
  private name: string = "";
  private poetId: string = "";
  private email: string = "";
  private instagram_handle: string | null = null;
  private is_deleted: boolean = false;
  private is_mc: boolean = true;
  constructor(public readonly id: string) {
    super(id);
  }

  // apply events to this very aggregate (BUSINESS LOGIC)
  protected mutate(event: PoetEvent): void {
    const payload = event.getPayload;
    switch (event.constructor) {
      case PoetCreatedEvent:
        // TODO this logic can be a method in the future
        this.name = payload.name;
        this.poetId = payload.poetId;
        this.email = payload.email;
        break;
      case PoetEditedEvent:
        if (payload.name) {
          this.name = payload.name;
        }
        if (payload.email) {
          this.email = payload.email;
        }
        if (payload.instagram_handle) {
          this.instagram_handle = payload.instagram_handle;
        }
        break;
      case PoetSetAsMCEvent:
        this.name = payload.name;
        this.email = payload.email;
        break;

      case PoetDeletedEvent:
        this.is_deleted = true;
        break;
    }
  }

  public async applyCommand(command: PoetCommands): Promise<void> {
    // Business invariants validation
    switch (command.constructor) {
      case CreatePoetCommand: {
        const createCommand = command as CreatePoetCommand;
        await createCommand.validateOrThrow(createCommand.payload);
        const poetId = this.id || randomUUID();
        const payload = createCommand.payload;
        this.apply(
          new PoetCreatedEvent({
            poetId: poetId,
            name: payload.name,
            email: payload.email,
            occurredAt: new Date(),
          })
        );
        break;
      }
      case SetPoetAsMCCommand: {
        const setCommand = command as SetPoetAsMCCommand;
        await setCommand.validateOrThrow(setCommand.payload);
        this.apply(
          new PoetSetAsMCEvent({ poetId: this.id, occurredAt: new Date() })
        );
        break;
      }
      case EditPoetCommand: {
        const editCommand = command as EditPoetCommand;
        await editCommand.validateOrThrow(editCommand.payload);
        if (this.is_deleted) throw new Error("Poet is deleted");
        this.apply(
          new PoetEditedEvent({
            poetId: this.id,
            name: editCommand.payload.name,
            email: editCommand.payload.email,
            instagram_handle: editCommand.payload.instagram_handle,
            occurredAt: new Date(),
          })
        );
        break;
      }
      case DeletePoetCommand: {
        const deleteCommand = command as DeletePoetCommand;
        if (this.is_deleted) throw new Error("Poet is deleted");
        await deleteCommand.validateOrThrow(deleteCommand.payload);
        this.apply(
          new PoetDeletedEvent({ poetId: this.id, occurredAt: new Date() })
        );
        break;
      }
    }
  }

  // getters
  get getName(): string {
    return this.name;
  }
  get getpoetId(): string {
    return this.id;
  }
  get getEmail(): string {
    return this.email;
  }
  get getInstagramHandle(): string | null {
    return this.instagram_handle;
  }
  get getIsDeleted(): boolean {
    return this.is_deleted;
  }
  get getIsMc(): boolean {
    return this.is_mc;
  }
}
