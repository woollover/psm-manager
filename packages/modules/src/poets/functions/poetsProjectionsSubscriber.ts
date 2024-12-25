import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { PoetMaterializedViewRepository } from "../repository/PoetMaterializedViewRepository";
import { PoetProjector } from "../read/projectors/PoetProjector";
import { PoetsEventFactory } from "../events/PoetsEventFactory";
import { unmarshall } from "@aws-sdk/util-dynamodb";

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

  const poetsMaterializedViewRepo = new PoetMaterializedViewRepository({
    tablename: process.env.MATERIALIZED_VIEW_TABLE_NAME || "",
    client: documentClient,
  });

  // instantiate the poets projector
  const poetsProjector = new PoetProjector(poetsMaterializedViewRepo);

  for (const event of _event.Records) {
    // create a factory to return the correct Event Object

    console.log("📥 Message", event);
    const eventType = event.messageAttributes.eventType.stringValue;
    const aggregateId = event.messageAttributes.aggregateId.stringValue;
    // console.log("📥 Event Type", eventType);
    // console.log("📥 Aggregate Id", aggregateId);
    // get the event body object

    const eventData = JSON.parse(event.body);
    // console.log("📥 Event Data", eventData);
    const unmarshalledEventData = unmarshall(eventData, {
      wrapNumbers: false,
    });

    // console.log("📥 Unmarshalled Event Data", unmarshalledEventData);

    const eventObject = PoetsEventFactory.createEvent(eventType, {
      ...unmarshalledEventData,
      payload: unmarshalledEventData.payload,
    });
    // console.log("📥 Event Object", eventObject);

    await poetsProjector.project(eventObject);

    console.log(
      "📥 Poets Materialized View Repo",
      poetsProjector["poetsMaterializedViewRepository"]["materializedView"]
    );

    await poetsMaterializedViewRepo.save();
  }

  return;
};
