import { Projector, PSMEvent } from "@psm/core";
import { EventStore } from "@psm/core";
import { PoetsListMaterializedView } from "../materialized-view/PoetList.materialized-view";
import {
  PoetDeletedEvent,
  PoetEvent,
  PoetCreatedEvent,
  PoetEditedEvent,
  PoetReactivatedEvent,
  PoetSetAsMCEvent,
  PoetSetAsPoetEvent,
} from "src/poets/events";
import { PoetsListMaterializedViewDBShape } from "../materialized-view/types";

export class PoetsListProjector extends Projector<
  PoetEvent,
  PoetsListMaterializedView
> {
  #events: PSMEvent<any, string>[] = [];
  constructor({
    eventStore,
    materializedViewData,
  }: {
    eventStore: EventStore;
    materializedViewData: PoetsListMaterializedViewDBShape | null;
  }) {
    super(eventStore, new PoetsListMaterializedView(materializedViewData));
  }

  async project(event: PoetEvent) {
    switch (event.getEventType) {
      case "PoetCreated":
        this.materializedView.createPoet(event as PoetCreatedEvent);
        break;
      case "PoetEdited":
        this.materializedView.updatePoet(event as PoetEditedEvent);
        break;
      case "PoetSetAsMC":
        this.materializedView.setPoetAsMC(event as PoetSetAsMCEvent);
        break;
      case "PoetSetAsPoet":
        this.materializedView.setPoetAsPoet(event as PoetSetAsPoetEvent);
        break;
      case "PoetDeleted":
        this.materializedView.deletePoet(event as PoetDeletedEvent);
        break;
      case "PoetReactivated":
        this.materializedView.reactivatePoet(event as PoetReactivatedEvent);
        break;
      default:
        throw new Error("Event type not supported");
    }
  }

  async recreateProjection<T extends PoetEvent["eventType"]>({
    originEventType,
  }: {
    originEventType: T;
  }) {
    this.materializedView = new PoetsListMaterializedView({ poets: [] });
    const events = await this.eventStore.getEventsByType(originEventType);
    const baseEvents = events.filter((e) => e.getEventType === originEventType);
    this.#events = [];
    if (!baseEvents) {
      throw new Error("Base events not found");
    }
    // get All AggregateIds
    const aggregateIds = baseEvents.map((e) => e.getAggregateId);
    console.log("🚀 ~ aggregateIds", aggregateIds);

    for (const aggregateId of aggregateIds) {
      const events = await this.eventStore.getEvents(aggregateId);
      console.log("aggregateId", aggregateId);
      console.log("events", events);

      this.#events.push(...events);
    }

    // now that we have all the events we sort them  from the oldest to the newest
    this.#events.sort((a, b) => a.getTimestamp - b.getTimestamp);
    console.log("🚀 ~ events", this.#events);

    // for each event we apply the projection
    for (const event of this.#events) {
      this.project(event as PoetEvent);
    }
  }
}
