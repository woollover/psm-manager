import { CreateSlamCommand } from "./CreateSlam.command";
import { DeleteSlamCommand } from "./DeleteSlam.command";
import { EditSlamCommand } from "./EditSlam.command";

type SlamCommands = CreateSlamCommand | DeleteSlamCommand | EditSlamCommand;

type SlamCommandInputMap = {
  [C in SlamCommands as C["commandName"]]: C["payload"];
};

type SlamCommandType = keyof SlamCommandInputMap;

export { SlamCommands, CreateSlamCommand, DeleteSlamCommand, SlamCommandType };
