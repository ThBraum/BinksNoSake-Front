import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Funcao } from 'src/app/enums/funcao';
import { Usuario } from 'src/app/interfaces/usuario/usuario';

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

  @Output() notificarSubmitForm: EventEmitter<Usuario> =
    new EventEmitter();

  usuarioForm!: FormGroup;
  funcao = Object.values(Funcao);
  hidePassword = true;
  hidePasswordConfirmation = true;
  url: any = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      id: [{ value: this.dadosUsuario?.id, disabled: false }],
      username: [
        { value: this.dadosUsuario?.username, disabled: false },
        this.usuarioLogin ? [Validators.required] : [],
      ],
      primeiroNome: [
        { value: this.dadosUsuario?.primeiroNome, disabled: false },
        this.usuarioCreate ? [Validators.required] : [],
      ],
      ultimoNome: [
        { value: this.dadosUsuario?.ultimoNome, disabled: false },
        this.usuarioCreate ? [Validators.required] : [],
      ],
      email: [
        { value: this.dadosUsuario?.email, disabled: false },
        this.usuarioCreate ? [Validators.email, Validators.required] : [],
      ],
      phoneNumber: [
        { value: this.dadosUsuario?.phoneNumber, disabled: false },
        this.usuarioCreate ? [Validators.required] : [],
      ],
      funcao: [
        { value: this.dadosUsuario?.funcao, disabled: false },
        this.usuarioUpdate ? [Validators.required] : [],
      ],
      password: [
        { value: this.dadosUsuario?.password, disabled: false },
        this.coletaSenha ? [Validators.required, Validators.minLength(6)] : [],
      ],
      confirmarSenha: [
        { value: null, disabled: false },
        this.coletaSenha
          ? [Validators.required, Validators.minLength(6), this.validarSenha]
          : [],
      ],
      imagemUrl: [
        { value: this.dadosUsuario?.imagemUrl, disabled: false },
        this.usuarioUpdate ? [] : [],
      ]
    });
  }

  submit(): void {
    const dadosFormulario: Usuario = {
      id: '',
      primeiroNome: '',
      ultimoNome: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      imagemUrl: '',
    };

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
      dadosFormulario.password = this.usuarioForm.value.password;
      dadosFormulario.imagemUrl = this.usuarioForm.value.imagemUrl;
      dadosFormulario.funcao = this.usuarioForm.value.funcao;
    }

    // ----------------------------------

    if (this.coletaImagem) {
      dadosFormulario.imagemUrl = typeof this.url ==="undefined"? "" :this.url;
    }

    if (this.coletaFuncao) {
      dadosFormulario.funcao = this.usuarioForm.value.funcao;
    }

    if (this.coletaSenha) {
      dadosFormulario.password = this.usuarioForm.value.password;
    }

    this.notificarSubmitForm.emit(dadosFormulario);
  }

  validarSenha(confirmarSenhaControl: AbstractControl) {
    const senhaControl = confirmarSenhaControl.parent?.get('senha');
    if (senhaControl?.value !== confirmarSenhaControl.value) {
      return { senhaIncompativel: true };
    } else {
      return null;
    }
  }

  onSelectFile(event?: any): void {
    if (event?.target && event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        this.url = event.target?.result;
      }
    }
  }

  public delete(){
    this.url = undefined;
  }
}
