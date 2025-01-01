import { EventStoreTable } from "../tables/eventStore";
import { MaterializedViewsTable } from "../tables/materializedViewsTable";
import { deadLetterQueue } from "./deadLetterQueue";

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
  },
  link: [MaterializedViewsTable, EventStoreTable],
  name: "poets-projections-subscriber",
});
