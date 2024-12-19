import { PoetMaterializedView } from "./PoetMaterializedView";

export class PoetsReadModel {
  #poets: PoetMaterializedView[] = [];

  constructor(poets: PoetMaterializedView[]) {
    this.#poets = poets;
  }

  serve() {
    return this.#poets.map((poet) => poet.string);
  }
}
