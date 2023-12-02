import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Pirata } from 'src/app/interfaces/pirata/Pirata';
import { PirataService } from 'src/app/services/pirata.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-pirata-lista',
  templateUrl: './pirata-lista.component.html',
  styleUrls: ['./pirata-lista.component.css']
})
export class PirataListaComponent implements OnInit, OnDestroy {
  autoplaySubscription?: Subscription;
  dataSubscription?: Subscription;
  subscription?: Subscription;
  filterForm!: FormGroup;
  showMobileFilter = false;
  piratas!: Pirata[];


  displayedColumns: string[] = ['imagemURL', 'nome', 'funcao', 'capitao', 'dataIngressoTripulacao', 'objetivo'];
  dataSource: MatTableDataSource<Pirata> = new MatTableDataSource<Pirata>();


  constructor(
    private readonly router: ActivatedRoute,
    private readonly pirataService: PirataService,
    private readonly snackBarService: SnackBarService,
    private readonly fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.dataSubscription = this.router.data.subscribe({
      next: (data) => {
        this.piratas = data['pirata'];
        this.dataSource = new MatTableDataSource(this.piratas);
      },
      error: (error) => {
        console.log(error);
        this.snackBarService.showMessage('Não foi possível carregar os piratas', true);
      }
    });

    this.filterForm = this.fb.group({
      search: [{ value: '', disabled: false }],
    });
  }

  ngOnDestroy(): void {
    if (this.autoplaySubscription) this.autoplaySubscription.unsubscribe();
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }

  mostrarImagem(imagemURL: string): string {
    if (imagemURL === null || imagemURL === '' || imagemURL === 'string') {
      return 'assets/Chopper.png';
    }
    return `${environment.apiURL}/resources/images/${imagemURL}`
  }

  applyFilter(): void {
    console.log(this.filterForm.value);
  }
}
