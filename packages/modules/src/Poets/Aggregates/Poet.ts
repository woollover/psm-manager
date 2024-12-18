import { randomUUID } from "crypto";
import { AggregateRoot } from "../../../../core/src/AggregateRoot";
import { CreatePoetCommand } from "../Commands/CreatePoetcommand";
import { PoetCommands } from "../Commands/PoetCommands";
import {
  MCCreatedEvent,
  MCDeletedEvent,
  MCEditedEvent,
  MCEvent,
} from "../Events";
import { EditPoetCommand } from "../Commands/EditPoet.command";
import { DeletePoetCommand } from "../Commands/DeletePoet.command";

export class Poet extends AggregateRoot<string> {
  private name: string = "";
  private mcId: string = "";
  private email: string = "";
  private instagram_handle: string | null = null;
  private is_deleted: boolean = false;
  private is_mc: boolean = true;
  constructor(public readonly id: string) {
    super(id);
  }

  // apply events to this very aggregate (BUSINESS LOGIC)
  protected mutate(event: MCEvent): void {
    const payload = event.getPayload;
    switch (event.constructor) {
      case MCCreatedEvent:
        this.name = payload.name;
        this.mcId = payload.mcId;
        this.email = payload.email;
        break;

      case MCEditedEvent:
        this.name = payload.name;
        this.email = payload.email;
        break;

      case MCDeletedEvent:
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
        const mcId = this.id || randomUUID();

        const payload = createCommand.payload;
        this.apply(
          new MCCreatedEvent({
            mcId: mcId,
            name: payload.name,
            email: payload.email,
            occurredAt: new Date(),
          })
        );
        break;
      }
      case EditPoetCommand: {
        const editCommand = command as EditPoetCommand;
        await editCommand.validateOrThrow(editCommand.payload);
        this.apply(
          new MCEditedEvent({
            mcId: this.mcId,
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
        await deleteCommand.validateOrThrow(deleteCommand.payload);
        this.apply(
          new MCDeletedEvent({ mcId: this.mcId, occurredAt: new Date() })
        );
        break;
      }
    }
  }

  // getters
  get getName(): string {
    return this.name;
  }
  get getMcId(): string {
    return this.mcId;
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
