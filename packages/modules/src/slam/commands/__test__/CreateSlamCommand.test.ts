import { describe, expect, test } from "vitest";
import {
  CreateSlamCommand,
  CreateSlamCommandInput,
} from "../CreateSlam.command";

describe("CreateSlamCommand", () => {
  test("should instantiate the class correctly", () => {
    const input: CreateSlamCommandInput = {
      regionalId: "",
      countryId: "AF",
      city: "",
      venue: "",
      day: 0,
      year: 0,
      monthIndex: 0,
    };
    const command = new CreateSlamCommand(input);
    expect(command).toBeDefined();
  });

  describe("invalid command inputs", () => {
    test("invalid countryID", () => {
      const input: CreateSlamCommandInput = {
        regionalId: "ABCD",
        // @ts-expect-error
        countryId: "HG",
        city: "ABCD",
        venue: "ABCD",
        day: 12,
        year: 2025,
        monthIndex: 6,
      };
      const command = new CreateSlamCommand(input);
      expect(command).toBeDefined();
      command.validate(input);
      expect(command.errors).toHaveLength(1);
    });
    test("invalid Venue name", () => {
      const input: CreateSlamCommandInput = {
        regionalId: "ABCD",
        countryId: "IT",
        city: "ABCD",
        venue: "A",
        day: 12,
        year: 2025,
        monthIndex: 6,
      };
      const command = new CreateSlamCommand(input);
      expect(command).toBeDefined();
      command.validate(input);
      expect(command.errors).toHaveLength(1);
    });
    test("invalid date input", () => {
      const input: CreateSlamCommandInput = {
        regionalId: "ABCD",
        countryId: "IT",
        city: "ABCD",
        venue: "ABCD",
        day: 31,
        year: 2025,
        monthIndex: 1,
      };
      const command = new CreateSlamCommand(input);
      expect(command).toBeDefined();
      command.validate(input);
      expect(command.errors).toHaveLength(2);
    });
  });
});
