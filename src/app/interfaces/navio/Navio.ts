import { Pirata } from "../pirata/pirata";

export interface Navio {
  id: number;
  nome: string;
  pirataId: number;
  pirata: Pirata;
}
