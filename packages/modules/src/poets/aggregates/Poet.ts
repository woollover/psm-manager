import { AggregateRoot, InvalidCommandError } from "@psm/core";
import { PoetEvent } from "../events";
import { PoetCommands } from "../commands";
import { PoetsEventFactory } from "../events/PoetsEvent.factory";

export class Poet extends AggregateRoot {
  private firstName: string = "";
  private lastName: string = "";
  private birthDate: string = "";
  private email: string = "";
  private instagramHandle: string | null = null;
  private isDeleted: boolean = false;
  private isMc: boolean = false;

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

  public async applyCommand(command: PoetCommands): Promise<void> {
    // Business invariants validation
    switch (command.commandName) {
      case "CreatePoetCommand":
        {
          await command.validateOrThrow(command.payload);
          this.apply(
            PoetsEventFactory.createEvent("PoetCreated", {
              aggregateId: this.id,
              payload: command.payload,
            })
          );
        }
        break;

      case "SetPoetAsMCCommand":
        {
          await command.validateOrThrow(command.payload);
          if (this.getIsMc == true) {
            throw new Error("Poet is already set as MC");
            // reject the command
          }
          this.apply(
            PoetsEventFactory.createEvent("PoetSetAsMC", {
              aggregateId: this.id,
              payload: command.payload,
            })
          );
        }
        break;

      case "SetPoetAsPoetCommand":
        {
          await command.validateOrThrow(command.payload);
          if (this.getIsMc == false) {
            // reject the command
            throw new Error("Poet is already set as Poet");
          }

          this.apply(
            PoetsEventFactory.createEvent("PoetSetAsPoet", {
              aggregateId: this.id,
              payload: command.payload,
            })
          );
        }
        break;
      case "EditPoetCommand":
        {
          await command.validateOrThrow(command.payload);

          if (this.isDeleted) throw new Error("Poet is deleted");

          this.apply(
            PoetsEventFactory.createEvent("PoetEdited", {
              payload: command.payload,
              aggregateId: this.id,
            })
          );
        }
        break;
      case "DeletePoetCommand":
        {
          if (this.isDeleted) throw new Error("Poet is deleted");
          await command.validateOrThrow(command.payload);
          this.apply(
            PoetsEventFactory.createEvent("PoetDeleted", {
              aggregateId: this.id,
              payload: command.payload,
              timestamp: new Date().getTime(),
            })
          );
        }
        break;
      case "ReactivatePoetCommand":
        {
          await command.validateOrThrow(command.payload);
          if (!this.isDeleted) throw new Error("Poet is not deleted");
          this.apply(
            PoetsEventFactory.createEvent("PoetReactivated", {
              aggregateId: this.id,
              payload: {
                aggregateId: this.id,
              },
              timestamp: new Date().getTime(),
            })
          );
        }
        break;
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
