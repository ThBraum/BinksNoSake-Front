import { Pagination } from "../pagination";
import { Capitao } from "./capitao";

export interface CapitaesPaginado extends Pagination {
  capitães: Capitao[];
}
