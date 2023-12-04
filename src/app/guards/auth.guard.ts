import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { SnackBarService } from '../services/snack-bar.service';

export const AuthGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const usuarioService: UsuarioService = inject(UsuarioService);
  const router: Router = inject(Router);
  const snackBarService: SnackBarService = inject(SnackBarService);

  return usuarioService.currentUser$.pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        snackBarService.showMessage(
          'Usuario não autenticado! Realize o login para poder acessar o conteúdo solicitado',
          true
        );
        router.navigateByUrl('/login');
        return false;
      }
    })
  );
};
