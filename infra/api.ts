import { EventStoreTable } from "./tables/eventStore";

export const eventStoreApi = new sst.aws.ApiGatewayV2("Api");

eventStoreApi.route("GET /events", {
  link: [EventStoreTable],
  handler: "packages/functions/src/api.handler",
  name: "event-store-getter",
});

eventStoreApi.route("POST /commands", {
  link: [EventStoreTable],
  handler: "packages/functions/src/api.handler",
  name: "command-handler",
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
