import { Command } from "@psm/core";
export interface ReactivatePoetCommandInput {
  aggregateId: string;
}

export class ReactivatePoetCommand extends Command<
  ReactivatePoetCommandInput,
  "ReactivatePoetCommand"
> {
  validate(input: ReactivatePoetCommandInput): void | Promise<void> {
    if (!input.aggregateId) {
      this.append_error({
        field: "aggregateId",
        cue: "Id is required",
      });
    }
  }
}
