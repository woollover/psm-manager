import { Command } from "@psm/core/Command/Command";

export interface RejectPoetCommandInput {
  slamId: string;
  poetId: string;
  reason: string;
}

export class RejectPoetCommand extends Command<
  RejectPoetCommandInput,
  "RejectPoetCommand"
> {
  validate(input: RejectPoetCommandInput): void | Promise<void> {
    this.validateSlamId(input).validatePoetId(input).validateReason(input);
  }

  private validateSlamId(input: RejectPoetCommandInput): RejectPoetCommand {
    if (!input.slamId) {
      this.append_error({
        field: "slamId",
        cue: "Slam ID is required",
      });
    }
    return this;
  }

  private validatePoetId(input: RejectPoetCommandInput): RejectPoetCommand {
    if (!input.poetId) {
      this.append_error({
        field: "poetId",
        cue: "Poet ID is required",
      });
    }
    return this;
  }
  private validateReason(input: RejectPoetCommandInput): RejectPoetCommand {
    if (!input.reason) {
      this.append_error({
        field: "reason",
        cue: "Poet ID is required",
      });
    }
    return this;
  }
}
