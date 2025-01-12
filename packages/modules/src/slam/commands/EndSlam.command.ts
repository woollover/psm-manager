import { Command } from "@psm/core";

export interface EndSlamCommandInput {
  slamId: string;
}

export class EndSlamCommand extends Command<
  EndSlamCommandInput,
  "EndSlamCommand"
> {
  validate(input: EndSlamCommandInput): void | Promise<void> {
    this.validateSlamId(input);
  }

  private validateSlamId(input: EndSlamCommandInput): EndSlamCommand {
    if (!input.slamId) {
      this.append_error({
        field: "slamId",
        cue: `slam ID is required`,
      });
    }
    return this;
  }
}
