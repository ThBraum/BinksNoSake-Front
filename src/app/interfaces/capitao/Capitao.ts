import { Pirata } from "../pirata/Pirata";
import { Timoneiro } from "../timoneiro/Timoneiro";

export interface Capitao {
  id: number;
  nome: string;
  piratas: Pirata[];
  timoneiroId: number;
  timoneiro: Timoneiro;
}
