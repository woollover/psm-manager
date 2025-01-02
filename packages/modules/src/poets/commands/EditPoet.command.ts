import { Command } from "../../../../core/src/Command/Command";
export interface EditPoetCommandInput {
  aggregateId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  instagram_handle?: string;
}

export class EditPoetCommand extends Command<EditPoetCommandInput> {
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
      !input.instagram_handle
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
        field: "instagram_handle",
        cue: "at least one field is required",
      });
    }
  }
}
