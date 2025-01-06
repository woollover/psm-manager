import { UpdateContinuousBackupsCommand } from "@aws-sdk/client-dynamodb";
import { AggregateRoot } from "@psm/core/AggregateRoot";
import { PSMEvent } from "@psm/core/Event/Event";
import { CreateSlamCommand, SlamCommands } from "../commands";
import { InvalidCommandError } from "@psm/core/Errors/InvalidCommandError";
import { CountryId } from "@psm/common/constants/countries";
import { SlamCreatedEvent } from "../events/SlamCreated.event";
import { SlamEventFactory } from "../events/SlamEventsFactory";
import { SlamEvent } from "../events";

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
    switch (command.constructor) {
      case CreateSlamCommand:
        console.log("Applying CreateSlam Command");
        const createcommand = command as CreateSlamCommand;
        await createcommand.validateOrThrow(createcommand.payload);
        // eventually do other validations over command

        // apply the command
        this.apply(
          SlamEventFactory.createEvent("SlamCreated", {
            payload: createcommand.payload,
          })
        );
        return this;

      default:
        throw new InvalidCommandError("Command does not exists", []);
    }
  }
}
