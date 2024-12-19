import { PoetMaterializedView } from "./PoetMaterializedView";

export class PoetProjection {
  #poets: PoetMaterializedView[] = [];

  constructor(poets: PoetMaterializedView[]) {
    this.#poets = poets;
  }
}
