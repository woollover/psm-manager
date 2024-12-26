import { PoetCreatedEvent } from "src/poets/events/PoetCreated.event";
import { PoetMaterializedView } from "./Poet.materialized-view";
import { PoetEditedEvent } from "src/poets/events/PoetEdited.event";
import { PoetSetAsMCEvent } from "src/poets/events/PoetSetAsMC.event";
import { PoetSetAsPoetEvent } from "src/poets/events/PoetSetAsPoet.event";
import { PoetDeletedEvent } from "src/poets/events/PoetDeleted.event";
import { PoetReactivatedEvent } from "src/poets/events/PoetReactivated";
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

export class PoetsListMaterializedView {
  #viewKey = "poets-list-materialized-view";
  #poets: PoetsListPoet[] = [];
  #deletedPoets: PoetsListPoet[] = [];

  constructor({ poets }: { poets: PoetsListPoet[] }) {
    this.#poets = poets ?? [];
  }

  createPoet(event: PoetCreatedEvent) {
    const poet: PoetsListPoet = {
      id: event.getAggregateId,
      name: event.getPayload.name,
      birthDate: event.getPayload.birthDate,
      isMC: event.getPayload.isMC || false,
      isPoet: true,
      instagramHandle: event.getPayload.instagramHandle || "",
    };
    this.#poets.push(poet);
    console.log("🚀 ~ PoetsListMaterializedView ~ createPoet ~ poet:", poet);
  }

  updatePoet(event: PoetEditedEvent) {
    this.#poets = this.#poets.map((p) =>
      p.id === event.getAggregateId ? { ...p, ...event.getPayload } : p
    );
  }

  setPoetAsMC(event: PoetSetAsMCEvent) {
    this.#poets = this.#poets.map((p) =>
      p.id === event.getAggregateId ? { ...p, isMC: true } : p
    );
  }

  setPoetAsPoet(event: PoetSetAsPoetEvent) {
    this.#poets = this.#poets.map((p) =>
      p.id === event.getAggregateId ? { ...p, isPoet: true, isMC: false } : p
    );
  }

  deletePoet(event: PoetDeletedEvent) {
    const poet = this.#poets.find((p) => p.id === event.getAggregateId);
    if (poet) {
      this.#deletedPoets.push(poet);
      this.#poets = this.#poets.filter((p) => p.id !== event.getAggregateId);
    } else {
      throw new Error("Poet not found");
    }
  }

  reactivatePoet(event: PoetReactivatedEvent) {
    const poet = this.#deletedPoets.find((p) => p.id === event.getAggregateId);
    if (poet) {
      this.#poets.push(poet);
      this.#deletedPoets = this.#deletedPoets.filter(
        (p) => p.id !== event.getAggregateId
      );
    } else {
      throw new Error("Poet not found");
    }
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

  get deletedCount() {
    return this.#deletedPoets.length;
  }

  get materializedViewKey() {
    return this.#viewKey;
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
