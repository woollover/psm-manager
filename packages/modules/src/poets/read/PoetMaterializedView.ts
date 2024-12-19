export class PoetMaterializedView {
  #type = "poet-materialized-view";
  #id: string; // (aggregate Root id)
  #name: string;
  #birthDate: string;
  #isMC: boolean;
  #isPoet: boolean;
  #instagramHandle: string;

  constructor(
    id: string,
    name: string,
    birthDate: string,
    isMC: boolean,
    isPoet: boolean,
    instagramHandle: string
  ) {
    this.#id = id;
    this.#name = name;
    this.#birthDate = birthDate;
    this.#isMC = isMC;
    this.#isPoet = isPoet;
    this.#instagramHandle = instagramHandle;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
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
}
