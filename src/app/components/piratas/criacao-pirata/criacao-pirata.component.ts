import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDateFormats, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { CapitaesPaginado } from 'src/app/interfaces/capitao/capitaesPaginado';
import { Capitao } from 'src/app/interfaces/capitao/capitao';
import { FiltroBusca } from 'src/app/interfaces/filtro-busca';
import { Pirata } from 'src/app/interfaces/pirata/pirata';
import { CapitaoService } from 'src/app/services/capitao.service';
import { PirataService } from 'src/app/services/pirata.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { environment } from 'src/environments/environment';




@Component({
  selector: 'app-criacao-pirata',
  templateUrl: './criacao-pirata.component.html',
  styleUrls: ['./criacao-pirata.component.css']
})
export class CriacaoPirataComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  capitaoSelecionado: number | null = null;
  todosCapitaes: Capitao[] | null = null;
  todosPiratas: Pirata[] = [];
  imagemUrl: string | ArrayBuffer | null | undefined = '../../../../assets/cloud-upload.jpg'
  file: File | null = null;
  camposPirata!: FormGroup;
  camposCapitao!: FormGroup;
  camposNavio!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly pirataService: PirataService,
    private readonly capitaoService: CapitaoService,
    private dateAdapter: DateAdapter<Date>,
    private readonly snackBarService: SnackBarService,
    private datePipe: DatePipe,
    private readonly router: Router,
  ) {
    // this.dateAdapter.setLocale('pt-BR');
  }

  ngOnInit(): void {
    const filtro: FiltroBusca = {
      pageNumber: 1,
      pageSize: 100,
    };

    this.capitaoService.getCapitaes(filtro).subscribe({
      next: (capitaes) => {
        this.todosCapitaes = capitaes.capitães;
      }
    });

    this.camposPirata = this.fb.group({
      nome: ['', Validators.required],
      funcao: ['', Validators.required],
      dataIngressoTripulacao: [null, Validators.required],
      objetivo: [''],
      // imagemUrl: [''],
    });

    this.camposCapitao = this.fb.group({
      capitao: [null],
      novoCapitao: [''],
    });

    this.camposNavio = this.fb.group({
      nm_navio: [''],
      pirata: [null],
    });
  }


  validateCapitaes(): void {
    const capitao = this.camposCapitao.get('capitao')?.value;
    const novoCapitao = this.camposCapitao.get('novoCapitao')?.value;

    if (capitao && novoCapitao) {
      this.snackBarService.showMessage("Selecione apenas Capitão Existente ou Novo Capitão, não ambos.", true);

      this.camposCapitao.get('capitao')?.patchValue(null);
      this.camposCapitao.get('novoCapitao')?.patchValue('');
    } else {
      this.generateFormData();
    }
  }

  generateFormData(): FormData {
    const dataPirata: Pirata = this.camposPirata.value;
    const capitaoSelecionado: Capitao | null = this.camposCapitao.get('capitao')?.value;
    const novoCapitaoNome: string | null = this.camposCapitao.get('novoCapitao')?.value;

    const dataCapitao: { id?: number, nome?: string } = {};

    if (capitaoSelecionado) {
      dataCapitao.id = capitaoSelecionado.id;
      dataCapitao.nome = capitaoSelecionado.nome;
    } else if (novoCapitaoNome) {
      dataCapitao.nome = novoCapitaoNome;
    }

    console.log("dataPirata: ", dataPirata);
    console.log("dataCapitao: ", dataCapitao);
    console.log("this.camposCapitao.get('novoCapitao')?.value: ", this.camposCapitao.get('novoCapitao')?.value)

    const formData = new FormData();

    for (let [key, val] of Object.entries(dataPirata)) {
      if (key === 'dataIngressoTripulacao') {
        val = this.datePipe.transform(val, 'yyyy-MM-dd'); //será convertido para o padrão brasileiro no back-end
      }
      if (val !== null && val !== undefined && val !== '') {
        formData.append(key, val);
        console.log(`key: ${key}, val: ${val}`);
      }
    }

    for (let [key, val] of Object.entries(dataCapitao)) {
      if (val !== null && val !== undefined && val !== '') {
        formData.append(`capitao.${key}`, val.toString());
        console.log(`capitao.${key}: ${val}`);
      }
    }

    if (this.file !== null) {
      const fileToUpload = this.file as File;
      formData.append('imagemUrl', fileToUpload);
      console.log("fileToUpload: ", fileToUpload);
    }

    console.log("formData: ", formData);

    this.addPirata(formData);

    return formData;
  }

  addPirata(data: FormData): void {
    console.log("data: ", data);
    this.pirataService.postPirata(data).subscribe({
      next: (pirata) => {
        console.log("pirata: ", pirata);
        this.snackBarService.showMessage("Pirata criado com sucesso.", false);
        this.router.navigate(['/piratas']);
      },
      error: (err) => {
        this.snackBarService.showMessage("Erro ao criar pirata.", true);
      },
    });
  }



  adicionarCapitao(): void {
    const novoCapitao = this.camposCapitao.get('novoCapitao')?.value;
    this.capitaoService.postCapitao(novoCapitao).subscribe({
      next: (capitao) => {
        this.snackBarService.showMessage("Capitão criado com sucesso.", false, 1500);
        this.camposCapitao.get('novoCapitao')?.patchValue('');
        this.camposCapitao.get('capitao')?.patchValue(capitao.nome);
        this.capitaoService.getCapitaes({ pageNumber: 1, pageSize: 100 }).subscribe({
          next: (capitaes) => {
            this.todosCapitaes = capitaes.capitães;
          }
        });
      },
      error: (err) => {
        this.snackBarService.showMessage("Erro ao criar capitão.", true);
      },
    });
  }

  onSelectFile(event?: any): void {
    if (event?.target && event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event) => this.imagemUrl = event.target?.result;

      this.file = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  mostrarImagem(imagemURL: string | undefined): void {
    if (imagemURL === null || imagemURL === '' || imagemURL === 'string' || imagemURL === undefined) {
      this.imagemUrl = '../../../../assets/cloud-upload.jpg';
    } else {
      this.imagemUrl = `${environment.apiURL}/resources/images/${imagemURL}`;
    }
  }

  public delete() {
    this.file = null;
    this.mostrarImagem(undefined);
  }
}
