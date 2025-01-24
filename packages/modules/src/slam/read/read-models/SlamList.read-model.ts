import { CountryId } from "@psm/common";
import {
  SlamsListMaterializedView,
  SlamsListMaterializedViewDBShape,
} from "../materialized-view/SlamList.materialized-view";

export interface SlamData {
  venue: string;
  name: string;
  dateTime: string;
  isEnded: boolean;
  callOpen: boolean;
}

export interface SlamListReadModelShape {
  slams: Array<SlamData>;
  count: number;
  countries: Array<CountryId>;
}

export class SlamListReadModel {
  #materializedView: SlamsListMaterializedView;
  constructor({
    materializedViewData,
  }: {
    materializedViewData: SlamsListMaterializedViewDBShape;
  }) {
    this.#materializedView = new SlamsListMaterializedView(
      materializedViewData
    );
    console.log(this.#materializedView["viewToSave"]);
  }

  get data(): SlamListReadModelShape {
    const readModel: SlamListReadModelShape = {
      count: this.#materializedView.count,
      countries: this.#materializedView.countries,
      slams: this.#materializedView.slamArray.map((a) => {
        return {
          id: a.id,
          venue: a.venue,
          name: a.name,
          dateTime: a.date,
          isEnded: a.ended,
          callOpen: a.callOpen,
        };
      }),
    };

    console.log("READMODEL ", readModel);

    return readModel;
  }
}
