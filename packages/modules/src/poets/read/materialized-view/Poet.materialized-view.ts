

export class PoetMaterializedView {
  #viewKey = "poet-materialized-view";
  #id: string; // (aggregate Root id)
  #name: string;
  #birthDate: string;
  #isMC: boolean;
  #isPoet: boolean;
  #instagramHandle: string;

  constructor({
    id,
    name,
    birthDate,
    isMC,
    isPoet,
    instagramHandle,
  }: {
    id: string; // it is poet-materialized-view#${aggregateId} In this case the materialized view is the aggregate root, but it's not mandatory
    name: string;
    birthDate: string;
    isMC: boolean;
    isPoet: boolean;
    instagramHandle: string;
  }) {
    this.#id = this.getMaterializedViewId(id);
    this.#name = name;
    this.#birthDate = birthDate;
    this.#isMC = isMC;
    this.#isPoet = isPoet;
    this.#instagramHandle = instagramHandle;
  }

  getMaterializedViewId(id: string) {
    return this.#viewKey + "#" + id;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get isMC() {
    return this.#isMC;
  }

  get isPoet() {
    return this.#isPoet;
  }

  get instagramHandle() {
    return this.#instagramHandle;
  }

  get string() {
    return `${this.#name} is a ${this.#isMC ? "MC" : "Poet"} and ${
      this.#isMC ? "MC" : "Poet"
    }, instagram handle: @${this.#instagramHandle}`;
  }
}

export class PoetsListMaterializedView {
  #poets: PoetMaterializedView[] = [];

  constructor(poets: PoetMaterializedView[]) {
    this.#poets = poets;
  }

  get count() {
    return this.#poets.length;
  }

  get mcs() {
    return this.#poets.filter((poet) => poet.isMC);
  }

  get mcsCount() {
    return this.mcs.length;
  }

  get poets() {
    return this.#poets.filter((poet) => poet.isPoet);
  }

  get poetsCount() {
    return this.poets.length;
  }
}
