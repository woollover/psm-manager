import { CreatePoetCommand } from "./CreatePoetcommand";
import { EditPoetCommand } from "./EditPoet.command";
import { DeletePoetCommand } from "./DeletePoet.command";

export type PoetCommands =
  | CreatePoetCommand
  | EditPoetCommand
  | DeletePoetCommand;
