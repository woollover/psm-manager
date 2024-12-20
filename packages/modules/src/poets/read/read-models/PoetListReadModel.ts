import {
  PoetMaterializedView,
  PoetsListMaterializedView,
} from "../materialized-view/Poet.materialized-view";
export type PoetReadModel = {
  poets: PoetMaterializedView[];
  mcs: PoetMaterializedView[];
  poetsCount: number;
  mcsCount: number;
  totalCount: number;
};

export class PoetsReadModel {
  #poetsListMaterializedView: PoetsListMaterializedView;

  constructor(poets: PoetMaterializedView[]) {
    this.#poetsListMaterializedView = new PoetsListMaterializedView(poets);
  }

  serve() {
    const readModel: PoetReadModel = {
      poets: this.#poetsListMaterializedView.poets,
      mcs: this.#poetsListMaterializedView.mcs,
      poetsCount: this.#poetsListMaterializedView.poetsCount,
      mcsCount: this.#poetsListMaterializedView.mcsCount,
      totalCount: this.#poetsListMaterializedView.count,
    };
    return readModel;
  }
}
