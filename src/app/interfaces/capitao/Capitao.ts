import { Pirata } from "../pirata/pirata";
import { Timoneiro } from "../timoneiro/Timoneiro";

export interface Capitao {
  id: number;
  nome: string;
  piratas: Pirata[];
  timoneiroId: number;
  timoneiro: Timoneiro;
}
