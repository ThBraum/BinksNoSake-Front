import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { clientId } from 'src/app/clientId';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


const googleLogoURL =
"https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";
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
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private fb: FormBuilder,
  ) {
    this.matIconRegistry.addSvgIcon(
      "logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL)
    )
   }


  ngOnInit(): void {
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

  loginWithGoogle() {
    this.usuarioService.googleAuth();
  }

  // async handleCredentialResponse(response: CredentialResponse) {
  //   await this.usuarioService.loginWithGoogle(response.credential).subscribe({
  //     next: () => {
  //       this.router.navigateByUrl('/pirata').then(() => {
  //         this.usuarioService.emitLoginEvent();
  //       });
  //     },
  //     error: (error) => {
  //       this.recuperarSenha = true;
  //       this.snackBarService.showMessage(error.error, true);
  //     }
  //   }).add(() => (this.spinner = false));
  //   this.spinner = true;
  // }
}

