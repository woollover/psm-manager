import { Command } from "@psm/core";

export interface UnassignMCCommandInput {
  slamId: string;
  mcId: string;
}

export class AssignMCCommand extends Command<
  UnassignMCCommandInput,
  "UnassignMCCommand"
> {
  validate(input: UnassignMCCommandInput): void | Promise<void> {
    this.validateSlamId(input).validateMCId(input);
  }

  private validateSlamId(input: UnassignMCCommandInput): AssignMCCommand {
    if (!input.slamId) {
      this.append_error({
        field: "slamId",
        cue: "Slam ID is required",
      });
    }
    return this;
  }

  private validateMCId(input: UnassignMCCommandInput): AssignMCCommand {
    if (!input.mcId) {
      this.append_error({
        field: "mcId",
        cue: "MC ID is required",
      });
    }
    return this;
  }
}
