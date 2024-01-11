import { Injectable, inject } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';
import { EMPTY, Observable, catchError, map, of } from 'rxjs';
import { CapitaesResult } from '../interfaces/capitao/capitaes-result';
import { CapitaoService } from '../services/capitao.service';
import { SnackBarService } from '../services/snack-bar.service';
import { FiltroBusca } from '../interfaces/filtro-busca';


export const CapitaoListaResolver: ResolveFn<CapitaesResult> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<CapitaesResult> => {
  const router = inject(Router);
  const capitaoService = inject(CapitaoService);
  const snackBarService = inject(SnackBarService);

  const searchFilter: FiltroBusca = {
    pageNumber: +(route.queryParamMap.get('PageNumber') ?? 1),
    pageSize: +(route.queryParamMap.get('PageSize') ?? 5),

    term: route.queryParamMap.get('Term') ?? undefined,
  };

  return capitaoService.getCapitaes(searchFilter).pipe(
    map((paginatedCapitaes) => ({ paginatedCapitaes: paginatedCapitaes, searchFilter })),
    catchError(() => {
      snackBarService.showMessage(
        'Não foi possível carregar os capitães',
        true
      );
      router.navigateByUrl('/pirata');
      return EMPTY;
    })
  );
}
