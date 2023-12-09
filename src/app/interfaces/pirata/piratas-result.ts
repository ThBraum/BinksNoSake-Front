import { FiltroBuscaPiratas } from "./filtro-busca-piratas";
import { PiratasPaginado } from "./piratasPaginado";

export interface PiratasResult {
  searchFilter: FiltroBuscaPiratas;
  paginatedPiratas: PiratasPaginado;
}
