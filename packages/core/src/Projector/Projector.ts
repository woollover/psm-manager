import { PSMEvent } from "../Event/Event";
import { EventStore } from "../EventStore";

export abstract class Projector<
  EventUnion extends PSMEvent<any, string>,
  MaterializedViewClass
> {
  protected events: Array<EventUnion> = [];
  protected eventStore: EventStore;
  protected materializedView: MaterializedViewClass;

  constructor(eventStore: EventStore, materializedView: MaterializedViewClass) {
    this.eventStore = eventStore;
    this.materializedView = materializedView;
  }

  abstract project(event: EventUnion): void;

  abstract recreateProjection<T extends EventUnion["eventType"]>({
    originEventType,
  }: {
    originEventType: T;
  }): void;
}
