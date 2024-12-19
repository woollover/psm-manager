import { Command } from "../../../../core/src/Command/Command";
export type ReactivatePoetCommandInput = {
  aggregateId: string;
};

export class ReactivatePoetCommand extends Command<ReactivatePoetCommandInput> {
  validate(input: ReactivatePoetCommandInput): void | Promise<void> {
    if (!input.aggregateId) {
      this.append_error({
        field: "aggregateId",
        cue: "Id is required",
      });
    }
  }
}
