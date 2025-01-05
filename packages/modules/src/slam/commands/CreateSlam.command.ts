import { Command } from "@psm/core/Command/Command";

export interface CreateSlamCommandInput {
  regionalId: string;
  nation: string;
  city: string;
  venue: string;
  day: number; // validatei is a correct day max 31 min 1
  year: number; // validate is not in the past
  monthIndex: number; // 0-jan >> 11-dec
}
export class CreateSlamCommand extends Command<CreateSlamCommandInput> {
  validate(input: CreateSlamCommandInput): void | Promise<void> {
    throw new Error("Method not implemented.");
  }
}
