import { UsuarioUpdate } from "./usuarioUpdate";

export interface PerfilUpdate extends Omit<UsuarioUpdate, 'funcao'> {}
