import {
  CreatePoetCommand,
  DeletePoetCommand,
  EditPoetCommand,
  PoetCommandInput,
  PoetCommands,
  PoetCommandType,
  ReactivatePoetCommand,
  SetPoetAsMCCommand,
  SetPoetAsPoetCommand,
} from ".";

export class PoetCommandFactory {
  static createCommand<T extends PoetCommands["commandName"]>(
    ...args: Extract<PoetCommands, { commandName: T }> extends {
      payload: infer P;
    }
      ? [commandName: T, payload: P]
      : [commandName: T]
  ) {
    const [commandName, payload] = args;
    switch (commandName) {
      case "CreatePoetCommand":
        return new CreatePoetCommand(
          "CreatePoetCommand",
          payload as PoetCommandInput<"CreatePoetCommand">
        );
      case "EditPoetCommand":
        return new EditPoetCommand(
          "EditPoetCommand",
          payload as PoetCommandInput<"EditPoetCommand">
        );
      case "DeletePoetCommand":
        return new DeletePoetCommand(
          "DeletePoetCommand",
          payload as PoetCommandInput<"DeletePoetCommand">
        );
      case "SetPooetAsMCCommand":
        return new SetPoetAsMCCommand(
          "SetPooetAsMCCommand",
          payload as PoetCommandInput<"SetPooetAsMCCommand">
        );
      case "SetPoetAsPoetCommand":
        return new SetPoetAsPoetCommand(
          "SetPoetAsPoetCommand",
          payload as PoetCommandInput<"SetPoetAsPoetCommand">
        );
      case "ReactivatePoetCommand":
        return new ReactivatePoetCommand(
          "ReactivatePoetCommand",
          payload as PoetCommandInput<"ReactivatePoetCommand">
        );
      default:
        throw new Error(`I don't know this command ${commandName}`);
    }
  }
}
