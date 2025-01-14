import { EventStoreTable } from "../tables/eventStore";
import { MaterializedViewsTable } from "../tables/materializedViewsTable";
import { deadLetterQueue } from "./deadLetterQueue";

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
