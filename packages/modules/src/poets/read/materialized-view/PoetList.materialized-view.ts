import { PoetMaterializedView } from "./Poet.materialized-view";
/**
 * this projection is an enriched version of the poets list, and it's used to display the poets list in the UI
 * It can be queried by the poets list materialized view
 * It's a read model, and it's not meant to be used for any other purpose
 * It's a single source of truth for the poets list
 * It must receive the poets list from a loaded repository
 * The repository implements the PoetsListMaterializedView
 */

export type PoetsListPoet = {
  id: string;
  name: string;
  birthDate: string;
  isMC: boolean;
  isPoet: boolean;
  instagramHandle: string;
};

export class PoetListMaterializedView {
  #viewKey = "poet-list-materialized-view";
  #poets: PoetsListPoet[] = [];

  constructor({ poets }: { poets: PoetsListPoet[] }) {
    this.#poets = poets ?? [];
  }

  get data() {
    return this.#poets;
  }

  get MCs() {
    return this.#poets.filter((poet) => poet.isMC);
  }

  get poets() {
    return this.#poets.filter((poet) => poet.isPoet);
  }

  get MCsCount() {
    return this.MCs.length;
  }

  get poetsCount() {
    return this.poets.length;
  }

  get totalCount() {
    return this.#poets.length;
  }

  searchPoetByName(searchKey: string) {
    return this.#poets.filter((poet) => poet.name.includes(searchKey));
  }

  searchPoetByInstagramHandle(searchKey: string) {
    return this.#poets.filter((poet) =>
      poet.instagramHandle.includes(searchKey)
    );
  }
}
