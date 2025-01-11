import { APIGatewayProxyResultV2, Handler } from "aws-lambda";
import { EventStore } from "@psm/core/EventStore";
import { randomUUID } from "crypto";
import { InvalidCommandError } from "@psm/core/Errors/InvalidCommand.error";
import { documentClient } from "@psm/core/DynamoDBInstance/DynamoDBInstance";
import { Slam } from "../aggregates/Slam";
import { SlamCommandFactory } from "../commands/SlamCommand.factory";

//rule of thumb: stateless instnces OUTSIDE the handler, Stateful instances inside the handler

const eventStore = new EventStore(
  process.env.EVENT_STORE_TABLE_NAME || "",
  documentClient
);
// instantiate the eventStore, it's stateless so we can do it outside the handler

export const handler: Handler = async (_event) => {
  const body = JSON.parse(_event.body!);
  console.log("📥 Body received:", body);

  const aggregateId = body.payload.aggregateId || `slam-${randomUUID()}`; // TO REFACTOR

  // pull up the aggregate

  console.log("📥 Aggregate ID:", aggregateId);
  // load from history from event store and rehydrate the aggregate
  const aggregateEvents = await eventStore.getEvents(aggregateId);

  console.log("📥 Aggregate events:", aggregateEvents);
  // create the aggregate class
  const slam = new Slam(aggregateId);

  try {
    slam.loadFromHistory(aggregateEvents);

    console.log("🔍 Hydrated Poet:", slam);
    // refactor this with a factory and naming the command in the body  with the same name as the command

    const commandClass = SlamCommandFactory.createCommand(
      body.command,
      body.payload
    );

    slam.applyCommand(commandClass);

    // persist uncommitted events
    await eventStore.saveEvents(slam.uncommittedEvents);
    // clear uncommitted events in the aggregate
    slam.clearUncommittedEvents();

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
      slam: slam,
      aggregateID: aggregateId,
    }),
  };

  return response;
};
