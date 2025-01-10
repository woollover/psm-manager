import { CreatePoetCommand } from "./CreatePoet.command";
import { EditPoetCommand } from "./EditPoet.command";
import { DeletePoetCommand } from "./DeletePoet.command";
import { SetPoetAsMCCommand } from "./SetPoetAsMC.command";
import { ReactivatePoetCommand } from "./ReactivatePoet.command";
import { SetPoetAsPoetCommand } from "./SetPoetAsPoet.command";

type PoetCommands =
  | CreatePoetCommand
  | EditPoetCommand
  | DeletePoetCommand
  | SetPoetAsMCCommand
  | SetPoetAsPoetCommand
  | ReactivatePoetCommand;

  // typemap of the according payload
  type PoetCommandInputMap = {
    [E in PoetCommands as E["commandName"]]: E["payload"];
  };

  // list of active event type names
  type PoetCommandType = keyof PoetCommandInputMap;


  type PoetCommandInput<E extends PoetCommandType> = PoetCommandInputMap[E];

  export {
    PoetCommands,
    CreatePoetCommand,
    EditPoetCommand,
    DeletePoetCommand,
    SetPoetAsMCCommand,
    SetPoetAsPoetCommand,
    ReactivatePoetCommand,
    PoetCommandType,
    PoetCommandInput,
  };
