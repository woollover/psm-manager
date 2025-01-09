import { describe, expect, test } from "vitest";
import { Slam } from "../Slam";
import {
  CandidatePoetCommand,
  CloseCallCommand,
  CreateSlamCommand,
} from "src/slam/commands";
import { OpenCallCommand } from "src/slam/commands/OpenCall.command";

describe("SlamCandidates", () => {
  // create the instnace
  const slam = new Slam("slam-1234");

  test("should be defined", () => {
    expect(slam).toBeDefined();
  });

  describe("Candidations Flow", () => {
    slam.applyCommand(
      new CreateSlamCommand("CreateSlamCommand", {
        regionalId: "ABCD",
        name: "ABCD",
        countryId: "IT",
        city: "ABCD",
        venue: "ABCD",
        day: 12,
        year: 2025,
        monthIndex: 6,
      })
    );

    test("should try to candidate a poet, but call is not open", () => {
      expect(() => {
        slam.applyCommand(
          new CandidatePoetCommand("CandidatePoetCommand", {
            slamId: "slam-1234",
            poetId: "poet-1234",
          })
        );
      }).toThrowError("Slam call is closed");
      // the uncommitted events should be 1 (the creation one)
      expect(slam.uncommittedEvents.length).toBe(1);
    });

    test("should open the call", () => {
      slam.applyCommand(
        new OpenCallCommand("OpenCallCommand", {
          slamId: "slam-1234",
        })
      );
      expect(slam.isOpen).toBe(true);
    });

    test("then we should add a candidate correctly", () => {
      slam.applyCommand(
        new CandidatePoetCommand("CandidatePoetCommand", {
          slamId: "slam-1234",
          poetId: "poet-1234",
        })
      );
      expect(slam.getCandidates).toEqual(["poet-1234"]);
      expect(slam.uncommittedEvents.length).toBe(3);
    });
    test("if we try to candidate the same poet, it will fail", () => {
      expect(() => {
        slam.applyCommand(
          new CandidatePoetCommand("CandidatePoetCommand", {
            slamId: "slam-1234",
            poetId: "poet-1234",
          })
        );
      }).toThrowError("Poet is already candidated");
    });
    test("if we close the call, we can't candidate anymore", () => {
      slam.applyCommand(
        new CloseCallCommand("CloseCallCommand", {
          slamId: "slam-1234",
        })
      );
      expect(slam.isOpen).toBe(false);
      expect(() => {
        slam.applyCommand(
          new CandidatePoetCommand("CandidatePoetCommand", {
            slamId: "slam-1234",
            poetId: "poet-1234",
          })
        );
      }).toThrowError("Slam call is closed");
    });
  });
});
