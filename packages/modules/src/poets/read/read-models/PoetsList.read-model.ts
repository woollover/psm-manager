import { PoetsListPoet } from "src/poets/repository/PoetMaterializedViewRepository";

export interface PoetsListReadModel {
  poets: PoetsListPoet[];
  poetsCount: number;
  mcs: PoetsListPoet[];
  mcsCount: number;
  totalCount: number;
}

export interface PoetNamesList {
  aggregateId: string;
  firstName: string;
  lastName: string;
}
