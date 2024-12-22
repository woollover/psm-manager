import { Handler } from "aws-lambda";
export const handler: Handler = async (_event) => {
  console.log("📥 Event received on DLQ:", _event);
  // make this responding to an event :D

  // instantiate the materializedViewRepo

  for (const event of _event.Records) {
    console.log("📥 Message", event);
  }

  return;
};
