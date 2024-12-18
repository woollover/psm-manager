import { Command } from "../../../../core/src/Command/Command";
export type SetPoetAsMCCommandInput = {
  aggregateId: string;
};

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
