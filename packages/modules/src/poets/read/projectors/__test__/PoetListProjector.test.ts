import { beforeEach, describe, expect, it, vitest } from "vitest";
import { PoetsListProjector } from "../PoetsList.projector";
import { EVENTS_FIXTURE } from "../__fixtures__/EVENTS_FIXTURE";
import { EventStore } from "../../../../../../core/src/EventStore/EventStore";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const mockDynamoClientOnEventStore = {
  send: vitest.fn().mockImplementation((command) => {
    // Check command name to return different responses
    if (command.constructor.name === "QueryCommand") {
      // If IndexName is 'eventTypeIndex', it's getEventsByType
      if (command.input.IndexName === "eventTypeIndex") {
        return {
          Items: EVENTS_FIXTURE.filter(
            (event) => event.eventType === "PoetCreated"
          ),
        };
      }
      // Otherwise it's getEvents for a specific aggregateId
      return {
        Items: EVENTS_FIXTURE.filter(
          (event) =>
            event.aggregateId === command.input.ExpressionAttributeValues[":id"]
        ),
      };
    }
    return { Items: [] };
  }),
} as unknown as DynamoDBDocument;

describe("PoetsListProjector", () => {
  beforeEach(() => {
    vitest.clearAllMocks();
  });
  it("should instantiate the class correctly", () => {
    const projector = new PoetsListProjector({
      eventStore: new EventStore(
        "null",
        mockDynamoClientOnEventStore as DynamoDBDocument
      ),
    });
    expect(projector).toBeInstanceOf(PoetsListProjector);
  });

  it("should recreate the projection correctly", async () => {
    const projector = new PoetsListProjector({
      eventStore: new EventStore(
        "null",
        mockDynamoClientOnEventStore as DynamoDBDocument
      ),
    });
    await projector.recreateProjection({ originEventType: "PoetCreated" });
    const materializedView = projector["materializedView"];
    expect(materializedView.poets.length).toBe(1);
    expect(materializedView.MCs.length).toBe(1);
    expect(materializedView.poetsCount).toBe(1);
    expect(materializedView.MCsCount).toBe(1);
    expect(materializedView.totalCount).toBe(2);
    console.log(materializedView);
  });
});
