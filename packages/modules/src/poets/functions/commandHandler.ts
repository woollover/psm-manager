import { APIGatewayProxyResultV2, Handler } from "aws-lambda";
import { EventStore } from "@psm/core";
import { randomUUID } from "crypto";
import { Poet } from "../aggregates/Poet";
import { PoetCommandFactory } from "../commands/PoetCommand.factory";
import { InvalidCommandError } from "@psm/core";
import { documentClient } from "@psm/core";

//rule of thumb: stateless instnces OUTSIDE the handler, Stateful instances inside the handler

const eventStore = new EventStore(
  process.env.EVENT_STORE_TABLE_NAME || "",
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
    // refactor this with a factory and naming the command in the body  with the same name as the command

    const commandClass = PoetCommandFactory.createCommand(
      body.command,
      body.payload
    );

    await poet.applyCommand(commandClass);

    // persist uncommitted events
    await eventStore.saveEvents(poet.uncommittedEvents);
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
