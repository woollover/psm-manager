import {
  CommandValidationError,
  InvalidCommandError,
} from "../Errors/InvalidCommand.error";

export abstract class Command<I, CommandName extends string> {
  #commandName: CommandName;
  readonly #errors: CommandValidationError<I>[] = [];
  #payload: I;

  constructor(commandName: CommandName, input: I) {
    this.#payload = input;
    this.#commandName = commandName;
  }

  abstract validate(input: I): void | Promise<void>;

  get commandName(): CommandName {
    return this.#commandName;
  }
  get errors() {
    return this.#errors;
  }

  async validateOrThrow(input: I): Promise<void> {
    console.log("Command - Validating input:", JSON.stringify(input, null, 2));
    await this.validate(input);

    if (this.#errors.length > 0) {
      console.error(
        "Validation errors:",
        JSON.stringify(this.#errors, null, 2)
      );
      throw new InvalidCommandError("Command validation failed", this.#errors);
    }

    console.log("Command - Validation successful, setting payload");
    this.#payload = input;
  }

  get payload(): I {
    return this.#payload;
  }

  append_error(error: CommandValidationError<I>): void {
    this.#errors.push(error);
  }
}
