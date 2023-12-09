import { Pagination } from "./pagination";

export interface FiltroBuscaPaginacao extends Omit<Pagination, 'totalItems' | 'totalPages'> {}
