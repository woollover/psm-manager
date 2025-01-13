import { EventStore, Projector } from "@psm/core";
import {
  SlamsListMaterializedView,
  SlamsListMaterializedViewDBShape,
} from "../materialized-view/SlamList.materialized-view";
import { SlamEvent } from "src/slam/events";

export class SlamListProjector extends Projector<
  SlamEvent,
  SlamsListMaterializedView
> {
  constructor({
    eventStore,
    materializedViewData,
  }: {
    eventStore: EventStore;
    materializedViewData: SlamsListMaterializedViewDBShape | null;
  }) {
    super(eventStore, new SlamsListMaterializedView(materializedViewData));
  }

  project(event: SlamEvent): void {
    switch (event.eventType) {
      case "SlamCreated":
        this.materializedView.createSlam(event);
        break;
      case "SlamEdited":
        this.materializedView.editSlam(event);
        break;

      case "CallClosed":
        this.materializedView.closeSlamCall(event);
        break;

      case "CallOpened":
        this.materializedView.openSlamCall(event);
        break;

      case "MCAssigned":
        this.materializedView.assignMC(event);
        break;
      case "MCUnassigned":
        this.materializedView.removeMC(event);
        break;
      case "PoetAccepted":
        this.materializedView.acceptPoet(event);
        break;
      case "PoetCandidated":
        this.materializedView.candidatePoet(event);
        break;
      case "PoetRejected":
        this.materializedView.rejectPoet(event);
        break;
      case "SlamDeleted":
        this.materializedView.deleteSlam(event);
        break;
      case "SlamEnded":
        this.materializedView.endSlam(event);
        break;
      case "SlamStarted":
        this.materializedView.startSlam(event);
        break;

      default:
        throw new Error("Event type not supported");
    }
  }

  async recreateProjection<T extends SlamEvent["eventType"]>({
    originEventType,
  }: {
    originEventType: T;
  }): Promise<void> {
    this.materializedView = new SlamsListMaterializedView({ slams: new Map() });
    const events = await this.eventStore.getEventsByType(originEventType);
    const baseEvents = events.filter((e) => e.getEventType === originEventType);
    this.events = [];

    if (!baseEvents) {
      throw new Error("Base events not found");
    }
    // get All AggregateIds
    const aggregateIds = baseEvents.map((e) => e.getAggregateId);
    console.log("🚀 ~ aggregateIds", aggregateIds);

    for (const aggregateId of aggregateIds) {
      const events = (await this.eventStore.getEvents(
        aggregateId
      )) as SlamEvent[];
      console.log("aggregateId", aggregateId);
      console.log("events", events);

      this.events.push(...events);
    }

    // now that we have all the events we sort them  from the oldest to the newest
    this.events.sort((a, b) => a.getTimestamp - b.getTimestamp);
    console.log("🚀 ~ events", this.events);

    // for each event we apply the projection
    for (const event of this.events) {
      this.project(event as SlamEvent);
    }
  }
}

/*
  mutate(event: SlamEvent) {
  
  }

  recreateProjection<T extends SlamEvent["eventType"]>({
    originEventType,
  }: {
    originEventType: T;
  }) {}
}*/
