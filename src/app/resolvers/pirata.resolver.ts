import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
  ResolveFn
} from '@angular/router';
import { EMPTY, Observable, catchError, of, tap } from 'rxjs';
import { Pirata } from '../interfaces/pirata/Pirata';
import { inject } from '@angular/core';
import { PirataService } from '../services/pirata.service';
import { SnackBarService } from '../services/snack-bar.service';

export const PirataResolver: ResolveFn<Pirata> = (
  route: ActivatedRouteSnapshot,
  state
) => {
  const router = inject(Router);
  const pirataService = inject(PirataService);
  const snackBarService = inject(SnackBarService);
  // const id = route.paramMap.get('id')!;

  return pirataService.getPiratas().pipe(tap((e) => {
    console.log(e);
  }),
    catchError((error) => {
      snackBarService.showMessage('Não foi possível carregar os piratas', true);
      // router.navigateByUrl('/home');
      return EMPTY;
    })
  );
}
