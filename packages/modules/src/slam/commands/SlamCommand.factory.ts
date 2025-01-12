import { Command } from "@psm/core";
import {
  AcceptPoetCommand,
  AssignMCCommand,
  CandidatePoetCommand,
  CloseCallCommand,
  CreateSlamCommand,
  DeleteSlamCommand,
  EditSlamCommand,
  EndSlamCommand,
  OpenCallCommand,
  RejectPoetCommand,
  SlamCommandInput,
  SlamCommands,
  StartSlamCommand,
  UnassignMCCommand,
} from ".";

export class SlamCommandFactory {
  static createCommand<T extends SlamCommands["commandName"]>(
    ...args: Extract<SlamCommands, { commandName: T }> extends {
      payload: infer P;
    }
      ? [commandName: T, payload: P]
      : [commandName: T]
  ) {
    const [commandName, payload] = args;

    switch (commandName) {
      case "CreateSlamCommand":
        return new CreateSlamCommand(
          "CreateSlamCommand",
          payload as SlamCommandInput<"CreateSlamCommand">
        );

      case "AcceptPoetCommand":
        return new AcceptPoetCommand(
          "AcceptPoetCommand",
          payload as SlamCommandInput<"AcceptPoetCommand">
        );
      case "AssignMCCommand":
        return new AssignMCCommand(
          "AssignMCCommand",
          payload as SlamCommandInput<"AssignMCCommand">
        );
      case "CandidatePoetCommand":
        return new CandidatePoetCommand(
          "CandidatePoetCommand",
          payload as SlamCommandInput<"CandidatePoetCommand">
        );
      case "CloseCallCommand":
        return new CloseCallCommand(
          "CloseCallCommand",
          payload as SlamCommandInput<"CloseCallCommand">
        );
      case "DeleteSlamCommand":
        return new DeleteSlamCommand(
          "DeleteSlamCommand",
          payload as SlamCommandInput<"DeleteSlamCommand">
        );
      case "EditSlamCommand":
        return new EditSlamCommand(
          "EditSlamCommand",
          payload as SlamCommandInput<"EditSlamCommand">
        );
      case "EndSlamCommand":
        return new EndSlamCommand(
          "EndSlamCommand",
          payload as SlamCommandInput<"EndSlamCommand">
        );
      case "OpenCallCommand":
        return new OpenCallCommand(
          "OpenCallCommand",
          payload as SlamCommandInput<"OpenCallCommand">
        );
      case "RejectPoetCommand":
        return new RejectPoetCommand(
          "RejectPoetCommand",
          payload as SlamCommandInput<"RejectPoetCommand">
        );
      case "StartSlamCommand":
        return new StartSlamCommand(
          "StartSlamCommand",
          payload as SlamCommandInput<"StartSlamCommand">
        );
      case "UnassignMCCommand":
        return new UnassignMCCommand(
          "UnassignMCCommand",
          payload as SlamCommandInput<"UnassignMCCommand">
        );

      default:
        throw new Error(
          `I don't know this command ${commandName}, valid commands are ${this.validCommandNames}`
        );
    }
  }

  static validCommandNames(): Array<SlamCommands["commandName"]> {
    const commands = [
      AcceptPoetCommand,
      AssignMCCommand,
      CandidatePoetCommand,
      CloseCallCommand,
      CreateSlamCommand,
      DeleteSlamCommand,
      EditSlamCommand,
      EndSlamCommand,
      OpenCallCommand,
      RejectPoetCommand,
      StartSlamCommand,
      UnassignMCCommand,
    ];

    return commands.map((c) => c.name as SlamCommands["commandName"]);
  }
}
