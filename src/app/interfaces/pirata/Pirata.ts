import { Capitao } from "../capitao/capitao";
import { Navio } from "../navio/navio";

export interface Pirata {
  id: number;
  nome: string;
  funcao: string;
  dataIngressoTripulacao: Date;
  objetivo: string;
  imagemURL: string;
  capitaoId: number;
  capitao: Capitao;
  navios: Navio[];
}
