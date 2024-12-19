import { APIGatewayProxyResultV2, Handler } from "aws-lambda";
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
  const body = JSON.parse(_event.body!);
  console.log("📥 Body received:", body);
  const aggregateId = body.payload.aggregateId || `poet-${randomUUID()}`;

  let result = {};

  // pull up the aggregate
  // insert backticks around aggregateId

  console.log("📥 Aggregate ID:", aggregateId);
  // load from history from event store and rehydrate the aggregate
  const aggregateEvents = await eventStore.getEvents(aggregateId);
  console.log("📥 Aggregate events:", aggregateEvents);
  // create the aggregate class
  const poet = new Poet(aggregateId);

  try {
    poet.loadFromHistory(aggregateEvents);

    console.log("🔍 Hydrated Poet:", poet);

    switch (body.command) {
      // apply the command
      case "create-poet":
        const createCommand = new CreatePoetCommand(body.payload);
        try {
          await poet.applyCommand(createCommand);
        } catch (error) {
          console.log("🚀 Command errors:", createCommand.errors);
          throw error;
        }
        console.log("🚀 after applyCommand:", result);

        break;
      case "edit-poet":
        console.log("🚀 Editing poet");
        const editCommand = new EditPoetCommand(body.payload);
        try {
          await poet.applyCommand(editCommand);
        } catch (error) {
          console.log("🚀 Command errors:", editCommand.errors);
          throw error;
        }
        break;

      case "set-poet-as-mc":
        const setAsMCCommand = new SetPoetAsMCCommand(body.payload);
        try {
          await poet.applyCommand(setAsMCCommand);
        } catch (error) {
          console.log("🚀 Command errors:", setAsMCCommand.errors);
          throw error;
        }
        break;
      default:
        throw new Error("Invalid command");
    }
    // persist uncommitted events
    await eventStore.saveEvents(poet.getUncommittedEvents());

    // clear uncommitted events in the aggregate
    poet.clearUncommittedEvents();

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

  const response: APIGatewayProxyResultV2 = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Command processed successfully",
      poet,
      aggregateID: aggregateId,
    }),
  };

  return response;
};
