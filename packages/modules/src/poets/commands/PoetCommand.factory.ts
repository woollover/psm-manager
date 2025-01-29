import {
  CreatePoetCommand,
  DeletePoetCommand,
  EditPoetCommand,
  PoetCommandInput,
  PoetCommands,
  ReactivatePoetCommand,
  SetPoetAsMCCommand,
  SetPoetAsPoetCommand,
} from ".";

import type { Command, CommandRegistry } from "@psm/core";

export class PoetCommandFactory {
  static createCommand<T extends keyof CommandRegistry>(
    commandName: T,
    payload: CommandRegistry[T]
  ) {
    switch (commandName) {
      case "CreatePoetCommand":
        return new CreatePoetCommand(
          "CreatePoetCommand",
          payload as CommandRegistry["CreatePoetCommand"]
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
      case "SetPoetAsMCCommand":
        return new SetPoetAsMCCommand(
          "SetPoetAsMCCommand",
          payload as PoetCommandInput<"SetPoetAsMCCommand">
        );
      case "SetPoetAsPoetCommand":
        return new SetPoetAsPoetCommand(
          "SetPoetAsPoetCommand",
          payload as CommandRegistry["SetPoetAsPoetCommand"]
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
