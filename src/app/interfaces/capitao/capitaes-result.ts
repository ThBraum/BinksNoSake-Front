import { FiltroBusca } from "../filtro-busca";
import { CapitaesPaginado } from "./capitaesPaginado";

export interface CapitaesResult {
  searchFilter: FiltroBusca;
  paginatedCapitaes: CapitaesPaginado;
}
