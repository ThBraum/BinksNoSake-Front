import { Pirata } from "../pirata/Pirata";

export interface Navio {
  id: number;
  nome: string;
  pirataId: number;
  pirata: Pirata;
}
