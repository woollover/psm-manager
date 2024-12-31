import { PSMEvent } from "../../../../../core/src/Event/Event";
import { EventStore } from "../../../../../core/src/EventStore/EventStore";
import {
  PoetsListMaterializedView,
  PoetsListPoet,
} from "../materialized-view/PoetList.materialized-view";

export type PoetsListReadModel = {
  poets: PoetsListPoet[];
  poetsCount: number;
  mcs: PoetsListPoet[];
  mcsCount: number;
  totalCount: number;
};

export class PoetsListProjector {
  #events: PSMEvent[] = [];
  #eventStore: EventStore;
  #materializedView: PoetsListMaterializedView = new PoetsListMaterializedView({
    poets: [],
  });
  #readModel: PoetsListReadModel = {
    poets: [],
    poetsCount: 0,
    mcs: [],
    mcsCount: 0,
    totalCount: 0,
  };

  constructor({ eventStore }: { eventStore: EventStore }) {
    this.#eventStore = eventStore;
  }

  project(event: PSMEvent) {
    switch (event.getEventType) {
      case "PoetCreated":
        this.#materializedView.createPoet(event);
        break;
      case "PoetEdited":
        this.#materializedView.updatePoet(event);
        break;
      case "PoetSetAsMC":
        this.#materializedView.setPoetAsMC(event);
        break;
      case "PoetSetAsPoet":
        this.#materializedView.setPoetAsPoet(event);
        break;
      case "PoetDeleted":
        this.#materializedView.deletePoet(event);
        break;
      case "PoetReactivated":
        this.#materializedView.reactivatePoet(event);
        break;
      default:
        throw new Error("Event type not supported");
    }
  }

  async recreateProjection({ originEventType }: { originEventType: string }) {
    const events = await this.#eventStore.getEventsByType(originEventType);
    const baseEvents = events.filter((e) => e.getEventType === originEventType);
    this.#events = [];
    if (!baseEvents) {
      throw new Error("Base events not found");
    }
    // get All AggregateIds
    const aggregateIds = baseEvents.map((e) => e.getAggregateId);
    console.log("🚀 ~ aggregateIds", aggregateIds);

    for (const aggregateId of aggregateIds) {
      const events = await this.#eventStore.getEvents(aggregateId);
      console.log("aggregateId", aggregateId);
      console.log("events", events);

      this.#events.push(...events);
    }

    // now that we have all the events we sort them  from the oldest to the newest
    this.#events.sort((a, b) => a.getTimestamp - b.getTimestamp);
    console.log("🚀 ~ events", this.#events);

    // for each event we apply the projection
    for (const event of this.#events) {
      this.project(event);
    }

    // produce the read Model
    this.#readModel = {
      poets: this.#materializedView.poets,
      poetsCount: this.#materializedView.poets.length,
      mcs: this.#materializedView.MCs,
      mcsCount: this.#materializedView.MCs.length,
      totalCount:
        this.#materializedView.poets.length + this.#materializedView.MCs.length,
    };
  }

  get readModel() {
    return this.#readModel;
  }
}
