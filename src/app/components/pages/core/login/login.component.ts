import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { clientId } from 'src/app/clientId';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly usuarioService: UsuarioService,
    private readonly snackBarService: SnackBarService,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', () => {
      this.loadGoogleLibrary();
    });
  }

  hide: boolean = true;
  recuperarSenha: boolean = false;
  spinner: boolean = false;

  loginForm: UntypedFormGroup = this.fb.group({
    username: [
      { value: null, disabled: false },
      [Validators.required]
    ],
    password: [
      { value: null, disabled: false },
      [Validators.required, Validators.minLength(6)]
    ],
  });

  login(): void {
    const user = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };
    this.usuarioService.login(user).subscribe({
      next: () => {
        this.router.navigateByUrl('/pirata').then(() => {
          this.usuarioService.emitLoginEvent();
        });
      },
      error: (error) => {
        if (error.status === 401) {
          this.snackBarService.showMessage('Usuário e/ou Senha incorreto(s)', true);
          this.recuperarSenha = true;
        } else {
          this.snackBarService.showMessage(error.error, true);
        }
      }
    }).add(() => (this.spinner = false));
    this.spinner = true;
  }

  loadGoogleLibrary() {
    const script = document.createElement('script');
    script.onload = () => {
      this.initializeGoogleButton();
    };
    script.src = 'https://accounts.google.com/gsi/client';
    document.head.appendChild(script);
  }

  initializeGoogleButton() {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: clientId.google,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: true,
      cancel_on_tap_outside: false,
    });
    // @ts-ignore
    google.accounts.id.renderButton(
      // @ts-ignore
      document.getElementById('buttonDiv'),
      {
        theme: 'filled_black',
        size: 'large',
        type: 'standard',
        shape: 'circle',
        text: 'signin_with',
        width: document.getElementById('parentElement')?.offsetWidth,
        logo_alignment: 'left',
      }
    );
    // @ts-ignore
    google.accounts.id.prompt((notification: PromptMomentNotification) => {
      if (notification.isNotDisplayed()) {
        document.cookie = `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        // @ts-ignore
        google.accounts.id.prompt();
      }
     });
  }

  async handleCredentialResponse(response: CredentialResponse) {
    await this.usuarioService.loginWithGoogle(response.credential).subscribe({
      next: () => {
        this.router.navigateByUrl('/pirata').then(() => {
          this.usuarioService.emitLoginEvent();
        });
      },
      error: (error) => {
        this.recuperarSenha = true;
        this.snackBarService.showMessage(error.error, true);
      }
    }).add(() => (this.spinner = false));
    this.spinner = true;
  }
}

