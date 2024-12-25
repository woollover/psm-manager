import { beforeEach, describe, expect, it, vitest } from "vitest";
import { PoetsListProjector } from "../PoetsList.projector";
import { EVENTS_FIXTURE } from "../__fixtures__/EVENTS_FIXTURE";
import { EventStore } from "../../../../../../core/src/EventStore/EventStore";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const mockDynamoClient = {
  send: vitest.fn().mockResolvedValue({ Items: EVENTS_FIXTURE }),
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
  });
});
