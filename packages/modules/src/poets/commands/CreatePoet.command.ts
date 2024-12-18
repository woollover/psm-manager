import { Command } from "../../../../core/src/Command/Command";
export type CreatePoetCommandInput = {
  name: string;
  email: string;
};

export class CreatePoetCommand extends Command<CreatePoetCommandInput> {
  validate(input: CreatePoetCommandInput): void | Promise<void> {
    if (!input.name) {
      this.append_error({
        field: "name",
        cue: "Name is required",
      });
    }
    if (!input.email) {
      this.append_error({
        field: "email",
        cue: "Email is required",
      });
    }
  }
}
