import { Command } from "@psm/core";
export interface SetPoetAsMCCommandInput {
  aggregateId: string;
}

export class SetPoetAsMCCommand extends Command<
  SetPoetAsMCCommandInput,
  "SetPooetAsMCCommand"
> {
  validate(input: SetPoetAsMCCommandInput): void | Promise<void> {
    if (!input.aggregateId) {
      this.append_error({
        field: "aggregateId",
        cue: "Poet ID is required",
      });
    }
  }
}
