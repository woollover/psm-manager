import { Command } from "@psm/core/Command/Command";

export interface OpenCallCommandInput {
  slamId: string;
}

export class OpenCallCommand extends Command<
  OpenCallCommandInput,
  "OpenCallCommand"
> {
  validate(input: OpenCallCommandInput): void | Promise<void> {
    this.validateSlamId(input);
  }

  private validateSlamId(input: OpenCallCommandInput): OpenCallCommand {
    if (!input.slamId) {
      this.append_error({
        field: "slamId",
        cue: `slam ID is required`,
      });
    }
    return this;
  }
}
