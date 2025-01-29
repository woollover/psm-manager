import { Command } from "@psm/core";
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

declare module "@psm/core" {
  interface CommandRegistry {
    DeletePoetCommand: DeletePoetCommandInput;
  }
}
