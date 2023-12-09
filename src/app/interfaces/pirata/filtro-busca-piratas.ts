import { FiltroBuscaPaginacao } from "../filtro-busca-paginacao";
import { Pagination } from "../pagination";

export interface FiltroBuscaPiratas extends FiltroBuscaPaginacao {
  term?: string;
}
