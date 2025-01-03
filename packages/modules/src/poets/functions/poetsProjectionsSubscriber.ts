import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { PoetsEventFactory } from "../events/PoetsEventFactory";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { PoetsListProjector } from "../read/projectors/PoetsList.projector";
import { EventStore } from "../../../../core/src/EventStore";
import { MaterializedViewRepository } from "../../../../core/src/Repos/MaterializedViewRepo";
import { PoetsListMaterializedViewDBShape } from "../read/materialized-view/types";

const client = new DynamoDBClient({
  region: process.env.EVENT_STORE_TABLE_REGION,
});

const documentClient = DynamoDBDocument.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
    convertWithoutMapWrapper: true,
  },
});

export const handler: Handler = async (_event) => {
  // make this responding to an event :D

  console.log("envs:", process.env);

  const poetsMaterializedViewRepo =
    new MaterializedViewRepository<PoetsListMaterializedViewDBShape>({
      tablename: process.env.MATERIALIZED_VIEW_TABLE_NAME || "",
      client: documentClient,
      viewKey: "poets-list-materialized-view",
    });

  // intantiate the EventStore
  const eventStore = new EventStore(
    process.env.EVENT_STORE_TABLE_NAME!,
    documentClient
  );

  // get the materialized View from Repo
  const materializedView = await poetsMaterializedViewRepo.load();

  // instantiate the poets projector
  const poetsProjector = new PoetsListProjector({
    eventStore: eventStore,
    materializedViewData: materializedView,
  });

  // if null, recreate it
  if (materializedView == null) {
    // recreate poets projection
    console.log("No materialized view found, recreating it");
    await poetsProjector.recreateProjection({ originEventType: "PoetCreated" });
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

    const eventInstance = PoetsEventFactory.createEvent(eventType, {
      ...unmarshalledEventData,
      payload: unmarshalledEventData.payload,
    });
    // console.log("📥 Event Object", eventObject);
    poetsProjector.project(eventInstance);
  }

  // save it
  await poetsMaterializedViewRepo.save(
    poetsProjector.materializedView.viewToSave
  );
};
