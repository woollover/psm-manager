/**
 * this file containst hte exact shape the materialized views has in DB
 * this is a contract between the projector (it will produce the materialized view)
 * and the ReadModel (a querying engine that will query this very shape)
 *
 */

export interface PoetsListPoet {
  id: string;
  firstName: string;
  lastName: string;
  isMC: boolean;
  isPoet: boolean;
  instagramHandle: string;
  birthDate: string;
}

export interface PoetsListMaterializedViewDBShape {
  poets: PoetsListPoet[];
}
