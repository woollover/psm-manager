import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { PoetsListMaterializedViewRepo } from "../repository/PoetMaterializedViewRepository";
import { PoetsEventFactory } from "../events/PoetsEventFactory";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { PoetsListProjector } from "../read/projectors/PoetsList.projector";
import { EventStore } from "../../../../core/src/EventStore";

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

  const poetsMaterializedViewRepo = new PoetsListMaterializedViewRepo({
    tablename: process.env.MATERIALIZED_VIEW_TABLE_NAME || "",
    client: documentClient,
  });

  // intantiate the EventStore
  const eventStore = new EventStore(
    process.env.EVENT_STORE_TABLE!,
    documentClient
  );

  // instantiate the poets projector
  const poetsProjector = new PoetsListProjector({ eventStore: eventStore });

  // get the materialized View from Repo
  const materializedView = await poetsMaterializedViewRepo.load();

  // if null, recreate it

  // recreate poets projection
  await poetsProjector.recreateProjection({ originEventType: "PoetCreated" });

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

    await poetsMaterializedViewRepo.save();
  }

  return;
};
