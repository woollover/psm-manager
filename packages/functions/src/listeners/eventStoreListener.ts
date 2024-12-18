import { Handler } from "aws-lambda";
export const handler: Handler = async (_event) => {
  console.log("📥 Event received:", _event);

  return {
    statusCode: 200,
  };
};
