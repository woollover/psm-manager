import { eventStoreTable } from "./tables/eventStore";

export const eventStoreApi = new sst.aws.ApiGatewayV2("Api");

eventStoreApi.route("GET /events", {
  link: [eventStoreTable],
  handler: "packages/functions/src/api.handler",
  name: "event-store-getter",
});

eventStoreApi.route("POST /commands", {
  link: [eventStoreTable],
  handler: "packages/functions/src/api.handler",
  name: "command-handler",
});

// api.route("GET /poets", {
//   link: [poetsTable],
//   handler: "packages/functions/src/api.handler",
//   name: "poets-getter",
// });
