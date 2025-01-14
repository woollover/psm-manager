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
    await import("./infra/tables/eventStore.js");
    await import("./infra/tables/materializedViewsTable.js");
    await import("./infra/queues/poetsProjectionsQueue.js");
    await import("./infra/queues/deadLetterQueue.js");

    const api = await import("./infra/api.js");

    return {
      api: api.api.url,
    };
  },
});
