import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
  ResolveFn
} from '@angular/router';
import { EMPTY, catchError, map } from 'rxjs';
import { inject } from '@angular/core';
import { PirataService } from '../services/pirata.service';
import { SnackBarService } from '../services/snack-bar.service';
import { PiratasResult } from '../interfaces/pirata/piratas-result';
import { FiltroBuscaPiratas } from '../interfaces/pirata/filtro-busca-piratas';

export const pirataListaResolver: ResolveFn<PiratasResult> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const pirataService = inject(PirataService);
  const snackBarService = inject(SnackBarService);

  const searchFilter: FiltroBuscaPiratas = {
    PageNumber: +(route.queryParamMap.get('PageNumber') ?? 1),
    PageSize: +(route.queryParamMap.get('PageSize') ?? 5),

    term: route.queryParamMap.get('Term') ?? undefined,
  };

  return pirataService.getPiratas(searchFilter).pipe(
    map((paginatedPiratas) => ({ paginatedPiratas, searchFilter })),
    catchError(() => {
      snackBarService.showMessage(
        'Não foi possível carregar os piratas',
        true
      );
      router.navigateByUrl('/home');
      return EMPTY;
    })
  );
}
