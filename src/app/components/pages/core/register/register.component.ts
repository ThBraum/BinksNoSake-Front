import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioCreate } from 'src/app/interfaces/usuario/usuarioCreate';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly router: Router,
    private snackBarService: SnackBarService,
  ) { }

  profileCreate(data: FormData): void {
    this.usuarioService.register(data).subscribe({
      next: (response: any) => {
        if (response.user) this.usuarioService.setCurrentUser(response.user.result);
        if (response.token) this.usuarioService.atualizarTokenAtual(response.token);

        this.snackBarService.showMessage("Perfil criado com sucesso.");
        this.router.navigateByUrl('/pirata');
      },
      error: (err) => {
        this.snackBarService.showMessage("Erro ao criar perfil.", true);
        const error = err.error;
        console.log(error);
      },
    })
  }
}
