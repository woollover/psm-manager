import { Handler } from "aws-lambda";
import { EventStore } from "../../../../core/src/EventStore";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Poet } from "../aggregates/Poet";

//rule of thumb: stateless instnces OUTSIDE the handler, Stateful instances inside the handler

const client = new DynamoDBClient({
  region: process.env.EVENT_STORE_TABLE_REGION,
});

const documentClient = DynamoDBDocument.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  },
});

const eventStore = new EventStore(
  process.env.EVENT_STORE_TABLE_NAME || "eu-central-1",
  documentClient
);
// instantiate the eventStore, it's stateless so we can do it outside the handler

export const handler: Handler = async (_event) => {
  const poetID = "poet-c898c914-5f1a-4bf1-8e5f-d70e73cc79f7";
  const aggregateEvents = await eventStore.getEvents(poetID);

  return {
    statusCode: 200,
    body: JSON.stringify({ events: aggregateEvents }),
  };
};
