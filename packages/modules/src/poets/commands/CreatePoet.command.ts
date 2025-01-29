import { Command } from "@psm/core";

export interface CreatePoetCommandInput {
  firstName: string;
  lastName: string;
  birthDate: string; // a "YYYY-MM-DD" format
  email: string;
  instagramHandle: string;
}

export class CreatePoetCommand extends Command<
  CreatePoetCommandInput,
  "CreatePoetCommand"
> {
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

    if (!input.birthDate) {
      this.append_error({
        field: "birthDate",
        cue: "Birth Date is required",
      });
    }
  }
}

declare module "@psm/core" {
  interface CommandRegistry {
    CreatePoetCommand: CreatePoetCommandInput;
    //^?
  }
}
