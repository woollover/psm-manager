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
  SlamCommandType,
  StartSlamCommand,
  UnassignMCCommand,
} from ".";

export class SlamCommandFactory {
  static createCommand(
    commandType: SlamCommandType,
    commandInput: Record<string, any>
  ) {
    switch (commandType) {
      case "CreateSlamCommand":
        return new CreateSlamCommand(
          "CreateSlamCommand",
          commandInput as SlamCommandInput<"CreateSlamCommand">
        );

      case "AcceptPoetCommand":
        return new AcceptPoetCommand(
          "AcceptPoetCommand",
          commandInput as SlamCommandInput<"AcceptPoetCommand">
        );
      case "AssignMCCommand":
        return new AssignMCCommand(
          "AssignMCCommand",
          commandInput as SlamCommandInput<"AssignMCCommand">
        );
      case "CandidatePoetCommand":
        return new CandidatePoetCommand(
          "CandidatePoetCommand",
          commandInput as SlamCommandInput<"CandidatePoetCommand">
        );
      case "CloseCallCommand":
        return new CloseCallCommand(
          "CloseCallCommand",
          commandInput as SlamCommandInput<"CloseCallCommand">
        );
      case "DeleteSlamCommand":
        return new DeleteSlamCommand(
          "DeleteSlamCommand",
          commandInput as SlamCommandInput<"DeleteSlamCommand">
        );
      case "EditSlamCommand":
        return new EditSlamCommand(
          "EditSlamCommand",
          commandInput as SlamCommandInput<"EditSlamCommand">
        );
      case "EndSlamCommand":
        return new EndSlamCommand(
          "EndSlamCommand",
          commandInput as SlamCommandInput<"EndSlamCommand">
        );
      case "OpenCallCommand":
        return new OpenCallCommand(
          "OpenCallCommand",
          commandInput as SlamCommandInput<"OpenCallCommand">
        );
      case "RejectPoetCommand":
        return new RejectPoetCommand(
          "RejectPoetCommand",
          commandInput as SlamCommandInput<"RejectPoetCommand">
        );
      case "StartSlamCommand":
        return new StartSlamCommand(
          "StartSlamCommand",
          commandInput as SlamCommandInput<"StartSlamCommand">
        );
      case "UnassignMCCommand":
        return new UnassignMCCommand(
          "UnassignMCCommand",
          commandInput as SlamCommandInput<"UnassignMCCommand">
        );

      default:
        throw new Error(`I don't know this command ${commandType}`);
    }
  }
}
