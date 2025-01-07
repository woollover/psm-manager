import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";
import { Slam } from "../Slam";
import {
  AssignMCCommand,
  CreateSlamCommand,
  DeleteSlamCommand,
  UnassignMCCommand,
} from "src/slam/commands";
import { InvariantValidationError } from "@psm/core/Errors/InvariantValidation.error";

describe("Slam Aggregate Tests", () => {
  describe("Class Instance", () => {
    test("should instantiate the class correctly", () => {
      const slam = new Slam("slam-1234");
      expect(slam).toBeDefined();
    });
  });

  describe("Mutate method", () => {
    beforeEach(() => {
      vitest.clearAllMocks();
    });

    afterEach(() => {
      vitest.clearAllMocks();
    });

    test("should mutate the event");
    const slam = new Slam("slam-1234");
    test("should apply the create Event Correctly", () => {
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
      expect(slam.getName).toEqual("ABCD");
      expect(slam.getCity).toEqual("ABCD");
      expect(slam.getTimestamp).toEqual(1752271200000);
      console.log(slam.uncommittedEvents);
      expect(slam.uncommittedEvents.length).toBe(1);
    });

    test("should assign the MC correctly", () => {
      slam.applyCommand(
        new AssignMCCommand("AssignMCCommand", {
          slamId: "slam-1234",
          mcId: "poet-1234",
        })
      );
      expect(slam.getMcs).toEqual(["poet-1234"]);
      expect(slam.uncommittedEvents.length).toBe(2);
    });

    test("If I try to assign  again an MC, should throw an error bcs MC is already assigned", () => {
      expect(() => {
        slam.applyCommand(
          new AssignMCCommand("AssignMCCommand", {
            slamId: "slam-1234",
            mcId: "poet-1234",
          })
        );
      }).toThrowError(new InvariantValidationError("Slam already has an MC"));
    });

    test("but if I remove the MC correctly", () => {
      slam.applyCommand(
        new UnassignMCCommand("UnassignMCCommand", {
          slamId: "slam-1234",
          mcId: "poet-1234",
        })
      );
      expect(slam.getMcs).toEqual([]);
      expect(slam.uncommittedEvents.length).toBe(3);
    });

    test("I can now add an MC again", () => {
      slam.applyCommand(
        new AssignMCCommand("AssignMCCommand", {
          slamId: "slam-1234",
          mcId: "poet-1234",
        })
      );
      expect(slam.getMcs).toEqual(["poet-1234"]);
      expect(slam.uncommittedEvents.length).toBe(4);
    });

    // lets' delete the slam:
    test("should set the event as deleted", () => {
      slam.applyCommand(
        new DeleteSlamCommand("DeleteSlamCommand", { aggregateId: "slam-1234" })
      );
      expect(slam.isDeleted).toBeTruthy();
      // check if the uncommitted events are correctly updated
      expect(slam.uncommittedEvents.length).toBe(5);
    });

    test("if I try to modify any property of a deleted slam, should throw an error", () => {
      expect(() => {
        slam.applyCommand(
          new AssignMCCommand("AssignMCCommand", {
            slamId: "slam-1234",
            mcId: "poet-1234",
          })
        );
      }).toThrowError(new InvariantValidationError("Slam is deleted"));
    });
  });
});
