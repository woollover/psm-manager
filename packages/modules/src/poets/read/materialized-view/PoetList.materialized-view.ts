import { PoetCreatedEvent } from "src/poets/events/PoetCreated.event";
import { PoetEditedEvent } from "src/poets/events/PoetEdited.event";
import { PoetSetAsMCEvent } from "src/poets/events/PoetSetAsMC.event";
import { PoetSetAsPoetEvent } from "src/poets/events/PoetSetAsPoet.event";
import { PoetDeletedEvent } from "src/poets/events/PoetDeleted.event";
import { PoetReactivatedEvent } from "src/poets/events/PoetReactivated.event";
import { PoetsListMaterializedViewDBShape, PoetsListPoet } from "./types";

/**
 * this materialized view is a enriched version of the list of poets
 * It can be queried by the poets list materialized view
 * It's a read model, and it's not meant to be used for any other purpose than querying
 * It's a single source of truth for the poets list
 * It must receive the poets list from a loaded repository
 * The repository implements the PoetsListMaterializedView
 */

export class PoetsListMaterializedView {
  #viewKey = "poets-list";
  #data: PoetsListPoet[] = [];
  #deletedPoets: PoetsListPoet[] = [];

  constructor(materializedView: PoetsListMaterializedViewDBShape | null) {
    this.#data = materializedView ? materializedView.poets : [];
  }

  // TODO - Check if there coul be a better name
  createPoet(event: PoetCreatedEvent) {
    const poet: PoetsListPoet = {
      id: event.getAggregateId,
      firstName: event.getPayload.firstName,
      lastName: event.getPayload.lastName,
      isMC: false,
      isPoet: true,
      instagramHandle: event.getPayload.instagramHandle,
      birthDate: event.getPayload.birthDate,
    };
    this.#data.push(poet);
    console.log("🚀 ~ PoetsListMaterializedView ~ createPoet ~ poet:", poet);
  }

  updatePoet(event: PoetEditedEvent) {
    this.#data = this.#data.map((p) =>
      p.id === event.getAggregateId
        ? {
            ...p,
            ...Object.fromEntries(
              Object.entries(event.getPayload).filter(
                ([_, value]) => value !== undefined
              )
            ),
          }
        : p
    );
  }

  setPoetAsMC(event: PoetSetAsMCEvent) {
    this.#data = this.#data.map((p) =>
      p.id == event.getAggregateId ? { ...p, isMC: true } : p
    );
  }

  setPoetAsPoet(event: PoetSetAsPoetEvent) {
    this.#data = this.#data.map((p) =>
      p.id == event.getAggregateId ? { ...p, isPoet: true, isMC: false } : p
    );
  }

  deletePoet(event: PoetDeletedEvent) {
    const poet = this.#data.find((p) => p.id == event.getAggregateId);
    if (poet) {
      this.#deletedPoets.push(poet);
      this.#data = this.#data.filter((p) => p.id !== event.getAggregateId);
    } else {
      throw new Error("Poet not found");
    }
  }

  reactivatePoet(event: PoetReactivatedEvent) {
    const poet = this.#deletedPoets.find((p) => p.id == event.getAggregateId);
    if (poet) {
      this.#data.push(poet);
      this.#deletedPoets = this.#deletedPoets.filter(
        (p) => p.id != event.getAggregateId
      );
    } else {
      throw new Error("Poet not found");
    }
  }

  get viewToSave(): PoetsListMaterializedViewDBShape {
    return { poets: this.#data };
  }

  get MCs() {
    return this.#data.filter((poet) => poet.isMC);
  }

  get poets() {
    return this.#data.filter((poet) => poet.isPoet);
  }

  get MCsCount() {
    return this.MCs.length;
  }

  get poetsCount() {
    return this.poets.length;
  }

  get totalCount() {
    return this.#data.length + this.MCs.length;
  }

  get deletedCount() {
    return this.#deletedPoets.length;
  }

  get materializedViewKey() {
    return this.#viewKey;
  }

  searchPoetByName(searchKey: string) {
    return this.#data.filter((poet) => {
      const searchField = poet.lastName + poet.firstName + poet.instagramHandle;
      return searchField.includes(searchKey);
    });
  }

  searchPoetByInstagramHandle(searchKey: string) {
    return this.#data.filter((poet) =>
      poet.instagramHandle.includes(searchKey)
    );
  }
}
