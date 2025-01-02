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
  private firstName: string = "";
  private lastName: string = "";
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
        this.firstName = payload.firstName;
        this.lastName = payload.lastName;
        this.email = payload.email;
        break;

      case "PoetEdited":
        console.log("🚀 Mutating PoetEditedEvent");
        console.log("🚀 Mutating PoetEditedEvent payload:", payload);
        if (payload.firstName) {
          this.firstName = payload.firstName;
        }
        if (payload.lastName) {
          this.lastName = payload.lastName;
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
          new PoetCreatedEvent({
            aggregateId: this.id,
            payload: {
              ...payload,
            },
            timestamp: new Date().getTime(),
          })
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
        this.apply(
          new PoetSetAsMCEvent({
            aggregateId: this.id,
            payload: setCommand.payload,
            timestamp: new Date().getTime(),
          })
        );
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
          new PoetSetAsPoetEvent({
            aggregateId: this.id,
            payload: setCommand.payload,
            timestamp: new Date().getTime(),
          })
        );
        return this;
      }
      case EditPoetCommand: {
        const editCommand = command as EditPoetCommand;
        await editCommand.validateOrThrow(editCommand.payload);
        if (this.is_deleted) throw new Error("Poet is deleted");
        this.apply(
          new PoetEditedEvent({
            aggregateId: this.id,
            payload: editCommand.payload,
            timestamp: new Date().getTime(),
          })
        );
        return this;
      }
      case DeletePoetCommand: {
        const deleteCommand = command as DeletePoetCommand;
        if (this.is_deleted) throw new Error("Poet is deleted");
        await deleteCommand.validateOrThrow(deleteCommand.payload);
        this.apply(
          new PoetDeletedEvent({
            aggregateId: this.id,
            payload: deleteCommand.payload,
            timestamp: new Date().getTime(),
          })
        );
        return this;
      }
      case ReactivatePoetCommand: {
        const reactivateCommand = command as ReactivatePoetCommand;
        await reactivateCommand.validateOrThrow(reactivateCommand.payload);
        if (!this.is_deleted) throw new Error("Poet is not deleted");
        this.apply(
          new PoetReactivatedEvent({
            aggregateId: this.id,
            payload: reactivateCommand.payload,
            timestamp: new Date().getTime(),
          })
        );
        return this;
      }
      default:
        console.log("🚀 Default case, problem in command Switch");
        throw new Error("Invalid command");
    }
  }

  // getters
  get getFirstName(): string {
    return this.firstName;
  }

  get getLastName(): string {
    return this.lastName;
  }

  get getaggregateId(): string {
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
