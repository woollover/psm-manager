import {
  CreatePoetCommand,
  DeletePoetCommand,
  EditPoetCommand,
  PoetCommandInput,
  PoetCommandType,
  ReactivatePoetCommand,
  SetPoetAsMCCommand,
  SetPoetAsPoetCommand,
} from ".";

export class PoetCommandFactory {
  static createCommand(
    commandName: PoetCommandType,
    commandInput: Record<string, any>
  ) {
    switch (commandName) {
      case "CreatePoetCommand":
        return new CreatePoetCommand(
          "CreatePoetCommand",
          commandInput as PoetCommandInput<"CreatePoetCommand">
        );
      case "EditPoetCommand":
        return new EditPoetCommand(
          "EditPoetCommand",
          commandInput as PoetCommandInput<"EditPoetCommand">
        );
      case "DeletePoetCommand":
        return new DeletePoetCommand(
          "DeletePoetCommand",
          commandInput as PoetCommandInput<"DeletePoetCommand">
        );
      case "SetPooetAsMCCommand":
        return new SetPoetAsMCCommand(
          "SetPooetAsMCCommand",
          commandInput as PoetCommandInput<"SetPooetAsMCCommand">
        );
      case "SetPoetAsPoetCommand":
        return new SetPoetAsPoetCommand(
          "SetPoetAsPoetCommand",
          commandInput as PoetCommandInput<"SetPoetAsPoetCommand">
        );
      case "ReactivatePoetCommand":
        return new ReactivatePoetCommand(
          "ReactivatePoetCommand",
          commandInput as PoetCommandInput<"ReactivatePoetCommand">
        );
      default:
        throw new Error(`I don't know this command ${commandName}`);
    }
  }
}
