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
    await this.validate(input);
    if (this.#errors.length > 0) {
      throw new InvalidCommandError("Command validation failed", this.#errors);
    }
    this.#payload = input;
  }

  get payload(): I {
    return this.#payload;
  }

  append_error(error: CommandValidationError<I>): void {
    this.#errors.push(error);
  }
}
