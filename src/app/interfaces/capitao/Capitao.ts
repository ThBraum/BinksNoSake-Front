
import { Pirata } from "../pirata/pirata";
import { Timoneiro } from "../timoneiro/timoneiro";



export interface Capitao {
  id?: number;
  nome: string;
  imagemURL?: string;
  piratas?: Pirata[];
  timoneiroId?: number;
  timoneiro?: Timoneiro;
}
