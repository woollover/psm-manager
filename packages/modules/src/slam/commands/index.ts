import { AssignMCCommand } from "./AssignMC.command";
import { CreateSlamCommand } from "./CreateSlam.command";
import { DeleteSlamCommand } from "./DeleteSlam.command";
import { EditSlamCommand } from "./EditSlam.command";

type SlamCommands =
  | CreateSlamCommand
  | DeleteSlamCommand
  | EditSlamCommand
  | AssignMCCommand;

type SlamCommandInputMap = {
  [C in SlamCommands as C["commandName"]]: C["payload"];
};

type SlamCommandType = keyof SlamCommandInputMap;

export {
  SlamCommands,
  CreateSlamCommand,
  DeleteSlamCommand,
  SlamCommandType,
  EditSlamCommand,
  AssignMCCommand,
};
