import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { AllEventsNames, EventRegistry } from "@psm/core";
import { Handler } from "aws-lambda";

const poetsProjectionsQueueUrl = process.env.POETS_PROJECTIONS_QUEUE_URL;
const slamProjectionsQueueUrl = process.env.SLAM_PROJECTIONS_QUEUE_URL;
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
    // DynamoDB attributes are strongly typed
    const eventType: AllEventsNames = savedEvent.eventType.S;
    const aggregateId = savedEvent.aggregateId.S as string;

    // get the aggregate id
    console.log("📥 Event type:", eventType);

    switch (eventType as AllEventsNames) {
      case "PoetCreated":
      case "PoetDeleted":
      case "poet.edited":
      //@ts-expect-error this should not be an error
      case "fsdfs":
      case "PoetSetAsMC":
      case "PoetSetAsPoet":
      case "PoetReactivated":
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
        break;
      case "PoetAccepted":
      case "PoetCandidated":
      case "PoetRejected":
      case "CallClosed":
      case "CallOpened":
      case "MCAssigned":
      case "MCUnassigned":
      case "SlamCreated":
      case "SlamDeleted":
      case "SlamEdited":
      case "SlamEnded":
      case "SlamStarted":
        // forward the event to the poet queue / service or something
        const slamMessageCommand = new SendMessageCommand({
          QueueUrl: slamProjectionsQueueUrl,
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
        console.log(
          "📥 Sending message to poets projections queue",
          slamMessageCommand
        );
        await sqs.send(slamMessageCommand);
        break;
      case "SlamPoetAdded":
      case "SlamPoetRemoved":
      case "SlamPoetReplaced":
      case "SlamPoetWithdrawn":
      case "SlamPoetReactivated":
      case "SlamPoetDisqualified":
        break;
      default:
        // type of EventNames should be a disc union of all event names to make unreachable work

        unreacheable(eventType);
    }
  }

  return;
};

const unreacheable: (x: never) => never = () => {
  throw new Error("This should never be reached");
};
