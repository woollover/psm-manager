import { PoetsListMaterializedView } from "../materialized-view/PoetList.materialized-view";
import {
  PoetsListMaterializedViewDBShape,
  PoetsListPoet,
} from "../materialized-view/types";

export interface PoetsListReadModel {
  poets: PoetsListPoet[];
  poetsCount: number;
  mcs: PoetsListPoet[];
  mcsCount: number;
  totalCount: number;
}

export class PoetListReadModel {
  #materializedView: PoetsListMaterializedView;
  constructor({
    materializedViewData,
  }: {
    materializedViewData: PoetsListMaterializedViewDBShape;
  }) {
    this.#materializedView = new PoetsListMaterializedView(
      materializedViewData
    );
  }

  get data(): PoetsListReadModel {
    const readModel: PoetsListReadModel = {
      poets: this.#materializedView.poets,
      poetsCount: this.#materializedView.poetsCount,
      mcs: this.#materializedView.MCs,
      mcsCount: this.#materializedView.MCsCount,
      totalCount: this.#materializedView.totalCount,
    };

    return readModel;
  }
}
