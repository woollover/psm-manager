export interface GetPoetListResponse {
  data: {
    poets: Poet[];
    count: number;
    mcs: Poet[];
    mcCount: number;
    totalCount: number;
  };
}
export interface Poet {
  firstName: string;
  lastName: string;
  isMC: boolean;
  aggregateId: string;
  id: string;
  birthDate: string;
  instagramHandle: string;
  email: string;
  isPoet: boolean;
}
