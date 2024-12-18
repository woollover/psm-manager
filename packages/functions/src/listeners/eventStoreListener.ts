import { Handler } from "aws-lambda";
export const handler: Handler = async (_event) => {
  for (const event of _event.Records) {
    console.log("📥 Event type:", event.dynamodb);
    console.log("📥 Event type:", event.eventSource);
  }

  return;
};
