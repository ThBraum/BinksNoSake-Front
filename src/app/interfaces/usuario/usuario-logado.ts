import { Usuario } from "./usuario";

export interface UsuarioLogado {
  usuario: Usuario;
  token: string;
}
