import { Command } from "@psm/core";

export interface AssignMCCommandInput {
  slamId: string;
  mcId: string;
}

export class AssignMCCommand extends Command<
  AssignMCCommandInput,
  "AssignMCCommand"
> {
  validate(input: AssignMCCommandInput): void | Promise<void> {
    this.validateSlamId(input).validateMCId(input);
  }

  private validateSlamId(input: AssignMCCommandInput): AssignMCCommand {
    if (!input.slamId) {
      this.append_error({
        field: "slamId",
        cue: "Slam ID is required",
      });
    }
    return this;
  }

  private validateMCId(input: AssignMCCommandInput): AssignMCCommand {
    if (!input.mcId) {
      this.append_error({
        field: "mcId",
        cue: "MC ID is required",
      });
    }
    return this;
  }
}
