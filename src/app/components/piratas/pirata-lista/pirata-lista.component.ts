import { Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Pagination } from 'src/app/interfaces/pagination';
import { FiltroBusca } from 'src/app/interfaces/filtro-busca';
import { PiratasResult } from 'src/app/interfaces/pirata/piratas-result';
import { PiratasPaginado } from 'src/app/interfaces/pirata/piratasPaginado';
import { PirataService } from 'src/app/services/pirata.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { environment } from 'src/environments/environment';
import { Pirata } from 'src/app/interfaces/pirata/pirata';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DatePipe } from '@angular/common';

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
  subscription?: Subscription;
  filterForm!: FormGroup;
  showMobileFilter = false;
  loading = false;
  pageSizeValues = [5, 10, 25, 50];

  displayedColumns: string[] = ['imagemURL', 'nome', 'funcao', 'capitao', 'dataIngressoTripulacao', 'objetivo', 'acoes'];
  dataSource: MatTableDataSource<Pirata> = new MatTableDataSource<Pirata>();

  piratas: Pirata[] = [];
  usuario: Usuario | null = null;

  piratasPaginado!: PiratasPaginado;
  filter!: FiltroBusca;

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
    private readonly usuarioService: UsuarioService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.data.subscribe({
      next: (data) => {
        const searchResult: PiratasResult = data['pirata'];
        this.filter = searchResult.searchFilter;
        this.setData(searchResult.paginatedPiratas);
      }
    });

    this.usuarioService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      }
    });

    this.filterForm = this.fb.group({
      search: [{ value: this.filter.term ?? '', disabled: false }],
      pageSize: [{ value: this.filter.pageSize, disabled: false }],
    });

    this.search();

    this.pageSizeChange();

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  search(): void {
    this.filterForm.get('search')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(800),
      distinctUntilChanged(),
      switchMap((value) => {
        this.filter.term = value === '' ? undefined : value;
        this.filter.pageNumber = 1;
        return this.pirataService.getPiratas(this.filter);
      })
    ).subscribe({
      next: (piratasPaginado) => {
        this.setData(piratasPaginado);
        setTimeout(() => {
          this.paginator.pageIndex = this.filter.pageNumber - 1;
        });
        this.router.navigate(['/pirata'], {
          queryParams: {
            PageNumber: this.filter.pageNumber,
            PageSize: this.filter.pageSize,
            Term: this.filter.term,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      },
      error: (error) => {
        this.snackBarService.showMessage(error.error, true);
      },
    });
  }

  pageSizeChange(): void {
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
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      },
      error: (error) => {
        this.snackBarService.showMessage(error.error, true);
      },
    });
  }

  mostrarImagem(imagemURL: string): string {
    if (imagemURL === null || imagemURL === '' || imagemURL === 'string') {
      return 'assets/Chopper.png';
    }
    return `${environment.apiURL}/resources/images/${imagemURL}`
  }

  handlePageEvent(event: PageEvent): void {
    this.filter.pageNumber = event.pageIndex + 1;
    this.filter.pageSize = event.pageSize;
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
        this.setData(piratasPaginado);
        this.router.navigate(['/pirata'], {
          queryParams: {
            PageNumber: this.filter.pageNumber,
            PageSize: this.filter.pageSize,
            Term: this.filter.term,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      },
      error: (error) => {
        this.snackBarService.showMessage(error.error, true);
      }
    }).add(() => (this.loading = false));
  }

  sortData(event: Sort): void {
    if (!this.filter.sort) {
      this.filter.sort = { active: '', direction: 'asc' };
    }

    if (this.filter.sort.active === event.active) {
      this.filter.sort.direction = this.filter.sort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.filter.sort.active = event.active || '';
      this.filter.sort.direction = 'asc';
    }

    this.loadPiratas(this.filter);
  }

  private setData(piratasPaginado: PiratasPaginado) {
    this.piratasPaginado = piratasPaginado;
    this.piratasPaginado.pageNumber -= 1;
    this.dataSource = new MatTableDataSource(this.piratasPaginado.piratas);
    if (this.sort) this.dataSource.sort = this.sort;
  }

  handleUnauthorized(): void {
    if (!this.usuario) {
      this.router.navigateByUrl('/login');
      return;
    }
    if (this.usuario.funcao !== "Administrador") this.snackBarService.showMessage("Você não tem permissão para realizar essa ação.", true, 2000);
  }
}
