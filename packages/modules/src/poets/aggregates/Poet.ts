import { AggregateRoot } from "../../../../core/src/AggregateRoot";
import { CreatePoetCommand } from "../commands/CreatePoet.command";

import {
  PoetCreatedEvent,
  PoetDeletedEvent,
  PoetEditedEvent,
  PoetEvent,
  PoetReactivatedEvent,
  PoetSetAsMCEvent,
} from "../events";
import { EditPoetCommand } from "../commands/EditPoet.command";
import { DeletePoetCommand } from "../commands/DeletePoet.command";
import { SetPoetAsMCCommand } from "../commands/SetPoetAsMC.command";
import { PoetCommands } from "../commands";
import { InvalidCommandError } from "../../../../core/src/Errors/InvalidCommandError";
import { SetPoetAsPoetCommand } from "../commands/SetPoetAsPoet.command";
import { PoetSetAsPoetEvent } from "../events/PoetSetAsPoet.event";
import { ReactivatePoetCommand } from "../commands/ReactivatePoet.command";

export class Poet extends AggregateRoot<string> {
  private name: string = "";
  private email: string = "";
  private instagram_handle: string | null = null;
  private is_deleted: boolean = false;
  private is_mc: boolean = false;
  constructor(public readonly id: string) {
    super(id);
  }

  // apply events to this very aggregate (BUSINESS LOGIC)
  protected mutate(event: PoetEvent): void {
    const payload = event.getPayload;
    switch (event.getEventType) {
      case "PoetCreated":
        // TODO this logic can be a method in the future
        console.log("🚀 Mutating PoetCreatedEvent");
        console.log("🚀 Mutating PoetCreatedEvent payload:", payload);
        this.name = payload.name;
        this.email = payload.email;
        break;

      case "PoetEdited":
        console.log("🚀 Mutating PoetEditedEvent");
        console.log("🚀 Mutating PoetEditedEvent payload:", payload);
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
      case "PoetSetAsMC":
        if (this.is_deleted) {
          throw new InvalidCommandError("poet is deleted, cannot set as MC", [
            { field: "aggregateId", cue: "this poet is deleted" },
          ]);
        }

        if (this.is_mc == true) {
          throw new InvalidCommandError("poet is already a MC", [
            { field: "aggregateId", cue: "this poet is already a MC" },
          ]);
        }
        console.log("🚀 Mutating PoetSetAsMCEvent");
        console.log("🚀 Mutating PoetSetAsMCEvent payload:", payload);
        this.is_mc = true;
        break;

      case "PoetSetAsPoet":
        if (this.is_deleted) {
          throw new InvalidCommandError("poet is deleted, cannot set as Poet", [
            { field: "aggregateId", cue: "this poet is deleted" },
          ]);
        }
        if (this.is_mc == false) {
          throw new InvalidCommandError("poet is already a Poet", [
            { field: "aggregateId", cue: "this poet is not set as MC" },
          ]);
        }
        console.log("🚀 Mutating PoetSetAsPoetEvent");
        console.log("🚀 Mutating PoetSetAsPoetEvent payload:", payload);
        this.is_mc = false;
        break;

      case "PoetDeleted":
        console.log("🚀 Mutating PoetDeletedEvent");
        console.log("🚀 Mutating PoetDeletedEvent payload:", payload);
        this.is_deleted = true;
        break;

      case "PoetReactivated":
        console.log("🚀 Mutating PoetReactivatedEvent");
        console.log("🚀 Mutating PoetReactivatedEvent payload:", payload);
        this.is_deleted = false;
        break;
      default:
        console.log("🚀 Default case, problem in mutate switch");
        throw new Error("Invalid event");
    }
  }

  public async applyCommand(command: PoetCommands): Promise<Poet> {
    // Business invariants validation
    switch (command.constructor) {
      case CreatePoetCommand: {
        const createCommand = command as CreatePoetCommand;
        try {
          createCommand.validateOrThrow(createCommand.payload);
        } catch (error) {
          console.log("🚀 Command payload:", createCommand.payload);
          throw error;
        }
        const payload = createCommand.payload;
        this.apply(
          new PoetCreatedEvent(
            {
              poetId: this.id,
              name: payload.name,
              email: payload.email,
            },
            new Date()
          )
        );
        return this;
      }
      case SetPoetAsMCCommand: {
        const setCommand = command as SetPoetAsMCCommand;
        await setCommand.validateOrThrow(setCommand.payload);
        if (this.getIsMc == true) {
          throw new Error("Poet is already set as MC");
          // reject the command
        }
        this.apply(new PoetSetAsMCEvent({ aggregateId: this.id }, new Date()));
        return this;
      }

      case SetPoetAsPoetCommand: {
        const setCommand = command as SetPoetAsPoetCommand;
        await setCommand.validateOrThrow(setCommand.payload);
        if (this.getIsMc == false) {
          throw new Error("Poet is already set as Poet");
          // reject the command
        }
        this.apply(
          new PoetSetAsPoetEvent({ aggregateId: this.id }, new Date())
        );
        return this;
      }
      case EditPoetCommand: {
        const editCommand = command as EditPoetCommand;
        await editCommand.validateOrThrow(editCommand.payload);
        if (this.is_deleted) throw new Error("Poet is deleted");
        this.apply(
          new PoetEditedEvent(
            {
              poetId: this.id,
              name: editCommand.payload.name,
              email: editCommand.payload.email,
              instagram_handle: editCommand.payload.instagram_handle,
            },
            new Date()
          )
        );
        return this;
      }
      case DeletePoetCommand: {
        const deleteCommand = command as DeletePoetCommand;
        if (this.is_deleted) throw new Error("Poet is deleted");
        await deleteCommand.validateOrThrow(deleteCommand.payload);
        this.apply(new PoetDeletedEvent({ poetId: this.id }, new Date()));
        return this;
      }
      case ReactivatePoetCommand: {
        const reactivateCommand = command as ReactivatePoetCommand;
        await reactivateCommand.validateOrThrow(reactivateCommand.payload);
        if (!this.is_deleted) throw new Error("Poet is not deleted");
        this.apply(new PoetReactivatedEvent({ poetId: this.id }, new Date()));
        return this;
      }
      default:
        console.log("🚀 Default case, problem in command Switch");
        throw new Error("Invalid command");
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
