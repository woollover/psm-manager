import { SlamCommands } from "../commands";
import { SlamEventFactory } from "../events/SlamEvents.factory";
import { SlamEvent, SlamEventPayload } from "../events";
import {
  AggregateRoot,
  InvalidCommandError,
  InvariantValidationError,
} from "@psm/core";
import { CountryId } from "@psm/common";

export class Slam extends AggregateRoot {
  private regionalId: string | null = null; // county name
  private countryId: CountryId | null = null; // Country ID
  private city: string | null = null; // city Name
  private venue: string | null = null; // Venue Name
  private dateTime: number | null = null; // Date of the Slam
  private name: string | null = null; // Title of the Slam
  private mcs: Array<string> = []; // Poet IDs and MCs
  private candidates: Array<string> = [];
  private callOpen: boolean = false;
  private poets: Array<string> = [];
  private started: boolean = false;
  private ended: boolean = false;
  private deleted: boolean = false;

  protected mutate(event: SlamEvent): void {
    console.log("EVENT PAYLOAD ====> ", event.payload);
    switch (event.eventType) {
      case "SlamCreated":
        this.countryId = event.payload.countryId;
        this.regionalId = event.payload.regionalId;
        this.city = event.payload.city;
        this.venue = event.payload.venue;
        this.dateTime = event.payload.dateTime;
        this.name = event.payload.name;
        break;

      case "SlamDeleted":
        this.deleted = true;
        break;

      case "SlamEdited":
        this.countryId = event.payload.countryId
          ? event.payload.countryId
          : this.countryId;
        this.regionalId = event.payload.regionalId
          ? event.payload.regionalId
          : this.regionalId;
        this.city = event.payload.city ? event.payload.city : this.city;
        this.venue = event.payload.venue ? event.payload.venue : this.venue;
        this.dateTime = event.payload.dateTime
          ? event.payload.dateTime
          : this.dateTime;
        this.name = event.payload.name ? event.payload.name : this.name;
        break;

      case "MCAssigned":
        this.ensureSlamIsNotDeleted()
          .ensureSlamHasNotAlreadyAnMC()
          .ensureMcIsNotAssigned(event.payload.mcId)
          .ensureSlamIsNotStarted()
          .ensureSlamIsNotEnded()
          .ensureSlamHasNotAlreadyAnMC();

        this.mcs.push(event.payload.mcId);
        break;

      case "MCUnassigned":
        this.ensureSlamIsNotDeleted()
          .ensureSlamIsNotStarted()
          .ensureSlamIsNotEnded()
          .ensureSlamHasThisMCAssinged(event.payload.mcId);
        this.mcs = this.mcs.filter((mc) => mc !== event.payload.mcId);
        break;

      case "PoetCandidated":
        this.ensureSlamIsNotDeleted()
          .ensureSalmAcceptCandidates()
          .ensurePoetIsNotAlreadyCandidate(event.payload.poetId);

        this.candidates.push(event.payload.poetId);
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
          .ensurePoetIsCandidate(event.payload.poetId);

        this.poets.push(event.payload.poetId);

        break;

      case "PoetRejected":
        this.ensureSlamIsNotDeleted()
          .ensureSlamIsNotStarted()
          .ensureSlamIsNotEnded()
          .ensureSlamCallIsOpen()
          .ensurePoetIsCandidate(event.payload.poetId);
        if (this.poets.includes(event.payload.poetId)) {
          this.poets = this.poets.filter(
            (poet) => poet !== event.payload.poetId
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

        this.ensureSlamIsNotDeleted().ensureSlamIsNotEnded();
        this.ended = true;
        break;

      default:
        //@ts-expect-error
        throw new Error(`event not valid ${event.eventType}`);
    }
  }

  async applyCommand(command: SlamCommands): Promise<void> {
    switch (command.commandName) {
      case "CreateSlamCommand":
        console.log("Applying CreateSlam Command");
        await command.validateOrThrow(command.payload);
        // eventually do other validations over command
        const slamCreatedPayload: SlamEventPayload<"SlamCreated"> = {
          name: command.payload.name,
          regionalId: command.payload.regionalId,
          countryId: command.payload.countryId,
          city: command.payload.city,
          venue: command.payload.venue,
          dateTime: new Date(
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
        await command.validateOrThrow(command.payload);
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

        await command.validateOrThrow(command.payload);

        const slamEditedPayload: SlamEventPayload<"SlamEdited"> = {
          name: command.payload.name,
          regionalId: command.payload.regionalId,
          countryId: command.payload.countryId,
          city: command.payload.city,
          venue: command.payload.venue,
          dateTime:
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

        await command.validateOrThrow(command.payload);

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

        await command.validateOrThrow(command.payload);
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

        await command.validateOrThrow(command.payload);
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
        await command.validateOrThrow(command.payload);
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
        await command.validateOrThrow(command.payload);
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
        await command.validateOrThrow(command.payload);
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
        await command.validateOrThrow(command.payload);
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

      case "EndSlamCommand":
        console.log("Applying EndSlam Command");
        await command.validateOrThrow(command.payload);
        const slamEndedPayload: SlamEventPayload<"SlamEnded"> = {};
        this.apply(
          SlamEventFactory.createEvent("SlamEnded", {
            payload: slamEndedPayload,
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

  get getDateTime() {
    return this.dateTime;
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
