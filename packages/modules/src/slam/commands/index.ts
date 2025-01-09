import { AssignMCCommand } from "./AssignMC.command";
import { CandidatePoetCommand } from "./CandiadatePoet.command";
import { CloseCallCommand } from "./CloseCall.command";
import { CreateSlamCommand } from "./CreateSlam.command";
import { DeleteSlamCommand } from "./DeleteSlam.command";
import { EditSlamCommand } from "./EditSlam.command";
import { OpenCallCommand } from "./OpenCall.command";
import { UnassignMCCommand } from "./UnassignMC.command";

type SlamCommands =
  | CreateSlamCommand
  | DeleteSlamCommand
  | EditSlamCommand
  | AssignMCCommand
  | UnassignMCCommand
  | OpenCallCommand
  | CloseCallCommand
  | CandidatePoetCommand;

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
  UnassignMCCommand,
  CloseCallCommand,
  OpenCallCommand,
  CandidatePoetCommand,
};
