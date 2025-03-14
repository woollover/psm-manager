import { documentClient, EventStore } from "@psm/core";
import { Handler } from "aws-lambda";

const eventStore = new EventStore(
  process.env.EVENT_STORE_TABLE_NAME || "",
  documentClient
);

export type SearchParams =
  | {
      strategy: "aggregateId";
      aggregateId: string;
    }
  | {
      strategy: "eventType";
      eventType: string;
    }
  | {
      strategy: "fromTimestamp";
      timestamp: number;
    }
  | {
      strategy: "globalOffset";
      start: number;
      end: number | undefined;
    };

export type SnitchStrategy = SearchParams["strategy"] | null;

export const StrategiesArray: SnitchStrategy[] = [
  "aggregateId",
  "eventType",
  "fromTimestamp",
  "globalOffset",
] as const;

export const handler: Handler = async (_event) => {
  const strategy: SnitchStrategy = _event.queryStringParameters?.strategy;

  if (strategy && !StrategiesArray.includes(strategy)) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Invalid strategy",
      }),
    };
  }

  if (!_event.queryStringParameters) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "No params provided",
      }),
    };
  }

  console.log(_event.queryStringParameters);

  var events = [];

  switch (strategy) {
    case "aggregateId":
      const aggregateId = _event.queryStringParameters.aggregateId;
      events = await eventStore.getEvents(aggregateId!);
      break;
    case "eventType":
      const eventType = _event.queryStringParameters.eventType;
      events = await eventStore.getEventsByType(eventType!);
      break;
    case "fromTimestamp":
      events = await eventStore.getEventsBetweenTimestamps({
        aggregateId: _event.queryStringParameters.aggregateId,
        start: _event.queryStringParameters.start!,
        end: _event.queryStringParameters.end,
      });
      break;
    case "globalOffset":
      const start = Number(_event.queryStringParameters.start);
      const end = Number(_event.queryStringParameters.end);
      events = await eventStore.getEventsByGlobalOffset(start!, end);
      break;
    default:
      events = await eventStore.getEventsByType("PoetCreated");
      break;
  }
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ events }),
  };
};
