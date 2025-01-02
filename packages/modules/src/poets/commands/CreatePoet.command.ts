import { Command } from "../../../../core/src/Command/Command";

export interface CreatePoetCommandInput {
  firstName: string;
  lastName: string;
  email: string;
}

export class CreatePoetCommand extends Command<CreatePoetCommandInput> {
  validate(input: CreatePoetCommandInput): void {
    if (!input.firstName) {
      this.append_error({
        field: "firstName",
        cue: "firstName is required",
      });
    }

    if (!input.lastName) {
      this.append_error({
        field: "lastName",
        cue: "lastName is required",
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
