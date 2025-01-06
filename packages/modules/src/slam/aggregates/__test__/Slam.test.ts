import { describe, expect, test } from "vitest";
import { Slam } from "../Slam";

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
  });
});
