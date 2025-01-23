import { MaterializedViewsTable } from "infra/tables/materializedViewsTable.js";
import { deadLetterQueue } from "./deadLetterQueue.js";
import { EventStoreTable } from "infra/tables/eventStore.js";


export const poetsProjectionsQueue = new sst.aws.Queue("PoetsProjections", {
  dlq: {
    queue: deadLetterQueue.arn,
    retry: 3,
  },
});

poetsProjectionsQueue.subscribe({
  handler:
    "packages/modules/src/poets/functions/poetsProjectionsSubscriber.handler",
  environment: {
    MATERIALIZED_VIEW_TABLE_NAME: MaterializedViewsTable.name,
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
  },
  link: [MaterializedViewsTable, EventStoreTable],
  name: "poets-projections-subscriber",
});
