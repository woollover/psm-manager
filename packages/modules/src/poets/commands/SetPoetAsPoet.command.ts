import { Command } from "@psm/core";
export interface SetPoetAsPoetCommandInput {
  aggregateId: string;
}

export class SetPoetAsPoetCommand extends Command<
  SetPoetAsPoetCommandInput,
  "SetPoetAsPoetCommand"
> {
  validate(input: SetPoetAsPoetCommandInput): void | Promise<void> {
    if (!input.aggregateId) {
      this.append_error({
        field: "aggregateId",
        cue: "Poet ID is required",
      });
    }
  }
}
