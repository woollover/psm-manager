export const deadLetterQueue = new sst.aws.Queue("PSM-DLQ");

deadLetterQueue.subscribe("dead-letter-subscriber", {});
