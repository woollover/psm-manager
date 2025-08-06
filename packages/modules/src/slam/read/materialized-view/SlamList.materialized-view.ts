import { CountryId } from "@psm/common";
import { NotFoundError } from "@psm/core";
import { DeleteSlamCommand } from "src/slam/commands";
import { CallClosedEvent } from "src/slam/events/CallClosed.event";
import { CallOpenedEvent } from "src/slam/events/CallOpened.event";
import { MCAssignedEvent } from "src/slam/events/MCAssigned.event";
import { MCUnassignedEvent } from "src/slam/events/MCUnassigned.event";
import { PoetAcceptedEvent } from "src/slam/events/PoetAccepted.event";
import { PoetCandidatedEvent } from "src/slam/events/PoetCandidated.event";
import { PoetRejectedEvent } from "src/slam/events/PoetRejected.event";
import { SlamCreatedEvent } from "src/slam/events/SlamCreated.event";
import { SlamDeletedEvent } from "src/slam/events/SlamDeleted.event";
import {
  SlamEditedEvent,
  SlamEditedPayload,
} from "src/slam/events/SlamEdited.event";
import { SlamEndedEvent } from "src/slam/events/SlamEnded.event";
import { SlamStartedEvent } from "src/slam/events/SlamStarted.event";

interface SlamsListData {
  id: string;
  name: string;
  date: string;
  region: string;
  city: string;
  venue: string;
  countryId: CountryId;
  deleted: boolean;
  started: boolean;
  ended: boolean;
  callOpen: boolean;
  mcs: string[];
  poets: string[];
  candidates: string[];
  rejectedPoets: Array<{
    poet: string;
    reason: string | null;
  }>;
}

export interface SlamsListMaterializedViewDBShape {
  slams: Map<string, SlamsListData>; // I like maps bcs they can get obj without iterations
}

export class SlamsListMaterializedView {
  #viewKey = "slam-list";
  #data: Map<string, SlamsListData> = new Map();

  constructor(materializedView: SlamsListMaterializedViewDBShape | null) {
    this.#data = materializedView
      ? new Map(Object.entries(materializedView.slams))
      : new Map();
  }

  createSlam(event: SlamCreatedEvent): SlamsListMaterializedView {
    const slamObj: SlamsListData = {
      id: event.getAggregateId,
      name: event.payload.name,
      // TODO - Errror in parsing the event
      date: new Date(event.payload.dateTime).toISOString(),
      region: event.payload.regionalId,
      city: event.payload.city,
      countryId: event.payload.countryId,
      venue: event.payload.venue,
      started: false,
      ended: false,
      callOpen: false,
      deleted: false,
      mcs: [],
      poets: [],
      candidates: [],
      rejectedPoets: [],
    };

    this.#data.set(event.getAggregateId, slamObj);

    return this;
  }

  editSlam(event: SlamEditedEvent): SlamsListMaterializedView {
    const slam = this.#data.get(event.getAggregateId);
    if (!slam) {
      throw new NotFoundError("slam not found");
    }
    if (event.payload.dateTime) {
      slam.date = new Date(event.payload.dateTime).toISOString();
    }
    const payload = event.payload;
    Object.keys(payload).forEach((key) => {
      const k = key as keyof SlamEditedPayload;
      if (!payload[k]) {
        return;
      }
      if (k === "dateTime") {
        slam.date = new Date(payload.dateTime!).toISOString();
        return;
      }
      if (k === "regionalId") {
        slam.region = payload.regionalId!;
        return;
      }
      if (k === "countryId") {
        slam.countryId = payload.countryId!;
        return;
      }
      slam[k] = payload[k];
    });

    this.#data.set(slam.id, slam);

    return this;
  }

  deleteSlam(event: SlamDeletedEvent): SlamsListMaterializedView {
    const slam = this.#data.get(event.getAggregateId);
    if (!slam) {
      throw new NotFoundError("slam not found");
    }
    slam.deleted = true;
    this.#data.set(slam.id, slam);

    return this;
  }

  assignMC(event: MCAssignedEvent) {
    const slam = this.#data.get(event.getAggregateId);
    if (!slam) {
      throw new NotFoundError("slam not found");
    }
    slam.mcs.push(event.payload.mcId);

    this.#data.set(slam.id, slam);
  }

  removeMC(event: MCUnassignedEvent) {
    const slam = this.#data.get(event.getAggregateId);
    if (!slam) {
      throw new NotFoundError("slam not found");
    }
    slam.mcs.filter((id) => id != event.payload.mcId);

    this.#data.set(slam.id, slam);
  }

  openSlamCall(event: CallOpenedEvent) {
    const slam = this.#data.get(event.getAggregateId);
    if (!slam) {
      throw new NotFoundError("slam not found");
    }
    slam.callOpen = true;
    this.#data.set(slam.id, slam);
  }

  closeSlamCall(event: CallClosedEvent) {
    const slam = this.#data.get(event.getAggregateId);
    if (!slam) {
      throw new NotFoundError("slam not found");
    }
    slam.callOpen = false;
    this.#data.set(slam.id, slam);
  }

  candidatePoet(event: PoetCandidatedEvent) {
    const slam = this.#data.get(event.getAggregateId);
    if (!slam) {
      throw new NotFoundError("slam not found");
    }

    slam.candidates = Array.from([
      ...new Set([...slam.candidates, event.payload.poetId]),
    ]);

    this.#data.set(slam.id, slam);
  }

  acceptPoet(event: PoetAcceptedEvent) {
    const slam = this.#data.get(event.getAggregateId);
    if (!slam) {
      throw new NotFoundError("slam not found");
    }
    slam.poets = Array.from(new Set([...slam.poets, event.payload.poetId]));

    this.#data.set(slam.id, slam);
  }

  rejectPoet(event: PoetRejectedEvent) {
    const slam = this.#data.get(event.getAggregateId);
    if (!slam) {
      throw new NotFoundError("slam not found");
    }
    slam.rejectedPoets = Array.from(
      new Set([
        ...slam.rejectedPoets,
        {
          poet: event.payload.poetId,
          reason: event.payload.reason || null,
        },
      ])
    );
    this.#data.set(slam.id, slam);
  }

  startSlam(event: SlamStartedEvent) {
    const slam = this.#data.get(event.getAggregateId);
    if (!slam) {
      throw new NotFoundError("slam not found");
    }
    slam.started = true;
    this.#data.set(slam.id, slam);
  }

  endSlam(event: SlamEndedEvent) {
    const slam = this.#data.get(event.getAggregateId);
    if (!slam) {
      console.error("SLAM NOT FOUND!!! WTF!");
      throw new NotFoundError("slam not found");
    }
    slam.started = true;
    slam.ended = true;
    this.#data.set(slam.id, slam);
  }

  get count() {
    let count = 0;
    this.#data.forEach((v, k) => {
      count++;
    });
    return count;
  }

  get countries() {
    const countriesArray: Array<CountryId> = [];

    this.#data.forEach((v, k) => {
      const slam = this.#data.get(k);
      console.log(slam);
      if (slam) {
        countriesArray.push(slam.countryId);
      }
    });

    return [...new Set(countriesArray)];
  }

  get slamArray() {
    const slamArray: SlamsListData[] = [];

    this.#data.forEach((v, k) => {
      const slam = this.#data.get(k);
      if (slam) {
        slamArray.push(slam);
      }
    });
    return slamArray.filter((obj) => obj != undefined);
  }

  // DB Shape
  public get viewToSave(): SlamsListMaterializedViewDBShape {
    return { slams: this.#data };
  }
}
