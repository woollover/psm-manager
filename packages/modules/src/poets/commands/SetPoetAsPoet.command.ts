import { Command } from "@psm/core/Command/Command";
export interface SetPoetAsPoetCommandInput {
  aggregateId: string;
}

export class SetPoetAsPoetCommand extends Command<SetPoetAsPoetCommandInput> {
  validate(input: SetPoetAsPoetCommandInput): void | Promise<void> {
    if (!input.aggregateId) {
      this.append_error({
        field: "aggregateId",
        cue: "Poet ID is required",
      });
    }
  }
}
