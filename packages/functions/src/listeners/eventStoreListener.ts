import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { Handler } from "aws-lambda";

const poetsProjectionsQueueUrl = process.env.POETS_PROJECTIONS_QUEUE_URL;
const sqs = new SQSClient({
  region: "eu-central-1",
});

export const handler: Handler = async (_event) => {
  console.log("📥 Event", _event);
  // make this responding to an event :D

  // instantiate the materializedViewRepo

  for (const event of _event.Records) {
    // temporary guard case to not going in the queue
    if (event.eventName == "REMOVE") {
      continue;
    }

    console.log("📥 Event body:", event.dynamodb);
    //console.log("📥 Event type:", event.eventSource);
    //console.log("📥 Event type:", event);
    const savedEvent = event.dynamodb.NewImage;
    // get the event type
    const eventType = savedEvent.eventType.S as string;
    console.log("📥 Event type:", eventType);
    if (eventType.includes("Poet")) {
      // get the aggregate id
      const aggregateId = savedEvent.aggregateId.S as string;
      console.log("📥 Aggregate id:", aggregateId);
      // forward the event to the poet queue / service or something
      const command = new SendMessageCommand({
        QueueUrl: poetsProjectionsQueueUrl,
        MessageBody: JSON.stringify(savedEvent),
        // add 2 message Attributes with event type and aggregate id
        MessageAttributes: {
          eventType: {
            DataType: "String",
            StringValue: eventType as string,
          },
          aggregateId: {
            DataType: "String",
            StringValue: aggregateId as string,
          },
        },
      });
      console.log("📥 Sending message to poets projections queue", command);
      await sqs.send(command);
    }
  }

  return;
};
