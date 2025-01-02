import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { MaterializedViewRepository } from "../../../../core/src/Repos/MaterializedViewRepo";
import { PoetsListMaterializedViewDBShape } from "../read/materialized-view/types";

export class PoetsListMaterializedViewRepo extends MaterializedViewRepository<PoetsListMaterializedViewDBShape> {
  constructor({
    tablename,
    client,
  }: {
    tablename: string;
    client: DynamoDBDocument;
  }) {
    super({
      tablename,
      client,
      viewKey: "poets-materialized-view",
      defaultValue: { poets: [] },
    });
  }

  async save() {}
}
