import { Command } from "../../../../core/src/Command/Command";
export interface CreatePoetCommandInput {
  name: string;
  email: string;
}

export class CreatePoetCommand extends Command<CreatePoetCommandInput> {
  validate(input: CreatePoetCommandInput): void {
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
