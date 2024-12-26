import { beforeEach, describe, expect, it, vitest } from "vitest";
import { PoetsListProjector } from "../PoetsList.projector";
import { EVENTS_FIXTURE } from "../__fixtures__/EVENTS_FIXTURE";
import { EventStore } from "../../../../../../core/src/EventStore/EventStore";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const mockDynamoClient = {
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
      eventStore: new EventStore("null", mockDynamoClient as DynamoDBDocument),
    });
    expect(projector).toBeInstanceOf(PoetsListProjector);
  });

  it("should recreate the projection correctly", async () => {
    const projector = new PoetsListProjector({
      eventStore: new EventStore("null", mockDynamoClient as DynamoDBDocument),
    });
    await projector.recreateProjection({ originEventType: "PoetCreated" });
    const readModel = projector.readModel;
    expect(readModel.poets.length).toBe(1);
    expect(readModel.mcs.length).toBe(1);
    expect(readModel.poetsCount).toBe(1);
    expect(readModel.mcsCount).toBe(1);
    expect(readModel.totalCount).toBe(2);
    console.log(readModel);
  });
});
