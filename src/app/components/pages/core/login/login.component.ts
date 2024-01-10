import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { clientId } from 'src/app/clientId';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  hidePassword: boolean = true;
  hidePasswordConfirmation: boolean = true;
  recuperarSenha: boolean = false;
  spinner: boolean = false;
  signInForm!: FormGroup;
  signUpForm!: FormGroup;
  image: File | null = null;
  url: string | ArrayBuffer | null | undefined = '';
  usuario!: Usuario;

  constructor(
    private readonly router: Router,
    private readonly usuarioService: UsuarioService,
    private readonly snackBarService: SnackBarService,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: [
        { value: null, disabled: false },
        [Validators.required]
      ],
      password: [
        { value: null, disabled: false },
        [Validators.required, Validators.minLength(6)]
      ],
    });

    this.signUpForm = this.fb.group({
      username: [
        { value: null, disabled: false },
        [Validators.required]
      ],
      nome: [
        { value: null, disabled: false },
        [Validators.required]
      ],
      sobrenome: [
        { value: null, disabled: false },
        [Validators.required]
      ],
      email: [
        { value: null, disabled: false },
        [Validators.email, Validators.required]
      ],
      phoneNumber: [
        { value: null, disabled: false },
      ],
      password: [
        { value: null, disabled: false },
        [Validators.required, Validators.minLength(6)]
      ],
      confirmarSenha: [
        { value: null, disabled: false },
        [Validators.required, Validators.minLength(6), this.validarSenha]
      ],
    });

    this.mostrarImagem(undefined);
  }

  login(): void {
    const user = {
      username: this.signInForm.value.username,
      password: this.signInForm.value.password,
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

  generateFormData(data: Usuario): FormData {
    const formData = new FormData();

    for (let [key, val] of Object.entries(data)) {
      if (val !== null && val !== undefined && val !== '') {
        formData.append(key, val);
      }
    }

    if (this.image !== null) {
      const fileToUpload = this.image as File;
      formData.append('imagemUrl', fileToUpload);
    }

    this.profileCreate(formData);
    return formData;
  }

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
      },
    })
  }

  validarSenha(confirmarSenhaControl: AbstractControl) {
    const senhaControl = confirmarSenhaControl.parent?.get('password');
    if (senhaControl?.value !== confirmarSenhaControl.value) {
      return { senhaIncompativel: true };
    } else {
      return null;
    }
  }

  onSelectFile(event?: any): void {
    if (event?.target && event.target.files && event.target.files[0]) {
      var render = new FileReader();

      render.onload = (event) => {
        this.url = event.target?.result;
      }

      this.image = event.target.files[0];
      render.readAsDataURL(event.target.files[0]);

    }
  }

  mostrarImagem(imagemURL: string | undefined): void {
    if (imagemURL === null || imagemURL === '' || imagemURL === 'string' || imagemURL === undefined) {
      this.url = './../../../../../assets/1063px-New_user_icon-01.svg.svg';
    } else if (imagemURL.startsWith('http')) {
      this.url = imagemURL;
    } else {
      this.url = `${environment.apiURL}/resources/images/${imagemURL}`;
    }
  }

  delete() {
    this.image = null;
    this.mostrarImagem(undefined);
  }
}

