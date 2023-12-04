import { Funcao } from "src/app/enums/funcao";
import { Usuario } from "./usuario";

//herda de Usuario (User) otimitindo id, se é administrador pode alterar a funcao
export interface UsuarioUpdate extends Omit<Usuario, "id"> { //UserUpdate
  funcao?: Funcao;
}
