import { Injectable, inject } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';
import { EMPTY, Observable, catchError, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario/usuario';
import { UsuarioService } from '../services/usuario.service';
import { SnackBarService } from '../services/snack-bar.service';


export const UsuarioResolver: ResolveFn<Usuario> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const usuarioService = inject(UsuarioService);

  return usuarioService.getUser().pipe(
    catchError((error) => {
      return EMPTY;
    })
  );
}
