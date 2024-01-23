import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Capitao } from 'src/app/interfaces/capitao/capitao';
import { FiltroBusca } from 'src/app/interfaces/filtro-busca';
import { Pirata } from 'src/app/interfaces/pirata/pirata';
import { CapitaoService } from 'src/app/services/capitao.service';
import { PirataService } from 'src/app/services/pirata.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-capitao-criacao',
  templateUrl: './capitao-criacao.component.html',
  styleUrls: ['./capitao-criacao.component.css']
})
export class CapitaoCriacaoComponent implements OnInit {
  capitaoSelecionado: number | null = null;
  todosCapitaes: Capitao[] | null = null;
  todosPiratas: Pirata[] = [];
  imagemUrl: string | ArrayBuffer | null | undefined = '../../../../assets/cloud-upload.jpg'
  file: File | null = null;
  camposCapitao!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly pirataService: PirataService,
    private readonly capitaoService: CapitaoService,
    private readonly snackBarService: SnackBarService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {

    const filtro: FiltroBusca = {
      pageNumber: 1,
      pageSize: 100,
    };

    this.pirataService.getPiratas(filtro).subscribe({
      next: (piratas) => {
        this.todosPiratas = piratas.piratas;
      }
    });

    this.camposCapitao = this.fb.group({
      nome: ['', Validators.required],
      piratas: ['', Validators.required],
    });
  }

  generateFormData(): FormData {
    const dataCapitao = this.camposCapitao.value;
    const formData = new FormData();

    for (let [key, value] of Object.entries(dataCapitao)) {
      if (key === 'piratas' && Array.isArray(value)) {
        value.forEach((pirata, index) => {
          formData.append(`piratas[${index}].id`, pirata.id);
          formData.append(`piratas[${index}].nome`, pirata.nome);
        });
      } else {
        formData.append(key, value as string);
      }
    }

    if (this.file !== null) {
      const fileToUpload = this.file as File;
      formData.append('imagemUrl', fileToUpload);
    }

    this.addCapitao(formData);

    return formData;
  }


  addCapitao(data: FormData): void {
    this.capitaoService.addCapitaoCompleto(data).subscribe({
      next: () => {
        this.snackBarService.showMessage('Capitão adicionado com sucesso!');
        this.router.navigate(['/capitao']);
      },
      error: () => {
        this.snackBarService.showMessage('Erro ao adicionar capitão', true);
      }
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

  delete() {
    this.file = null;
    this.mostrarImagem(undefined);
  }

  displaySelectedPirates(selectedPirates: Pirata[] | null): string {
    if (!selectedPirates || selectedPirates.length === 0) {
      return '';
    }

    const maxNamesToShow = 2;

    if (selectedPirates.length <= maxNamesToShow) {
      return selectedPirates.map(pirata => pirata.nome).join(', ');
    } else {
      const firstNames = selectedPirates.slice(0, maxNamesToShow).map(pirata => pirata.nome).join(', ');
      const remainingCount = selectedPirates.length - maxNamesToShow;
      const remainingText = `(+${remainingCount} ${remainingCount === 1 ? 'outro' : 'outros'})`;

      return `${firstNames} ${remainingText}`;
    }
  }
}
