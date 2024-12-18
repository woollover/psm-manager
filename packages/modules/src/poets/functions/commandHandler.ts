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
  console.log("📥 Lambda ENV:", process.env);

  const body = JSON.parse(_event.body!);
  console.log("📥 Body received:", body);
  const aggregateId = body.aggregateId ?? `poet-${randomUUID()}`;

  let result = {};
  try {
    // pull up the aggregate
    // insert backticks around aggregateId

    console.log("📥 Aggregate ID:", aggregateId);
    // load from history from event store and rehydrate the aggregate
    const aggregateEvents = await eventStore.getEvents(aggregateId);
    console.log("📥 Aggregate events:", aggregateEvents);
    // create the aggregate class
    const poet = new Poet(aggregateId);
    poet.loadFromHistory(aggregateEvents);
    console.log("📥 Poet:", poet);

    switch (body.command) {
      // apply the command
      case "create-poet":
        const command = new CreatePoetCommand(body.payload);
        try {
          result = await poet.applyCommand(command);
        } catch (error) {
          console.log("🚀 Command errors:", command.errors);
          throw error;
        }
        console.log("🚀 after applyCommand:", result);
        // persist uncommitted events
        await eventStore.saveEvents(poet.getUncommittedEvents());

        break;
      case "update":
        break;
      default:
        throw new Error("Invalid command");
    }

    // return the result
  } catch (error) {
    if (error instanceof InvalidCommandError) {
      return {
        statusCode: 403,
        body: { message: "Invalid command", errors: error.errors },
      };
    }
    return {
      statusCode: 500,
      body: { message: "unknown error", error },
    };
  }
  return {
    statusCode: 200,
    body: {
      message: "Command processed successfully",
      result,
      aggregateID: aggregateId,
    },
  };
};
