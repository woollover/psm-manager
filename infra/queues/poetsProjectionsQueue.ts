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
});
