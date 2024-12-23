import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Handler,
} from "aws-lambda";
import { EventStore } from "../../../../core/src/EventStore";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Poet } from "../aggregates/Poet";
import { PoetsReadModel } from "../read/read-models/PoetListReadModel";
import { PoetMaterializedViewRepository } from "../repository/PoetMaterializedViewRepository";

//rule of thumb: stateless instnces OUTSIDE the handler, Stateful instances inside the handler

const client = new DynamoDBClient({
  region: process.env.EVENT_STORE_TABLE_REGION,
});

const documentClient = DynamoDBDocument.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  },
});

const eventStore = new EventStore(
  process.env.EVENT_STORE_TABLE_NAME || "eu-central-1",
  documentClient
);
// instantiate the eventStore, it's stateless so we can do it outside the handler

export const handler: Handler = async (_event: APIGatewayProxyEventV2) => {
  const aggregateId = _event.pathParameters?.aggregateId;
  console.log("🚀 Poet ID:", aggregateId);

  // instnatiate the materialized view repo
  const poetsMaterializedViewRepository = new PoetMaterializedViewRepository({
    client: documentClient,
    tablename: process.env.MATERIALIZED_VIEWS_TABLE_NAME || "",
  });
  // load the materialized view

  await poetsMaterializedViewRepository.load();

  // insantiate the Read Model
  const poetsReadModel = new PoetsReadModel(
    poetsMaterializedViewRepository.materializedView || []
  ).serve();

  // serve the read model
  const response: APIGatewayProxyResultV2 = {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode: 200,
    body: JSON.stringify({ data: poetsReadModel }),
  };

  return response;
};
