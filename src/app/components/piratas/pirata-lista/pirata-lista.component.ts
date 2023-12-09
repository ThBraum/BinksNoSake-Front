import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Pagination } from 'src/app/interfaces/pagination';
import { FiltroBuscaPiratas } from 'src/app/interfaces/pirata/filtro-busca-piratas';
import { Pirata } from 'src/app/interfaces/pirata/pirata';
import { PiratasResult } from 'src/app/interfaces/pirata/piratas-result';
import { PiratasPaginado } from 'src/app/interfaces/pirata/piratasPaginado';
import { PirataService } from 'src/app/services/pirata.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();
  firstPageLabel = `Primeira página`;
  itemsPerPageLabel = `Piratas por página:`;
  lastPageLabel = `Última página`;
  nextPageLabel = 'Próxima página';
  previousPageLabel = 'Página anterior';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Página 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${amountPages}`;
  }
}

@Component({
  selector: 'app-pirata-lista',
  templateUrl: './pirata-lista.component.html',
  styleUrls: ['./pirata-lista.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }
  ]
})
export class PirataListaComponent implements OnInit, OnDestroy {
  autoplaySubscription?: Subscription;
  subscription?: Subscription;
  filterForm!: FormGroup;
  showMobileFilter = false;
  loading = false;
  pageSizeValues = [1, 5, 10, 25, 50];

  displayedColumns: string[] = ['imagemURL', 'nome', 'funcao', 'capitao', 'dataIngressoTripulacao', 'objetivo'];
  dataSource: MatTableDataSource<Pirata> = new MatTableDataSource<Pirata>();

  piratas: Pirata[] = [];

  piratasPaginado!: PiratasPaginado | any;
  filter!: FiltroBuscaPiratas;



  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly pirataService: PirataService,
    private readonly snackBarService: SnackBarService,
    private readonly fb: FormBuilder,
    private readonly cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.data.subscribe({
      next: (data) => {
        const searchResult: PiratasResult = data['pirata'];
        this.filter = searchResult.searchFilter;
        this.setData(searchResult.paginatedPiratas);
      }
    });

    this.filterForm = this.fb.group({
      search: [{ value: this.filter.term ?? '', disabled: false }],
      pageSize: [{ value: this.filter.PageSize, disabled: false }],
    });
    console.log(this.filterForm.value);
    console.log("this.piratasPaginado.totalItems: ", this.piratasPaginado.totalItems);
    console.log("this.piratasPaginado.totalPages: ", this.piratasPaginado.totalPages);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  mostrarImagem(imagemURL: string): string {
    if (imagemURL === null || imagemURL === '' || imagemURL === 'string') {
      return 'assets/Chopper.png';
    }
    return `${environment.apiURL}/resources/images/${imagemURL}`
  }

  applyFilter(): void {
    this.filter.PageNumber = 1;
    const search = this.filterForm.value.search;

    this.filter.PageSize = this.filterForm.value.pageSize;
    this.filter.term = search === '' ? undefined : search;

    this.loadPiratas();
  }

  handlePageEvent(event: PageEvent): void {
    this.filter.PageNumber = event.pageIndex + 1;
    this.loadPiratas();
  }

  private loadPiratas() {
    this.loading = true;
    this.pirataService.getPiratas(this.filter).subscribe({
      next: (piratasPaginado) => {
        console.log("piratasPaginado: ", piratasPaginado);
        this.setData(piratasPaginado);
        this.router.navigate(['/pirata'], {
          queryParams: {
            PageNumber: this.filter.PageNumber,
            PageSize: this.filter.PageSize,
            Term: this.filter.term,
          },
          replaceUrl: true,
        });
      },
      error: (error) => {
        this.snackBarService.showMessage(error.error, true);
      }
    }).add(() => (this.loading = false));
  }

  private setData(piratasPaginado: PiratasPaginado) {
    console.log("piratasPaginado: ", piratasPaginado);
    this.piratasPaginado = piratasPaginado;
    this.piratasPaginado.currentPage -= 1;
    console.log("this.piratasPaginado: ", this.piratasPaginado);
    this.dataSource = new MatTableDataSource(this.piratasPaginado.piratas);
  }
}
