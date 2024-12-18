import { Handler } from "aws-lambda";
import { EventStore } from "../../../../core/src/EventStore";
import {
  DynamoDBDocument,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { Poet } from "../aggregates/Poet";
import { CreatePoetCommand } from "../commands/CreatePoet.command";
import { InvalidCommandError } from "../../../../core/src/Errors/InvalidCommandError";
import { PoetSetAsMCEvent } from "../events";
import { PoetCommands } from "../commands";
import { EditPoetCommand } from "../commands/EditPoet.command";
import { SetPoetAsMCCommand } from "../commands/SetPoetAsMC.command";
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
  const poetID = "poet-ece00fdf-a0f6-426d-b271-c30283d4bcbd";
  const aggregateEvents = await eventStore.getEvents(poetID);

  const poet = new Poet(poetID);
  poet.loadFromHistory(aggregateEvents);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World", poet }),
  };
};
