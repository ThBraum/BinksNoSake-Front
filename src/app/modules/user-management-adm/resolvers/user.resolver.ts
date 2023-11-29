import { Injectable, inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';
import { EMPTY, Observable, catchError, of } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { GerenciamentoUserService } from '../services/gerenciamento-user.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

export const UserResolver: ResolveFn<Usuario> = (
  route: ActivatedRouteSnapshot,
  state
) => {
  const router = inject(Router);
  const gerenciador = inject(GerenciamentoUserService);
  const snackBarService = inject(SnackBarService);
  const id = route.paramMap.get('id')!;

  return gerenciador.carregarUsuario(id).pipe(
    catchError((error) => {
      snackBarService.showMessage(`Não foi possível carregar o usuário`, true);
      router.navigateByUrl('/admin/users');
      return EMPTY;
    })
  );
};
