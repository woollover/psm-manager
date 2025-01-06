import { AggregateRoot } from "@psm/core/AggregateRoot";
import {
  CreateSlamCommand,
  DeleteSlamCommand,
  SlamCommands,
} from "../commands";
import { InvalidCommandError } from "@psm/core/Errors/InvalidCommandError";
import { CountryId } from "@psm/common/constants/countries";
import { SlamEventFactory } from "../events/SlamEventsFactory";
import { SlamEvent, SlamEventPayload } from "../events";
import { CreateSlamCommandInput } from "../commands/CreateSlam.command";

export class Slam extends AggregateRoot<string> {
  private county: string | null = null;
  private countryId: CountryId | null = null;
  private city: string | null = null;
  private venue: string | null = null;
  private day: number | null = null; // validate if is a correct day max 31 min 1 according to monthIndex
  private year: number | null = null; // validate is not in the past
  private monthIndex: number | null = null; // 0-jan >> 11-dec
  private name: string | null = null;
  private mcs: Array<string> = [];
  private candidates: Array<string> = [];
  private callOpen: boolean = false;
  private poets: Array<string> = [];
  private started: boolean = false;
  private ended: boolean = false;

  constructor(public readonly id: string) {
    super(id);
  }

  protected mutate(event: SlamEvent): void {
    switch (event.eventType) {
      case "SlamCreated":
        this.countryId = event.getPayload.countryId;
        break;

      default:
        throw new Error(`event not valid ${event.getEventType}`);
    }
  }

  public async applyCommand(command: SlamCommands): Promise<Slam> {
    switch (command.commandName) {
      case "CreateSlamCommand":
        console.log("Applying CreateSlam Command");
        command.validateOrThrow(command.payload);
        // eventually do other validations over command
        const payload: SlamEventPayload<"SlamCreated"> = {
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
            payload,
          })
        );
        return this;
      case "DeleteSlamCommand":
        return this;
      default:
        throw new InvalidCommandError("Command does not exists", []);
    }
  }
}
