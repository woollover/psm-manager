import { AggregateRoot } from "@psm/core/AggregateRoot";
import { SlamCommands } from "../commands";
import { InvalidCommandError } from "@psm/core/Errors/InvalidCommand.error";
import { InvariantValidationError } from "@psm/core/Errors/InvariantValidation.error";
import { CountryId } from "@psm/common/constants/countries";
import { SlamEventFactory } from "../events/SlamEvents.factory";
import { SlamEvent, SlamEventPayload } from "../events";

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

      case "MCAssigned":
        this.ensureSlamIsNotDeleted()
          .ensureSlamHasNotAlreadyAnMC()
          .ensureMcIsNotAssigned(event.getPayload.mcId)
          .ensureSlamIsNotStarted()
          .ensureSlamIsNotEnded()
          .ensureSlamHasNotAlreadyAnMC();

        this.mcs.push(event.getPayload.mcId);
        break;

      case "MCUnassigned":
        this.ensureSlamIsNotDeleted()
          .ensureSlamIsNotStarted()
          .ensureSlamIsNotEnded()
          .ensureSlamHasThisMCAssinged(event.getPayload.mcId);
        this.mcs = this.mcs.filter((mc) => mc !== event.getPayload.mcId);
        break;

      case "PoetCandidated":
        this.ensureSlamIsNotDeleted()
          .ensureSalmAcceptCandidates()
          .ensurePoetIsNotAlreadyCandidate(event.getPayload.poetId);

        this.candidates.push(event.getPayload.poetId);
        break;

      case "CallOpened":
        this.ensureSlamIsNotDeleted()
          .ensureSlamIsNotStarted()
          .ensureSlamIsNotEnded();
        this.callOpen = true;
        break;

      case "CallClosed":
        this.ensureSlamIsNotDeleted()
          .ensureSlamIsNotStarted()
          .ensureSlamIsNotEnded()
          .ensureSlamCallIsOpen();
        this.callOpen = false;
        break;

      case "PoetAccepted":
        this.ensureSlamIsNotDeleted()
          .ensureSlamIsNotStarted()
          .ensureSlamIsNotEnded()
          .ensureSlamCallIsOpen()
          .ensurePoetIsCandidate(event.getPayload.poetId);

        this.poets.push(event.getPayload.poetId);

        break;

      case "PoetRejected":
        this.ensureSlamIsNotDeleted()
          .ensureSlamIsNotStarted()
          .ensureSlamIsNotEnded()
          .ensureSlamCallIsOpen()
          .ensurePoetIsCandidate(event.getPayload.poetId);
        if (this.poets.includes(event.getPayload.poetId)) {
          this.poets = this.poets.filter(
            (poet) => poet !== event.getPayload.poetId
          );
        }

      case "SlamStarted":
        this.ensureSlamIsNotDeleted()
          .ensureSlamIsNotEnded()
          .ensureSlamIsNotStarted()
          .ensureSlamCallIsClosed();
        this.started = true;

        break;

        case "SlamEnded":
          // after this event, we should collect all the votes and declare the winner
          
          this.ensureSlamIsNotDeleted()
            .ensureSlamIsNotEnded()
          this.ended = true;
          break;

      default:
        //@ts-expect-error
        throw new Error(`event not valid ${event.eventType}`);
    }
  }

  public applyCommand(command: SlamCommands): void {
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
        break;

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
        break;

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
        break;

      case "AssignMCCommand":
        console.log("Applying AssignMC Command");
        const mcAssignedPayload: SlamEventPayload<"MCAssigned"> = {
          mcId: command.payload.mcId,
        };

        this.apply(
          SlamEventFactory.createEvent("MCAssigned", {
            payload: mcAssignedPayload,
            aggregateId: this.id,
          })
        );
        break;

      case "UnassignMCCommand":
        console.log("Applying UnassignMC Command");
        const mcUnassignedPayload: SlamEventPayload<"MCUnassigned"> = {
          mcId: command.payload.mcId,
        };
        this.apply(
          SlamEventFactory.createEvent("MCUnassigned", {
            payload: mcUnassignedPayload,
            aggregateId: this.id,
          })
        );
        break;

      case "CandidatePoetCommand":
        console.log("Applying CandidatePoet Command");
        const candidatePoetPayload: SlamEventPayload<"PoetCandidated"> = {
          poetId: command.payload.poetId,
        };
        this.apply(
          SlamEventFactory.createEvent("PoetCandidated", {
            payload: candidatePoetPayload,
            aggregateId: this.id,
          })
        );
        break;

      case "OpenCallCommand":
        console.log("Applying OpenCall Command");
        const callOpenedPayload: SlamEventPayload<"CallOpened"> = {};
        this.apply(
          SlamEventFactory.createEvent("CallOpened", {
            payload: callOpenedPayload,
            aggregateId: this.id,
          })
        );
        break;

      case "CloseCallCommand":
        console.log("Applying CloseCall Command");
        const callClosedPayload: SlamEventPayload<"CallClosed"> = {};
        this.apply(
          SlamEventFactory.createEvent("CallClosed", {
            payload: callClosedPayload,
            aggregateId: this.id,
          })
        );
        break;

      case "AcceptPoetCommand":
        console.log("Applying AcceptPoet Command");
        const acceptPoetPayload: SlamEventPayload<"PoetAccepted"> = {
          poetId: command.payload.poetId,
        };
        this.apply(
          SlamEventFactory.createEvent("PoetAccepted", {
            payload: acceptPoetPayload,
            aggregateId: this.id,
          })
        );
        break;
      case "RejectPoetCommand":
        console.log("Applying RejectPoet Command");
        const rejectPoetPayload: SlamEventPayload<"PoetRejected"> = {
          poetId: command.payload.poetId,
          reason: command.payload.reason,
        };
        this.apply(
          SlamEventFactory.createEvent("PoetRejected", {
            payload: rejectPoetPayload,
            aggregateId: this.id,
          })
        );
        break;

      default:
        throw new InvalidCommandError("Command does not exists", []);
    }
  }

  // #region  validators

  private ensureSalmAcceptCandidates(): Slam {
    if (!this.callOpen) {
      throw new InvariantValidationError("Slam call is closed");
    }
    return this;
  }

  private ensureSlamCallIsOpen(): Slam {
    if (!this.callOpen) {
      throw new InvariantValidationError("Slam call is closed");
    }
    return this;
  }

  private ensurePoetIsCandidate(poetId: string): Slam {
    if (!this.candidates.includes(poetId)) {
      throw new InvariantValidationError("Poet is not a candidate");
    }
    return this;
  }

  private ensurePoetIsNotAlreadyCandidate(poetId: string): Slam {
    if (this.candidates.includes(poetId)) {
      throw new InvariantValidationError("Poet is already candidated");
    }
    return this;
  }

  private ensureSlamHasThisMCAssinged(mcId: string): Slam {
    if (!this.mcs.includes(mcId)) {
      throw new InvariantValidationError("MC is not assigned to this slam");
    }
    return this;
  }

  private ensureSlamIsNotDeleted(): Slam {
    if (this.deleted) {
      throw new InvariantValidationError("Slam is deleted");
    }
    return this;
  }

  private ensureSlamCallIsClosed(): Slam {
    if (this.callOpen) {
      throw new InvariantValidationError("Slam call is open");
    }
    return this;
  }

  private ensureSlamIsNotStarted(): Slam {
    if (this.started) {
      throw new InvariantValidationError("Slam is already started");
    }
    return this;
  }

  private ensureSlamIsNotEnded(): Slam {
    if (this.ended) {
      throw new InvariantValidationError("Slam is already ended");
    }
    return this;
  }

  private ensureMcIsNotAssigned(mcId: string): Slam {
    if (this.mcs.includes(mcId)) {
      throw new InvariantValidationError("MC is already assigned");
    }
    return this;
  }

  private ensureSlamHasNotAlreadyAnMC(): Slam {
    if (this.mcs.length > 0) {
      throw new InvariantValidationError("Slam already has an MC");
    }
    return this;
  }

  // #region getters

  get getName() {
    return this.name;
  }

  get getCity() {
    return this.city;
  }

  get getTimestamp() {
    return this.timestamp;
  }

  get getMcs() {
    return this.mcs;
  }

  get getCandidates() {
    return this.candidates;
  }

  get isOpen() {
    return this.callOpen;
  }
  get isDeleted() {
    return this.deleted;
  }
}
