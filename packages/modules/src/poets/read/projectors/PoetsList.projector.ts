import { PSMEvent } from "../../../../../core/src/Event/Event";
import { EventStore } from "../../../../../core/src/EventStore/EventStore";
import { PoetsListMaterializedView } from "../materialized-view/Poet.materialized-view";

export class PoetsListProjector {
  #events: PSMEvent[] = [];
  #eventStore: EventStore;
  #materializedView: PoetsListMaterializedView | null = null;

  constructor({ eventStore }: { eventStore: EventStore }) {
    this.#eventStore = eventStore;
  }

  async project(event: PSMEvent) {}

  async recreateProjection({ originEventType }: { originEventType: string }) {
    const events = await this.#eventStore.getEventsByType(originEventType);
    const baseEvents = events.filter((e) => e.getEventType === originEventType);
    console.log("🚀 ~ baseEvents", baseEvents);
    if (!baseEvents) {
      throw new Error("Base event not found");
    }
    // get All AggregateIds
    const aggregateIds = baseEvents.map((e) => e.getAggregateId);

    for (const aggregateId of aggregateIds) {
      const events = await this.#eventStore.getEvents(aggregateId);
      this.#events = [...this.#events, ...events];
    }
    // now that we have all the events we sort them  from the oldest to the newest
    this.#events.sort((a, b) => a.getTimestamp - b.getTimestamp);

    // for each event we apply the projection
  }
}
