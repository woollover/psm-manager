import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { MaterializedViewRepository } from "../../../../core/src/Repos/MaterializedViewRepo";
import { PoetMaterializedView } from "../read/materialized-view/Poet.materialized-view";

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

  async getById(id: string): Promise<PoetMaterializedView> {
    let poets = this.materializedView;
    if (!poets || poets.length === 0) {
      poets = await this.load();
    }
    let poet = poets.find((poet) => poet.id === id);
    if (!poet) {
      throw new Error("Poet not found");
    }
    return poet;
  }

  async getIndex(id: string): Promise<number> {
    let poets = this.materializedView;
    if (!poets || poets.length === 0) {
      poets = await this.load();
    }
    let index = poets.findIndex((poet) => poet.id === id);
    if (index == -1) {
      throw new Error("Poet not found");
    }
    return index;
  }

  async updatePoet(poet: PoetMaterializedView) {
    let poets = this.materializedView;
    if (!poets || poets.length === 0) {
      poets = await this.load();
    }
    let index = poets.findIndex((poet) => poet.id === poet.id);
    if (index == -1) {
      throw new Error("Poet not found");
    }
    poets[index] = poet;
    await this.save();
  }
}
