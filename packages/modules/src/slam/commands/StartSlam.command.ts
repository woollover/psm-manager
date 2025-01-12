import { Command } from "@psm/core";

export interface StartSlamCommandInput {
  slamId: string;
}

export class StartSlamCommand extends Command<
  StartSlamCommandInput,
  "StartSlamCommand"
> {
  validate(input: StartSlamCommandInput): void | Promise<void> {
    this.validateSlamId(input);
  }

  private validateSlamId(input: StartSlamCommandInput): StartSlamCommand {
    if (!input.slamId) {
      this.append_error({
        field: "slamId",
        cue: `slam ID is required`,
      });
    }
    return this;
  }
}
