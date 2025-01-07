import { AggregateRoot } from "@psm/core/AggregateRoot";
import { SlamCommands } from "../commands";
import { InvalidCommandError } from "@psm/core/Errors/InvalidCommandError";
import { CountryId } from "@psm/common/constants/countries";
import { SlamEventFactory } from "../events/SlamEventsFactory";
import { SlamEvent, SlamEventPayload } from "../events";
import { SlamEditedEvent } from "../events/SlamEdited.event";

export class Slam extends AggregateRoot<string> {
  private regionalId: string | null = null; // county name
  private countryId: CountryId | null = null; // Country ID
  private city: string | null = null; // city Name
  private venue: string | null = null; // Venue Name
  private timestamp: number | null = null; // Date of the Slam
  private name: string | null = null; // Title of the Slam
  private mcs: Array<string> = []; // Poet IDs and MCs
  private candidates: Array<string> = [];
  private callOpen: boolean = false;
  private poets: Array<string> = [];
  private started: boolean = false;
  private ended: boolean = false;
  private deleted: boolean = false;

  constructor(public readonly id: string) {
    super(id);
  }

  protected mutate(event: SlamEvent): void {
    switch (event.eventType) {
      case "SlamCreated":
        this.countryId = event.getPayload.countryId;
        this.regionalId = event.getPayload.regionalId;
        this.city = event.getPayload.city;
        this.venue = event.getPayload.venue;
        this.timestamp = event.getPayload.timestamp;
        this.name = event.getPayload.name;
        break;
      case "SlamDeleted":
        this.deleted = true;
        break;
      case "SlamEdited":
        this.countryId = event.getPayload.countryId
          ? event.getPayload.countryId
          : this.countryId;
        this.regionalId = event.getPayload.regionalId
          ? event.getPayload.regionalId
          : this.regionalId;
        this.city = event.getPayload.city ? event.getPayload.city : this.city;
        this.venue = event.getPayload.venue
          ? event.getPayload.venue
          : this.venue;
        this.timestamp = event.getPayload.timestamp
          ? event.getPayload.timestamp
          : this.timestamp;
        this.name = event.getPayload.name ? event.getPayload.name : this.name;
        break;
      default:
        //@ts-expect-error
        throw new Error(`event not valid ${event.eventType}`);
    }
  }

  public async applyCommand(command: SlamCommands): Promise<Slam> {
    switch (command.commandName) {
      case "CreateSlamCommand":
        console.log("Applying CreateSlam Command");
        command.validateOrThrow(command.payload);
        // eventually do other validations over command
        const slamCreatedPayload: SlamEventPayload<"SlamCreated"> = {
          name: command.payload.name,
          regionalId: command.payload.regionalId,
          countryId: command.payload.countryId,
          city: command.payload.city,
          venue: command.payload.venue,
          timestamp: new Date(
            command.payload.year,
            command.payload.monthIndex,
            command.payload.day
          ).getTime(),
        };
        // apply the command
        this.apply(
          SlamEventFactory.createEvent("SlamCreated", {
            aggregateId: this.id,
            payload: slamCreatedPayload,
          })
        );
        return this;
      case "DeleteSlamCommand":
        console.log("Applying DeleteSlam Command");
        command.validateOrThrow(command.payload);
        const slamDeletedPayload: SlamEventPayload<"SlamDeleted"> = {};
        this.apply(
          SlamEventFactory.createEvent("SlamDeleted", {
            aggregateId: this.id,
            payload: slamDeletedPayload,
          })
        );
        return this;
      case "EditSlamCommand":
        console.log("Applying EditSlam Command");
        const slamEditedPayload: SlamEventPayload<"SlamEdited"> = {
          name: command.payload.name,
          regionalId: command.payload.regionalId,
          countryId: command.payload.countryId,
          city: command.payload.city,
          venue: command.payload.venue,
          timestamp:
            command.payload.year &&
            command.payload.monthIndex &&
            command.payload.day &&
            new Date(
              command.payload.year,
              command.payload.monthIndex,
              command.payload.day
            ).getTime(),
        };
        this.apply(
          SlamEventFactory.createEvent("SlamEdited", {
            aggregateId: this.id,
            payload: slamEditedPayload,
          })
        );
        return this;
      default:
        throw new InvalidCommandError("Command does not exists", []);
    }
  }

  // getters

  get getName() {
    return this.name;
  }

  get getCity() {
    return this.city;
  }

  get getTimestamp() {
    return this.timestamp;
  }

  get isDeleted() {
    return this.deleted;
  }
}
