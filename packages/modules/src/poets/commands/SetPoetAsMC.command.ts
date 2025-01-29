import { Command } from "@psm/core";
export interface SetPoetAsMCCommandInput {
  aggregateId: string;
}

export class SetPoetAsMCCommand extends Command<
  SetPoetAsMCCommandInput,
  "SetPoetAsMCCommand"
> {
  validate(input: SetPoetAsMCCommandInput): void | Promise<void> {
    if (!input.aggregateId) {
      this.append_error({
        field: "aggregateId",
        cue: "Poet ID is required",
      });
    }
  }
}

declare module "@psm/core" {
  interface CommandRegistry {
    SetPoetAsMCCommand: SetPoetAsMCCommandInput;
  }
}
