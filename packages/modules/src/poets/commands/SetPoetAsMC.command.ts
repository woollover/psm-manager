import { Command } from "@psm/core/Command/Command";
export interface SetPoetAsMCCommandInput {
  aggregateId: string;
}

export class SetPoetAsMCCommand extends Command<SetPoetAsMCCommandInput> {
  validate(input: SetPoetAsMCCommandInput): void | Promise<void> {
    if (!input.aggregateId) {
      this.append_error({
        field: "aggregateId",
        cue: "Poet ID is required",
      });
    }
  }
}
