import { Capitao } from "../capitao/Capitao";

export interface Timoneiro {
  id: number;
  nome: string;
  capitaoId: number;
  capitao: Capitao;
}
