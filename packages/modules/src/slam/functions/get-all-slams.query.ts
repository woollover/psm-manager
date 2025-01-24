import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Handler,
} from "aws-lambda";
import { documentClient, MaterializedViewRepository } from "@psm/core";
import { SlamsListMaterializedViewDBShape } from "../read/materialized-view/SlamList.materialized-view";
import { SlamListReadModel } from "../read/read-models/SlamList.read-model";

//rule of thumb: stateless instnces OUTSIDE the handler, Stateful instances inside the handler

// instantiate the eventStore, it's stateless so we can do it outside the handler

export const handler: Handler = async (_event: APIGatewayProxyEventV2) => {
  const aggregateId = _event.pathParameters?.aggregateId;


  // instnatiate the materialized view repo
  const poetsMaterializedViewRepository =
    new MaterializedViewRepository<SlamsListMaterializedViewDBShape>({
      client: documentClient,
      tablename: process.env.MATERIALIZED_VIEWS_TABLE_NAME || "",
      viewKey: "slam-list",
    });
  // load the materialized view

  const mvData = await poetsMaterializedViewRepository.load();
  if (mvData == null) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 404,
      body: JSON.stringify({ error: "materialized view not found" }),
    };
  }

  // insantiate the Read Model
  const poetsReadModel = new SlamListReadModel({
    materializedViewData: mvData,
  });
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
