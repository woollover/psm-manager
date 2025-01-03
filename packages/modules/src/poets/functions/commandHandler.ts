import { APIGatewayProxyResultV2, Handler } from "aws-lambda";
import { EventStore } from "../../../../core/src/EventStore";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";
import { Poet } from "../aggregates/Poet";
import { CreatePoetCommand } from "../commands/CreatePoet.command";
import { InvalidCommandError } from "../../../../core/src/Errors/InvalidCommandError";
import { EditPoetCommand } from "../commands/EditPoet.command";
import { SetPoetAsMCCommand } from "../commands/SetPoetAsMC.command";
import { SetPoetAsPoetCommand } from "../commands/SetPoetAsPoet.command";
import { DeletePoetCommand } from "../commands/DeletePoet.command";
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
  const body = JSON.parse(_event.body!);
  console.log("📥 Body received:", body);

  const aggregateId = body.payload.aggregateId || `poet-${randomUUID()}`; // TO REFACTOR

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
        await poet.applyCommand(createCommand);
        break;

      case "edit-poet":
        console.log("🚀 Editing poet");
        const editCommand = new EditPoetCommand(body.payload);
        await poet.applyCommand(editCommand);
        break;

      case "set-poet-as-mc":
        const setAsMCCommand = new SetPoetAsMCCommand(body.payload);
        await poet.applyCommand(setAsMCCommand);
        break;

      case "set-poet-as-poet":
        const setAsPoetCommand = new SetPoetAsPoetCommand(body.payload);
        await poet.applyCommand(setAsPoetCommand);
        break;

      case "delete-poet":
        const deleteCommand = new DeletePoetCommand(body.payload);
        await poet.applyCommand(deleteCommand);
        break;

      default:
        console.warn(`🚨 I don't know this command ${body.command}`);
        throw new Error(`I don't know this command ${body.command}`);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Invalid command",
          errors: error.errors,
        }),
      };
    }
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "unknown error", error }),
    };
  }

  let response: APIGatewayProxyResultV2 = {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode: 200,
    body: JSON.stringify({
      message: "Command processed successfully",
      poet,
      aggregateID: aggregateId,
    }),
  };

  return response;
};
