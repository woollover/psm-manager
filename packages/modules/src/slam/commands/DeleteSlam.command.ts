import { Command } from "@psm/core/Command/Command";

export interface DeleteSlamCommandInput {
  aggregateId: string;
}

export class DeleteSlamCommand extends Command<
  DeleteSlamCommandInput,
  "DeleteSlamCommand"
> {
  validate(input: DeleteSlamCommandInput): void | Promise<void> {
    this.validateAggregateId(input);
  }

  private validateAggregateId(
    input: DeleteSlamCommandInput
  ): DeleteSlamCommand {
    if (!input.aggregateId) {
      this.append_error({
        field: "aggregateId",
        cue: `aggregate ID is required`,
      });
    }
    return this;
  }
}
