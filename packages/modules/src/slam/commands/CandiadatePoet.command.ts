import { Command } from "@psm/core";

export interface CandidatePoetCommandInput {
  slamId: string;
  poetId: string;
}

export class CandidatePoetCommand extends Command<
  CandidatePoetCommandInput,
  "CandidatePoetCommand"
> {
  validate(input: CandidatePoetCommandInput): void | Promise<void> {
    this.validateSlamId(input).validatePoetId(input);
  }

  private validateSlamId(
    input: CandidatePoetCommandInput
  ): CandidatePoetCommand {
    if (!input.slamId) {
      this.append_error({
        field: "slamId",
        cue: "Slam ID is required",
      });
    }
    return this;
  }

  private validatePoetId(
    input: CandidatePoetCommandInput
  ): CandidatePoetCommand {
    if (!input.poetId) {
      this.append_error({
        field: "poetId",
        cue: "MC ID is required",
      });
    }
    return this;
  }
}
