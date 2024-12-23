import { Handler } from "aws-lambda";
import { MaterializedViewRepository } from "../../../../core/src/Repos/MaterializedViewRepo";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { PoetMaterializedView } from "../read/materialized-view/Poet.materialized-view";
import { PoetMaterializedViewRepository } from "../repository/PoetMaterializedViewRepository";
import { PoetProjector } from "../read/projectors/PoetProjector";
import { PoetEditedEvent, PoetEvent } from "../events";
import { event } from "sst/event";
import { PoetsEventFactory } from "../events/PoetsEventFactory";

const client = new DynamoDBClient({
  region: process.env.EVENT_STORE_TABLE_REGION,
});

const documentClient = DynamoDBDocument.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  },
});
export const handler: Handler = async (_event) => {
  console.log(
    "📥 Event received in poets projections subscriber queue:",
    _event
  );
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
    const eventType = event.messageAttributes.eventType.S;
    const aggregateId = event.messageAttributes.aggregateId.S;
    // get the event body object

    const eventData = JSON.parse(event.body);
    console.log("📥 Event Data", eventData);

    const eventObject = PoetsEventFactory.createEvent(eventType, eventData);
    console.log("📥 Event Object", eventObject);

    await poetsProjector.project(eventObject);

    await poetsMaterializedViewRepo.save();
  }

  return;
};
