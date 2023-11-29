import { Usuario } from "./usuario";

//herda de Usuario (User) otimitindo id, imagemUrl, funcao
export interface UsuarioCreate extends Omit<Usuario, "id" | "imagemUrl" | "funcao"> { } //UserCreate
