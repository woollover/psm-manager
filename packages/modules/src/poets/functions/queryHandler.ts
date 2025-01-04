import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Handler,
} from "aws-lambda";
import { EventStore } from "../../../../core/src/EventStore";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PoetsListMaterializedView } from "../read/materialized-view/PoetList.materialized-view";
import { MaterializedViewRepository } from "../../../../core/src/Repos/MaterializedViewRepo";
import { PoetListReadModel } from "../read/read-models/PoetsList.read-model";
import { PoetsListMaterializedViewDBShape } from "../read/materialized-view/types";

//rule of thumb: stateless instnces OUTSIDE the handler, Stateful instances inside the handler

const client = new DynamoDBClient({
  region: process.env.EVENT_STORE_TABLE_REGION,
});

const documentClient = DynamoDBDocument.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
    convertWithoutMapWrapper: true,
  },
});

// instantiate the eventStore, it's stateless so we can do it outside the handler

export const handler: Handler = async (_event: APIGatewayProxyEventV2) => {
  const aggregateId = _event.pathParameters?.aggregateId;
  console.log("🚀 Poet ID:", aggregateId);

  // instnatiate the materialized view repo
  const poetsMaterializedViewRepository =
    new MaterializedViewRepository<PoetsListMaterializedViewDBShape>({
      client: documentClient,
      tablename: process.env.MATERIALIZED_VIEWS_TABLE_NAME || "",
      viewKey: "poets-list-materialized-view",
    });
  // load the materialized view

  const mv = await poetsMaterializedViewRepository.load();
  if (mv == null) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 404,
      body: JSON.stringify({ error: "materialized view not found" }),
    };
  }

  // insantiate the Read Model
  const poetsReadModel = new PoetListReadModel({ materializedViewData: mv });
  const data = poetsReadModel.data;
  // serve the read model
  const response: APIGatewayProxyResultV2 = {
    headers: {
      "Content-Type": "application/json",
    },
    statusCode: 200,
    body: JSON.stringify({ data }),
  };

  return response;
};
