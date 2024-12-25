/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "psm",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      region: "eu-central-1",
    };
  },
  async run() {
    await import("./infra/tables/eventStore");
    await import("./infra/tables/materializedViewsTable");
    await import("./infra/queues/poetsProjectionsQueue");
    await import("./infra/queues/deadLetterQueue");

    const api = await import("./infra/api");

    return {
      api: api.eventStoreApi.url,
    };
  },
});
