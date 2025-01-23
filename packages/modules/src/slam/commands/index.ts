import { AcceptPoetCommand } from "./AcceptPoet.command";
import { AssignMCCommand } from "./AssignMC.command";
import { CandidatePoetCommand } from "./CandiadatePoet.command";
import { CloseCallCommand } from "./CloseCall.command";
import { CreateSlamCommand } from "./CreateSlam.command";
import { DeleteSlamCommand } from "./DeleteSlam.command";
import { EditSlamCommand } from "./EditSlam.command";
import { EndSlamCommand } from "./EndSlam.command";
import { OpenCallCommand } from "./OpenCall.command";
import { RejectPoetCommand } from "./RejectPoet.command";
import { StartSlamCommand } from "./StartSlam.command";
import { UnassignMCCommand } from "./UnassignMC.command";

export type SlamCommands =
  | CreateSlamCommand
  | DeleteSlamCommand
  | EditSlamCommand
  | AssignMCCommand
  | UnassignMCCommand
  | OpenCallCommand
  | CloseCallCommand
  | CandidatePoetCommand
  | AcceptPoetCommand
  | RejectPoetCommand
  | StartSlamCommand
  | EndSlamCommand;

export type SlamCommandInputMap = {
  [C in SlamCommands as C["commandName"]]: C["payload"];
};

export type SlamCommandType = keyof SlamCommandInputMap;

export type SlamCommandInput<C extends SlamCommandType> =
  SlamCommandInputMap[C];

export {
  CreateSlamCommand,
  DeleteSlamCommand,
  EditSlamCommand,
  AssignMCCommand,
  UnassignMCCommand,
  CloseCallCommand,
  OpenCallCommand,
  AcceptPoetCommand,
  RejectPoetCommand,
  CandidatePoetCommand,
  StartSlamCommand,
  EndSlamCommand,
};
