import sstConfig from "../sst.config";
import { EventStoreTable } from "./tables/eventStore";

export const eventStoreApi = new sst.aws.ApiGatewayV2("Api");

eventStoreApi.route("GET /events", {
  link: [EventStoreTable],
  handler: "packages/modules/src/poets/functions/getAllPoetEvents.handler",
  name: "event-store-getter",
  environment: {
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
  },
});

eventStoreApi.route("GET /poets", {
  link: [EventStoreTable],
  handler: "packages/modules/src/poets/functions/queryHandler.handler",
  name: "get-all-poets",
  environment: {
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
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

EventStoreTable.subscribe(
  "event-store-listener",
  "packages/functions/src/listeners/eventStoreListener.handler"
);
// api.route("GET /poets", {
//   link: [poetsTable],
//   handler: "packages/functions/src/api.handler",
//   name: "poets-getter",
// });
