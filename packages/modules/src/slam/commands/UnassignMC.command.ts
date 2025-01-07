import { Command } from "@psm/core/Command/Command";

export interface UnassignMCCommandInput {
  slamId: string;
  mcId: string;
}

export class UnassignMCCommand extends Command<
  UnassignMCCommandInput,
  "UnassignMCCommand"
> {
  validate(input: UnassignMCCommandInput): void | Promise<void> {
    this.validateSlamId(input).validateMCId(input);
  }

  private validateSlamId(input: UnassignMCCommandInput): UnassignMCCommand {
    if (!input.slamId) {
      this.append_error({
        field: "slamId",
        cue: "Slam ID is required",
      });
    }
    return this;
  }

  private validateMCId(input: UnassignMCCommandInput): UnassignMCCommand {
    if (!input.mcId) {
      this.append_error({
        field: "mcId",
        cue: "MC ID is required",
      });
    }
    return this;
  }
}
