import { Navio } from "../navio/Navio";

export interface Pirata {
  id: number;
  nome: string;
  funcao: string;
  dataIngressoTripulacao: Date;
  objetivo: string;
  capitaoId: string;
  capitao: string;
  navios: Navio[];
}
