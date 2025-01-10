import { Command } from "@psm/core/Command/Command";

export interface AcceptPoetCommandInput {
  slamId: string;
  poetId: string;
}

export class AcceptPoetCommand extends Command<
  AcceptPoetCommandInput,
  "AcceptPoetCommand"
> {
  validate(input: AcceptPoetCommandInput): void | Promise<void> {
    this.validateSlamId(input).validateMCId(input);
  }

  private validateSlamId(input: AcceptPoetCommandInput): AcceptPoetCommand {
    if (!input.slamId) {
      this.append_error({
        field: "slamId",
        cue: "Slam ID is required",
      });
    }
    return this;
  }

  private validateMCId(input: AcceptPoetCommandInput): AcceptPoetCommand {
    if (!input.poetId) {
      this.append_error({
        field: "poetId",
        cue: "Poet ID is required",
      });
    }
    return this;
  }
}
