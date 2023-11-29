import { Component } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private readonly router: Router,
    private readonly usuarioService: UsuarioService,
    private readonly snackBarService: SnackBarService,
    private fb: FormBuilder,
  ) { }

  hide: boolean = true;
  recuperarSenha: boolean = false;
  spinner: boolean = false;

  loginForm: UntypedFormGroup = this.fb.group({
    username: [
      { value: null, disabled: false },
      [ Validators.required ]
    ],
    password: [
      { value: null, disabled: false },
      [ Validators.required, Validators.minLength(6) ]
    ],
  });

  login(): void {
    const user = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };
    this.usuarioService.login(user).subscribe({
      next: (response) => {
        this.snackBarService.showMessage('Login realizado com sucesso!', false);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.snackBarService.showMessage('Email e/ou Senha incorreto(s)', true);
        this.recuperarSenha = true;
      }
    }).add(() => (this.spinner = false));
    this.spinner = true;
  }
}

