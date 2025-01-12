import { Command } from "@psm/core";

export interface EditPoetCommandInput {
  aggregateId: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string; // YYYY-MM-DD format
  email?: string;
  instagramHandle?: string;
}

export class EditPoetCommand extends Command<
  EditPoetCommandInput,
  "EditPoetCommand"
> {
  validate(input: EditPoetCommandInput): void | Promise<void> {
    if (!input.aggregateId) {
      this.append_error({
        field: "aggregateId",
        cue: "aggregateId is required",
      });
    }
    if (
      !input.firstName &&
      !input.lastName &&
      !input.email &&
      !input.instagramHandle &&
      !input.birthDate
    ) {
      this.append_error({
        field: "firstName",
        cue: "at least one field is required",
      });

      this.append_error({
        field: "lastName",
        cue: "at lieast one field is required",
      });
      this.append_error({
        field: "email",
        cue: "at least one field is required",
      });
      this.append_error({
        field: "instagramHandle",
        cue: "at least one field is required",
      });
    }
  }
}
