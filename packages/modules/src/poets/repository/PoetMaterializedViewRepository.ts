import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { MaterializedViewRepository } from "../../../../core/src/Repos/MaterializedViewRepo";
import { PoetMaterializedView } from "../read/PoetMaterializedView";
import { PoetProjection } from "../read/PoetProjection";

export class PoetMaterializedViewRepository extends MaterializedViewRepository<
  PoetMaterializedView[]
> {
  constructor({
    tablename,
    client,
  }: {
    tablename: string;
    client: DynamoDBDocument;
  }) {
    super({ tablename, client, viewKey: "poets-materialized-view" });
  }

  async handleProjection() {
    this.load();
  }
}
