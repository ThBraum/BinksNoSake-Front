import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
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
  pageSizeValues = [5, 10, 25, 50];

  displayedColumns: string[] = ['imagemURL', 'nome', 'funcao', 'capitao', 'dataIngressoTripulacao', 'objetivo'];
  dataSource: MatTableDataSource<Pirata> = new MatTableDataSource<Pirata>();

  piratas: Pirata[] = [];

  piratasPaginado!: PiratasPaginado;
  filter!: FiltroBuscaPiratas;

  searchSubject = new Subject<string>();
  destroy$ = new Subject<void>();


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
      pageSize: [{ value: this.filter.pageSize, disabled: false }],
    });

    this.filterForm.get('search')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((value) => {
        this.filter.term = value === '' ? undefined : value;
        this.filter.pageNumber = 1;
        return this.pirataService.getPiratas(this.filter);
      })
    ).subscribe({
      next: (piratasPaginado) => {
        this.setData(piratasPaginado);
        this.router.navigate(['/pirata'], {
          queryParams: {
            PageNumber: this.filter.pageNumber,
            PageSize: this.filter.pageSize,
            Term: this.filter.term,
          },
          replaceUrl: true,
        });
      },
      error: (error) => {
        this.snackBarService.showMessage(error.error, true);
      },
    });

    this.filterForm.get('pageSize')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      switchMap((value) => {
        this.filter.pageSize = value;
        this.filter.pageNumber = 1;
        return this.pirataService.getPiratas(this.filter);
      })
    ).subscribe({
      next: (piratasPaginado) => {
        this.setData(piratasPaginado);
        this.router.navigate(['/pirata'], {
          queryParams: {
            PageNumber: this.filter.pageNumber,
            PageSize: this.filter.pageSize,
            Term: this.filter.term,
          },
          replaceUrl: true,
        });
      },
      error: (error) => {
        this.snackBarService.showMessage(error.error, true);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  mostrarImagem(imagemURL: string): string {
    if (imagemURL === null || imagemURL === '' || imagemURL === 'string') {
      return 'assets/Chopper.png';
    }
    return `${environment.apiURL}/resources/images/${imagemURL}`
  }

  handlePageEvent(event: PageEvent): void {
    this.filter.pageNumber = event.pageIndex + 1;
    this.loadPiratas();
  }

  onKeyUp(event: KeyboardEvent): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  private loadPiratas(filter = this.filter, timer = 0) {
    this.loading = true;
    this.pirataService.getPiratas(filter).pipe(
      debounceTime(timer),
    ).subscribe({
      next: (piratasPaginado) => {
        console.log("veio aqui: ", filter);
        console.log("timer: ", timer);
        this.setData(piratasPaginado);
        this.router.navigate(['/pirata'], {
          queryParams: {
            PageNumber: this.filter.pageNumber,
            PageSize: this.filter.pageSize,
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
    this.piratasPaginado = piratasPaginado;
    this.piratasPaginado.pageNumber -= 1;
    this.dataSource = new MatTableDataSource(this.piratasPaginado.piratas);
  }
}
