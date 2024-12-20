import { PoetMaterializedView } from "../materialized-view/Poet.materialized-view";
import { PoetMaterializedViewRepository } from "../../repository/PoetMaterializedViewRepository";
import { PoetCreatedEvent, PoetEvent } from "src/poets/events";

export class PoetProjector {
  private poetRepository: PoetMaterializedViewRepository;

  constructor(poetRepository: PoetMaterializedViewRepository) {
    this.poetRepository = poetRepository;
  }

  async project(event: PoetEvent): Promise<void> {
    this.poetRepository.load();
    console.log("event processed", event.getEventType);
    switch (event.getEventType) {
      case "PoetCreated":
        await this.handlePoetCreated(event);
        break;
      case "PoetSetAsMC":
      case "PoetSetAsPoet":
      case "PoetEdited":
      case "PoetDeleted":
        await this.handlePoetUpdated(event);
        break;
      // Add other event types as needed
    }
  }

  private async handlePoetCreated(event: PoetCreatedEvent): Promise<void> {
    const poets = (await this.poetRepository.load()) || [];
    const payload = event.getPayload;
    const newPoet = new PoetMaterializedView({
      id: event.getAggregateId,
      name: payload.name,
      birthDate: payload.birthDate,
      isMC: payload.isMC,
      isPoet: payload.isPoet,
      instagramHandle: payload.instagramHandle,
    });

    poets.push(newPoet);
    await this.poetRepository.save();
  }

  private async handlePoetUpdated(event: PoetEvent): Promise<void> {
    const poets = (await this.poetRepository.load()) || [];

    const poet = this.poetRepository.getById(event.getAggregateId);
    const index = poets.findIndex((p) => p.id === event.getAggregateId);
    const payload = event.getPayload;
    const updatedPoet = new PoetMaterializedView({
      ...poet,
      ...payload,
    });

    poets[index] = updatedPoet;
    this.poetRepository.updatePoet(updatedPoet);
  }
}
