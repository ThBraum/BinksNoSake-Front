import { Pagination } from "../pagination";
import { Pirata } from "./pirata";

export interface PiratasPaginado extends Pagination {
  piratas: Pirata[];
}
