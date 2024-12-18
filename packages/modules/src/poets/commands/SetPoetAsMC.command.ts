import { Command } from "../../../../core/src/Command/Command";
export type SetPoetAsMCCommandInput = {
  poetId: string;
};

export class SetPoetAsMCCommand extends Command<SetPoetAsMCCommandInput> {
  validate(input: SetPoetAsMCCommandInput): void | Promise<void> {
    if (!input.poetId) {
      this.append_error({
        field: "poetId",
        cue: "Poet ID is required",
      });
    }
  }
}
