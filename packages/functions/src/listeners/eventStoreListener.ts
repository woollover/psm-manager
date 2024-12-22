import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { Handler } from "aws-lambda";

const poetsProjectionsQueueUrl = process.env.POETS_PROJECTIONS_QUEUE_URL;
const sqs = new SQSClient({
  region: "eu-central-1",
});

export const handler: Handler = async (_event) => {
  // make this responding to an event :D

  // instantiate the materializedViewRepo

  for (const event of _event.Records) {
    console.log("📥 Event type:", event.dynamodb);
    console.log("📥 Event type:", event.eventSource);
    console.log("📥 Event type:", event);
    const savedEvent = event.dynamodb.NewImage;
    // get the event type
    const eventType = savedEvent.eventType as string;
    if (eventType.includes("Poet")) {
      // get the aggregate id
      const aggregateId = savedEvent.aggregateId as string;
      // forward the event to the poet queue / service or something
      const command = new SendMessageCommand({
        QueueUrl: poetsProjectionsQueueUrl,
        MessageBody: JSON.stringify(savedEvent),
        MessageAttributes: {
          aggregateId: {
            DataType: "string",
            StringValue: aggregateId,
          },
          eventType: {
            DataType: "string",
            StringValue: eventType,
          },
        },
      });
      console.log("📥 Sending message to poets projections queue", command);
      await sqs.send(command);
    }
  }

  return;
};
