import { Command } from "../../../../core/src/Command/Command";
export type EditPoetCommandInput = {
  id: string;
  name?: string;
  email?: string;
  instagram_handle?: string;
};

export class EditPoetCommand extends Command<EditPoetCommandInput> {
  validate(input: EditPoetCommandInput): void | Promise<void> {
    if (!input.id) {
      this.append_error({
        field: "id",
        cue: "Id is required",
      });
    }
    if (!input.name && !input.email && !input.instagram_handle) {
      this.append_error({
        field: "name",
        cue: "at least one field is required",
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
