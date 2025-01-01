import { Command } from "../../../../core/src/Command/Command";
export interface DeletePoetCommandInput {
  aggregateId: string;
}

export class DeletePoetCommand extends Command<DeletePoetCommandInput> {
  validate(input: DeletePoetCommandInput): void | Promise<void> {
    if (!input.aggregateId) {
      this.append_error({
        field: "aggregateId",
        cue: "Id is required",
      });
    }
  }
}
