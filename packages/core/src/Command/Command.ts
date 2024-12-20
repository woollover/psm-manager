import {
  CommandValidationError,
  InvalidCommandError,
} from "../Errors/InvalidCommandError";

export abstract class Command<I> {
  readonly #errors: CommandValidationError<I>[] = [];
  #payload: I;

  constructor(input: I) {
    this.#payload = input;
  }

  abstract validate(input: I): void | Promise<void>;

  get errors() {
    return this.#errors;
  }

  async validateOrThrow(input: I): Promise<void> {
    console.log("Validating input:", JSON.stringify(input, null, 2));
    await this.validate(input);

    if (this.#errors.length > 0) {
      console.error(
        "Validation errors:",
        JSON.stringify(this.#errors, null, 2)
      );
      throw new InvalidCommandError("Command validation failed", this.#errors);
    }

    console.log("Validation successful, setting payload");
    this.#payload = input;
  }

  get payload(): I {
    return this.#payload;
  }

  append_error(error: CommandValidationError<I>): void {
    this.#errors.push(error);
  }
}
