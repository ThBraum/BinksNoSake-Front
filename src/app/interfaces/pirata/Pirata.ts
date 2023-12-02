import { Capitao } from "../capitao/Capitao";
import { Navio } from "../navio/Navio";

export interface Pirata {
  id: number;
  nome: string;
  funcao: string;
  dataIngressoTripulacao: Date;
  imagemURL: string;
  objetivo: string;
  capitaoId: string;
  capitao: Capitao;
  navios: Navio[];
}
