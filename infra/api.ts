import { poetsProjectionsQueue } from "./queues/poetsProjectionsQueue";
import { EventStoreTable } from "./tables/eventStore";
import { MaterializedViewsTable } from "./tables/materializedViewsTable";

export const api = new sst.aws.ApiGatewayV2("Api");

api.route("GET /events", {
  link: [EventStoreTable, MaterializedViewsTable],
  handler: "packages/modules/src/poets/functions/getAllPoetEvents.handler",
  name: "event-store-getter",
  environment: {
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
    MATERIALIZED_VIEWS_TABLE_NAME: MaterializedViewsTable.name,
  },
});

api.route("GET /snitch", {
  link: [EventStoreTable, MaterializedViewsTable],
  handler: "packages/modules/src/audit/eventSnitch.handler.handler",
  name: "event-store-snitcher",
  environment: {
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
    MATERIALIZED_VIEWS_TABLE_NAME: MaterializedViewsTable.name,
  },
});

api.route("GET /poets/list", {
  link: [MaterializedViewsTable],
  handler: "packages/modules/src/poets/functions/queryHandler.handler",
  name: "get-poets-list",
  environment: {
    MATERIALIZED_VIEWS_TABLE_NAME: MaterializedViewsTable.name,
  },
});

api.route("POST /poets/commands", {
  link: [EventStoreTable],
  handler: "packages/modules/src/poets/functions/commandHandler.handler",
  name: "poets-command-handler",
  environment: {
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
  },
});

api.route("POST /slams/commands", {
  link: [EventStoreTable],
  handler: "packages/modules/src/slam/functions/commandHandler.handler",
  name: "slams-command-handler",
  environment: {
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
  },
});

api.route("GET /slams/list", {
  link: [MaterializedViewsTable],
  handler: "packages/modules/src/slam/functions/queryHandler.handler",
  name: "get-slam-list",
  environment: {
    MATERIALIZED_VIEWS_TABLE_NAME: MaterializedViewsTable.name,
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