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
