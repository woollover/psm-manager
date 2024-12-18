import { Command } from "../../../../core/src/Command/Command";
export type DeletePoetCommandInput = {
  id: string;
};

export class DeletePoetCommand extends Command<DeletePoetCommandInput> {
  validate(input: DeletePoetCommandInput): void | Promise<void> {
    if (!input.id) {
      this.append_error({
        field: "id",
        cue: "Id is required",
      });
    }
  }
}
