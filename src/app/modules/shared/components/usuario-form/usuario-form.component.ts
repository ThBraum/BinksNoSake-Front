import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Funcao } from 'src/app/enums/funcao';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent {
  @Input() textoTipoAcaoBotao: String = '';
  @Input() dadosUsuario?: Usuario;
  @Input() usuarioLogin: boolean = true;
  @Input() usuarioCreate: boolean = true;
  @Input() usuarioUpdate: boolean = true;
  @Input() coletaFuncao: boolean = true;
  @Input() coletaImagem: boolean = true;
  @Input() coletaSenha: boolean = true;
  @Input() coletaPhoneNumber: boolean = true;

  @Output() notificarSubmitForm: EventEmitter<FormData> =
    new EventEmitter();

  usuarioForm!: FormGroup;
  funcao = Object.values(Funcao);
  hidePassword = true;
  hidePasswordConfirmation = true;
  image: File | null = null;
  url: string | ArrayBuffer | null | undefined = '';
  // file: File[] = [];
  usuario!: Usuario;

  constructor(
    private fb: FormBuilder,
    private readonly usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      id: [{ value: this.dadosUsuario?.id, disabled: false }],
      username: [
        { value: this.dadosUsuario?.username, disabled: false },
      ],
      primeiroNome: [
        { value: this.dadosUsuario?.primeiroNome, disabled: false },
        this.usuarioCreate || this.usuarioUpdate ? [Validators.required] : [],
      ],
      ultimoNome: [
        { value: this.dadosUsuario?.ultimoNome, disabled: false },
        this.usuarioCreate || this.usuarioUpdate ? [Validators.required] : [],
      ],
      email: [
        { value: this.dadosUsuario?.email, disabled: false },
        this.usuarioCreate || this.usuarioUpdate ? [Validators.email, Validators.required] : [],
      ],
      phoneNumber: [
        { value: this.dadosUsuario?.phoneNumber, disabled: false },
      ],
      funcao: [
        { value: this.dadosUsuario?.funcao, disabled: false },
      ],
      password: [
        { value: this.dadosUsuario?.password, disabled: false },
        this.coletaSenha || this.usuarioCreate ? [Validators.required, Validators.minLength(6)] : [],
      ],
      confirmarSenha: [
        { value: null, disabled: false },
        this.coletaSenha || this.usuarioCreate
          ? [Validators.required, Validators.minLength(6), this.validarSenha]
          : [],
      ],
    });
    this.mostrarImagem(this.dadosUsuario?.imagemURL);
  }

  submit(): void {
    const dadosFormulario = {} as Usuario;

    if (this.usuarioForm.value.id) {
      dadosFormulario.id = this.usuarioForm.value.id;
    }

    if (this.usuarioLogin) {
      dadosFormulario.username = this.usuarioForm.value.username;
      dadosFormulario.password = this.usuarioForm.value.password;
    }

    if (this.usuarioCreate) {
      dadosFormulario.username = this.usuarioForm.value.username;
      dadosFormulario.email = this.usuarioForm.value.email;
      dadosFormulario.primeiroNome = this.usuarioForm.value.primeiroNome;
      dadosFormulario.ultimoNome = this.usuarioForm.value.ultimoNome;
      dadosFormulario.phoneNumber = this.usuarioForm.value.phoneNumber;
      dadosFormulario.password = this.usuarioForm.value.password;
    }

    if (this.usuarioUpdate) {
      dadosFormulario.username = this.usuarioForm.value.username;
      dadosFormulario.email = this.usuarioForm.value.email;
      dadosFormulario.primeiroNome = this.usuarioForm.value.primeiroNome;
      dadosFormulario.ultimoNome = this.usuarioForm.value.ultimoNome;
      dadosFormulario.phoneNumber = this.usuarioForm.value.phoneNumber;
      dadosFormulario.funcao = this.usuarioForm.value.funcao;
    }

    // ----------------------------------


    if (this.coletaFuncao) {
      dadosFormulario.funcao = this.usuarioForm.value.funcao;
    }

    if (this.coletaSenha) {
      dadosFormulario.password = this.usuarioForm.value.password;
    }

    this.notificarSubmitForm.emit(this.generateFormData(dadosFormulario));
  }

  validarSenha(confirmarSenhaControl: AbstractControl) {
    const senhaControl = confirmarSenhaControl.parent?.get('senha');
    if (senhaControl?.value !== confirmarSenhaControl.value) {
      return { senhaIncompativel: true };
    } else {
      return null;
    }
  }

  generateFormData(data: Usuario): FormData {
    const formData = new FormData();

    for (let [key, val] of Object.entries(data)) {
      formData.append(key, val);
    }

    if (this.image !== null) {
      const fileToUpload = this.image as File;
      formData.append('imagemUrl', fileToUpload);
    }

    return formData;
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
      this.url = './../../../../../assets/default-avatar.svg';
    } else {
      this.url = `${environment.apiURL}/resources/images/${imagemURL}`;
    }
  }

  public delete() {
    this.image = null;
    this.mostrarImagem(undefined);
  }
}
