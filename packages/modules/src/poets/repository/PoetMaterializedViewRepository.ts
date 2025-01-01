import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { MaterializedViewRepository } from "../../../../core/src/Repos/MaterializedViewRepo";

export interface PoetsListPoet {
  id: string;
  name: string;
  birthDate: string;
  isMC: boolean;
  isPoet: boolean;
  instagramHandle: string;
}

export interface PoetsListMaterializedViewDBShape {
  poets: PoetsListPoet[];
}

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
