import { Command } from "@psm/core/Command/Command";

export interface CloseCallCommandInput {
  slamId: string;
}

export class CloseCallCommand extends Command<
  CloseCallCommandInput,
  "CloseCallCommand"
> {
  validate(input: CloseCallCommandInput): void | Promise<void> {
    this.validateSlamId(input);
  }

  private validateSlamId(input: CloseCallCommandInput): CloseCallCommand {
    if (!input.slamId) {
      this.append_error({
        field: "slamId",
        cue: `slam ID is required`,
      });
    }
    return this;
  }
}
