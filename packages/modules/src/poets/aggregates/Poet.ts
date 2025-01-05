import { AggregateRoot } from "@psm/core/AggregateRoot";
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
import { InvalidCommandError } from "@psm/core/Errors/InvalidCommandError";
import { SetPoetAsPoetCommand } from "../commands/SetPoetAsPoet.command";
import { PoetSetAsPoetEvent } from "../events/PoetSetAsPoet.event";
import { ReactivatePoetCommand } from "../commands/ReactivatePoet.command";
import { PoetsEventFactory } from "../events/PoetsEventFactory";

export class Poet extends AggregateRoot<string> {
  private firstName: string = "";
  private lastName: string = "";
  private birthDate: string = "";
  private email: string = "";
  private instagramHandle: string | null = null;
  private isDeleted: boolean = false;
  private isMc: boolean = false;
  constructor(public readonly id: string) {
    super(id);
  }

  // apply events to this very aggregate (BUSINESS LOGIC)
  protected mutate(event: PoetEvent): void {
    switch (event.eventType) {
      case "PoetCreated":
        // TODO this logic can be a method in the future
        this.firstName = event.getPayload.firstName;
        this.lastName = event.getPayload.lastName;
        this.email = event.getPayload.email;
        this.instagramHandle = event.getPayload.instagramHandle;
        this.birthDate = event.getPayload.birthDate;
        break;

      case "PoetEdited":
        console.log("🚀 Mutating PoetEditedEvent");
        console.log("🚀 Mutating PoetEditedEvent payload:", event.getPayload);
        if (event.getPayload.firstName) {
          this.firstName = event.getPayload.firstName;
        }
        if (event.getPayload.lastName) {
          this.lastName = event.getPayload.lastName;
        }
        if (event.getPayload.email) {
          this.email = event.getPayload.email;
        }
        if (event.getPayload.instagramHandle) {
          this.instagramHandle = event.getPayload.instagramHandle;
        }
        break;
      case "PoetSetAsMC":
        if (this.isDeleted) {
          throw new InvalidCommandError("poet is deleted, cannot set as MC", [
            { field: "aggregateId", cue: "this poet is deleted" },
          ]);
        }

        if (this.isMc == true) {
          throw new InvalidCommandError("poet is already a MC", [
            { field: "aggregateId", cue: "this poet is already a MC" },
          ]);
        }
        console.log("🚀 Mutating PoetSetAsMCEvent");
        console.log("🚀 Mutating PoetSetAsMCEvent payload:", event.getPayload);
        this.isMc = true;
        break;

      case "PoetSetAsPoet":
        if (this.isDeleted) {
          throw new InvalidCommandError("poet is deleted, cannot set as Poet", [
            { field: "aggregateId", cue: "this poet is deleted" },
          ]);
        }
        if (this.isMc == false) {
          throw new InvalidCommandError("poet is already a Poet", [
            { field: "aggregateId", cue: "this poet is not set as MC" },
          ]);
        }
        console.log("🚀 Mutating PoetSetAsPoetEvent");
        console.log(
          "🚀 Mutating PoetSetAsPoetEvent payload:",
          event.getPayload
        );
        this.isMc = false;
        break;

      case "PoetDeleted":
        console.log("🚀 Mutating PoetDeletedEvent");
        console.log("🚀 Mutating PoetDeletedEvent payload:", event.getPayload);
        this.isDeleted = true;
        break;

      case "PoetReactivated":
        console.log("🚀 Mutating PoetReactivatedEvent");
        console.log(
          "🚀 Mutating PoetReactivatedEvent payload:",
          event.getPayload
        );
        this.isDeleted = false;
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
        await createCommand.validateOrThrow(createCommand.payload);
        console.log("🚀 Command payload:", createCommand.payload);
        const payload = createCommand.payload;
        this.apply(
          PoetsEventFactory.createEvent("PoetCreated", {
            aggregateId: this.id,
            payload,
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
        if (this.isDeleted) throw new Error("Poet is deleted");
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
        if (this.isDeleted) throw new Error("Poet is deleted");
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
        if (!this.isDeleted) throw new Error("Poet is not deleted");
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
    return this.instagramHandle;
  }

  get getIsDeleted(): boolean {
    return this.isDeleted;
  }

  get getIsMc(): boolean {
    return this.isMc;
  }
}
