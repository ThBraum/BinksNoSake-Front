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
    private readonly snackBarService: SnackBarService) { }

  register(data: UsuarioCreate): void {
    const newAccount: UsuarioCreate = {
      primeiroNome: data.primeiroNome,
      ultimoNome: data.ultimoNome,
      username: data.username,
      email: data.email,
      password: data.password,
    }
    this.usuarioService.register(newAccount).subscribe({
      next: (response) => {
        this.snackBarService.showMessage('Conta criada com sucesso!', false);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.snackBarService.showMessage('Erro ao criar conta', true);
      }
    });
  }
}
