import { MaterializedViewsTable } from "infra/tables/materializedViewsTable.js";
import { deadLetterQueue } from "./deadLetterQueue.js";
import { EventStoreTable } from "infra/tables/eventStore.js";

export const slamProjectionsQueue = new sst.aws.Queue("SlamProjectons", {
  dlq: {
    queue: deadLetterQueue.arn,
    retry: 3,
  },
});

slamProjectionsQueue.subscribe({
  handler: "packages/modules/src/slam/functions/slamProjectionsSub.handler",
  environment: {
    MATERIALIZED_VIEW_TABLE_NAME: MaterializedViewsTable.name,
    EVENT_STORE_TABLE_NAME: EventStoreTable.name,
  },
  link: [MaterializedViewsTable, EventStoreTable],
  name: "slam-projections-subscriber",
});
