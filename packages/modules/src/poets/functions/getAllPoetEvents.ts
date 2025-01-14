import { Handler } from "aws-lambda";
import { EventStore } from "@psm/core";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

//rule of thumb: stateless instnces OUTSIDE the handler, Stateful instances inside the handler

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

const eventStore = new EventStore(
  process.env.EVENT_STORE_TABLE_NAME || "eu-central-1",
  documentClient
);
// instantiate the eventStore, it's stateless so we can do it outside the handler

export const handler: Handler = async (_event) => {
  const aggregateId = "poet-9b00c375-7b02-48e8-9d57-dbeb15ebb032";
  const aggregateEvents = await eventStore.getEvents(aggregateId);
  const events = await eventStore.getEventsByType("PoetCreated");
  const globalIndexFilteredEvents = await eventStore.getEventsByGlobalOffset(
    6,
    10
  );

  return {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode: 200,
    body: JSON.stringify({
      aggregateEvents: aggregateEvents,
      createdPoetEvents: events,
      globalIndexFilteredEvents: globalIndexFilteredEvents,
    }),
  };
};
