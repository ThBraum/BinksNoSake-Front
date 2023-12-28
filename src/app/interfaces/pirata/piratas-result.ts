import { FiltroBusca } from "../filtro-busca";
import { PiratasPaginado } from "./piratasPaginado";

export interface PiratasResult {
  searchFilter: FiltroBusca;
  paginatedPiratas: PiratasPaginado;
}
