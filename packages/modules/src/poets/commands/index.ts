import { CreatePoetCommand } from "./CreatePoet.command";
import { EditPoetCommand } from "./EditPoet.command";
import { DeletePoetCommand } from "./DeletePoet.command";
import { SetPoetAsMCCommand } from "./SetPoetAsMC.command";
import { ReactivatePoetCommand } from "./ReactivatePoet.command";
import { SetPoetAsPoetCommand } from "./SetPoetAsPoet.command";

export type PoetCommands =
  | CreatePoetCommand
  | EditPoetCommand
  | DeletePoetCommand
  | SetPoetAsMCCommand
  | SetPoetAsPoetCommand
  | ReactivatePoetCommand;

// typemap of the according payload
export type PoetCommandInputMap = {
  [E in PoetCommands as E["commandName"]]: E["payload"];
};

// list of active event type names
export type PoetCommandType = keyof PoetCommandInputMap;

export type PoetCommandInput<E extends PoetCommandType> =
  PoetCommandInputMap[E];

export {
  CreatePoetCommand,
  EditPoetCommand,
  DeletePoetCommand,
  SetPoetAsMCCommand,
  SetPoetAsPoetCommand,
  ReactivatePoetCommand,
};
