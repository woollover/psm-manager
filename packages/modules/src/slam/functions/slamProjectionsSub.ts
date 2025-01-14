import { Handler } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { documentClient, EventStore } from "@psm/core";
import { MaterializedViewRepository } from "@psm/core";
import { SlamsListMaterializedViewDBShape } from "../read/materialized-view/SlamList.materialized-view.js";
import { SlamListProjector } from "../read/projectors/SlamList.projector.js";
import { SlamEventFactory } from "../events/SlamEvents.factory.js";

export const handler: Handler = async (_event) => {
  // make this responding to an event :D

  console.log("envs:", process.env);

  const mvRepo =
    new MaterializedViewRepository<SlamsListMaterializedViewDBShape>({
      tablename: process.env.MATERIALIZED_VIEW_TABLE_NAME || "",
      client: documentClient,
      viewKey: "slam-list",
    });

  // intantiate the EventStore
  const eventStore = new EventStore(
    process.env.EVENT_STORE_TABLE_NAME!,
    documentClient
  );

  // get the materialized View from Repo
  const materializedViewData = await mvRepo.load();

  // instantiate the  projector
  const slamsListProjector = new SlamListProjector({
    eventStore: eventStore,
    materializedViewData: materializedViewData,
  });

  // if null, recreate it
  if (materializedViewData == null) {
    // recreate poets projection
    console.log("No materialized view found, recreating it");
    await slamsListProjector.recreateProjection({
      originEventType: "SlamCreated",
    });
  }

  for (const event of _event.Records) {
    // create a factory to return the correct Event Object
    console.log("📥 Message", event);
    const eventType = event.messageAttributes.eventType.stringValue;

    // get the event body object
    const eventData = JSON.parse(event.body);
    const unmarshalledEventData = unmarshall(eventData, {
      wrapNumbers: false,
    });

    const eventInstance = SlamEventFactory.createEvent(eventType, {
      ...unmarshalledEventData,
      payload: unmarshalledEventData.payload,
    });
    // console.log("📥 Event Object", eventObject);
    slamsListProjector.project(eventInstance);
  }

  // save it
  await mvRepo.save(slamsListProjector.materializedView.viewToSave);
};
