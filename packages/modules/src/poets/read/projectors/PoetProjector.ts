import { PoetMaterializedView } from "../materialized-view/Poet.materialized-view";
import { PoetMaterializedViewRepository } from "../../repository/PoetMaterializedViewRepository";
import { PoetCreatedEvent, PoetEvent } from "src/poets/events";

export class PoetProjector {
  private poetsMaterializedViewRepository: PoetMaterializedViewRepository;

  constructor(poetRepository: PoetMaterializedViewRepository) {
    this.poetsMaterializedViewRepository = poetRepository;
  }

  async project(event: PoetEvent): Promise<void> {
    await this.poetsMaterializedViewRepository.load();
    console.log("event processed for projection", event.getEventType);
    switch (event.getEventType) {
      case "PoetCreated":
        console.log("⚙️ PoetCreated", event);
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
    let poets: PoetMaterializedView[] = [];
    try {
      poets = await this.poetsMaterializedViewRepository.load();
      console.log("🔥 Poets", poets);
    } catch (error) {
      console.log(error);
    }
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
    console.log("🔥 Poets", poets);
    await this.poetsMaterializedViewRepository.updatePoet(newPoet);
  }

  private async handlePoetUpdated(event: PoetEvent): Promise<void> {
    const poets = (await this.poetsMaterializedViewRepository.load()) || [];

    const poet = this.poetsMaterializedViewRepository.getById(
      event.getAggregateId
    );
    const index = poets.findIndex((p) => p.id === event.getAggregateId);
    const payload = event.getPayload;
    const updatedPoet = new PoetMaterializedView({
      ...poet,
      ...payload,
    });

    poets[index] = updatedPoet;
    //await this.poetsMaterializedViewRepository.update(poets);
  }
}
