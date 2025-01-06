import { Command } from "@psm/core/Command/Command";
export interface DeletePoetCommandInput {
  aggregateId: string;
}

export class DeletePoetCommand extends Command<
  DeletePoetCommandInput,
  "DeletePoetCommand"
> {
  validate(input: DeletePoetCommandInput): void | Promise<void> {
    if (!input.aggregateId) {
      this.append_error({
        field: "aggregateId",
        cue: "Id is required",
      });
    }
  }
}
