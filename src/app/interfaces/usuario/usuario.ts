import { Funcao } from "src/app/enums/funcao";

export interface Usuario { //User
  id: number;
  username: string;
  email: string;
  primeiroNome: string;
  ultimoNome: string;
  phoneNumber?: string;
  imagemURL: string;
  funcao?: Funcao;
  password: string;
  token?: string;
  refreshToken?: string;
}
