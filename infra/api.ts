import { poetsProjectionsQueue } from "./queues/poetsProjectionsQueue";
import { EventStoreTable } from "./tables/eventStore";
import { MaterializedViewsTable } from "./tables/materializedViewsTable";

export const eventStoreApi = new sst.aws.ApiGatewayV2("Api");

eventStoreApi.route("GET /events", {
  link: [EventStoreTable, MaterializedViewsTable],
  handler: "packages/modules/src/poets/functions/getAllPoetEvents.handler",
  name: "event-store-getter",
  environment: {
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
    MATERIALIZED_VIEWS_TABLE_NAME: MaterializedViewsTable.name,
  },
});

eventStoreApi.route("GET /poets", {
  link: [EventStoreTable, MaterializedViewsTable],
  handler: "packages/modules/src/poets/functions/queryHandler.handler",
  name: "get-all-poets",
  environment: {
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
    MATERIALIZED_VIEWS_TABLE_NAME: MaterializedViewsTable.name,
  },
});

eventStoreApi.route("POST /poets/commands", {
  link: [EventStoreTable],
  handler: "packages/modules/src/poets/functions/commandHandler.handler",
  name: "command-handler",
  environment: {
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
  },
});

EventStoreTable.subscribe("event-store-listener", {
  handler: "packages/functions/src/listeners/eventStoreListener.handler",
  link: [EventStoreTable, poetsProjectionsQueue],
  environment: {
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
    POETS_PROJECTIONS_QUEUE_URL: poetsProjectionsQueue.url,
  },
  name: "event-store-listener",
});
// api.route("GET /poets", {
//   link: [poetsTable],
//   handler: "packages/functions/src/api.handler",
//   name: "poets-getter",
// });
