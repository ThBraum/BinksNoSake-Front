import { Component, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { CapitaesResult } from 'src/app/interfaces/capitao/capitaes-result';
import { CapitaesPaginado } from 'src/app/interfaces/capitao/capitaesPaginado';
import { Capitao } from 'src/app/interfaces/capitao/capitao';
import { FiltroBusca } from 'src/app/interfaces/filtro-busca';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { CapitaoService } from 'src/app/services/capitao.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import { pathToFileURL } from 'url';

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
  selector: 'app-capitao-lista',
  templateUrl: './capitao-lista.component.html',
  styleUrls: ['./capitao-lista.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }
  ]
})
export class CapitaoListaComponent implements OnInit, OnDestroy {
  subscription?: Subscription;
  filterForm!: FormGroup;
  showMobileFilter = false;
  loading = false;
  pageSizeValues = [3, 5, 10, 25, 50];

  displayedColumns: string[] = ['imagemURL', 'nome', 'piratas', /* 'timoneiro', */ 'acoes'];
  dataSource: MatTableDataSource<Capitao> = new MatTableDataSource<Capitao>();

  capitaes: Capitao[] = [];
  usuario: Usuario | null = null;
  capitaesPaginados!: CapitaesPaginado;
  filter!: FiltroBusca;

  searchSubject = new Subject<string>();
  destroy$ = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private readonly capitaoService: CapitaoService,
    private readonly snackBarService: SnackBarService,
    private readonly usuarioService: UsuarioService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.data.subscribe({
      next: (data) => {
        const searchResult: CapitaesResult = data['capitao']
        this.filter = searchResult.searchFilter;
        this.setData(searchResult.paginatedCapitaes);
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

  pageSizeChange() {
    this.filterForm.get('pageSize')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(800),
      distinctUntilChanged(),
      switchMap((value) => {
        this.filter.pageSize = value;
        this.filter.pageNumber = 1;
        return this.capitaoService.getCapitaes(this.filter);
      })
    ).subscribe({
      next: (capitaesPaginado) => {
        this.setData(capitaesPaginado);
        this.router.navigate(['capitao'], {
          queryParams: {
            PageNumber: this.filter.pageNumber,
            PageSize: this.filter.pageSize,
            Term: this.filter.term
          },
          queryParamsHandling: 'merge',
          replaceUrl: true
        })
      },
      error: () => {
        this.snackBarService.showMessage('Não foi possível carregar os capitães', true);
      }
    }
    )
  }

  search() {
    this.filterForm.get('search')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(800),
      distinctUntilChanged(),
      switchMap((value) => {
        this.filter.term = value === '' ? undefined : value;
        this.filter.pageNumber = 1;
        return this.capitaoService.getCapitaes(this.filter);
      })
    ).subscribe({
      next: (capitaesPaginado) => {
        this.setData(capitaesPaginado);
        setTimeout(() => {
          this.paginator.pageIndex = this.filter.pageNumber - 1;
        });
        this.router.navigate(['capitao'], {
          queryParams: {
            PageNumber: this.filter.pageNumber,
            PageSize: this.filter.pageSize,
            Term: this.filter.term
          },
          queryParamsHandling: 'merge',
          replaceUrl: true
        })
      },
      error: () => {
        this.snackBarService.showMessage('Não foi possível carregar os capitães', true);
      }
    });
  }

  getPiratasNames(piratas: any[]): string {
    if (!piratas || piratas.length === 0) {
      return 'Nenhum pirata associado';
    }
    return piratas.map(pirata => pirata.nome).join(', ');
  }

  getTimoneiro(timoneiro: any): string {
    if (!timoneiro) {
      return 'Nenhum timoneiro associado';
    }
    return timoneiro.nome;
  }


  setData(capitaesPaginados: CapitaesPaginado): void {
    this.capitaesPaginados = capitaesPaginados;
    this.capitaes = capitaesPaginados.capitães;
    this.capitaesPaginados.pageNumber -= 1;
    this.dataSource = new MatTableDataSource<Capitao>(this.capitaes);
    if (this.sort) this.dataSource.sort = this.sort;
  }

  handleUnauthorized(): void {
    if (!this.usuario) {
      this.router.navigateByUrl('/login');
      return;
    }
    if (this.usuario.funcao !== "Administrador") this.snackBarService.showMessage("Você não tem permissão para realizar essa ação.", true, 2000);
  }

  mostrarImagem(imagemURL: string): string {
    if (imagemURL === null || imagemURL === undefined || imagemURL === '' || imagemURL === 'string') {
      return 'assets/the-three-captains-game-and-more-luffy-law-kid.jpg';
    }
    return `${environment.apiURL}/resources/images/${imagemURL}`;
  }

  handlePageEvent(event: PageEvent): void {
    this.filter.pageNumber = event.pageIndex + 1;
    this.filter.pageSize = event.pageSize;
    this.loadCapitaes();
  }

  loadCapitaes(filter = this.filter, timer = 0): void {
    this.loading = true;
    this.capitaoService.getCapitaes(filter).pipe(
      debounceTime(timer),
    ).subscribe({
      next: (capitaesPaginado) => {
        this.setData(capitaesPaginado);
        this.router.navigate(['capitao'], {
          queryParams: {
            PageNumber: this.filter.pageNumber,
            PageSize: this.filter.pageSize,
            Term: this.filter.term
          },
          queryParamsHandling: 'merge',
          replaceUrl: true
        })
      },
      error: (error) => {
        this.snackBarService.showMessage(error.error, true);
      }
    }).add(() => (this.loading = false));
  }

  onKeyUp(event: KeyboardEvent): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
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

    this.loadCapitaes(this.filter);
  }

}
