import { Command } from "../../../../core/src/Command/Command";
export type SetPoetAsPoetCommandInput = {
  aggregateId: string;
};

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
