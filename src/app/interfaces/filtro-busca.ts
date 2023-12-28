import { FiltroBuscaPaginacao } from "./filtro-busca-paginacao";
import { Pagination } from "./pagination";

export interface FiltroBusca extends FiltroBuscaPaginacao {
  term?: string;
}
