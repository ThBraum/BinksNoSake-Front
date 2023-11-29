import { Funcao } from "src/app/enums/funcao";

export interface Usuario { //User
  id: string;
  username: string;
  email: string;
  primeiroNome: string;
  ultimoNome: string;
  phoneNumber?: string;
  imagemUrl: string;
  funcao?: Funcao;
  password: string;
  token?: string;
}
