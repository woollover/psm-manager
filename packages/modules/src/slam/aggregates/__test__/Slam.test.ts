import { describe, expect, test } from "vitest";
import { Slam } from "../Slam";
import { CreateSlamCommand, DeleteSlamCommand } from "src/slam/commands";

describe("Slam Aggregate Tests", () => {
  describe("Class Instance", () => {
    test("should instantiate the class correctly", () => {
      const slam = new Slam("slam-1234");
      expect(slam).toBeDefined();
    });
  });

  describe("Mutate method", () => {
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

    // lets' delete the slam:
    test("should set the event as deleted", () => {
      slam.applyCommand(
        new DeleteSlamCommand("DeleteSlamCommand", { aggregateId: "slam-1234" })
      );
      expect(slam.isDeleted).toBeTruthy();
      // check if the uncommitted events are correctly updated
      expect(slam.uncommittedEvents.length).toBe(2);
    });
  });
});
