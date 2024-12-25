export const deadLetterQueue = new sst.aws.Queue("PSM-DLQ");

deadLetterQueue.subscribe({
  handler:
    "packages/functions/src/queuesSubscribers/deadLetterQueueSub.handler",
  name: "dead-letter-queue-subscriber",
});
