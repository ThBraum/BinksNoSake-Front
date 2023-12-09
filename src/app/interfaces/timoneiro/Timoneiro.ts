import { Capitao } from "../capitao/capitao";

export interface Timoneiro {
  id: number;
  nome: string;
  capitaoId: number;
  capitao: Capitao;
}
