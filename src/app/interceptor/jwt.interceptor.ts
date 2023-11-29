import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, take, throwError } from 'rxjs';
import { Usuario } from '../interfaces/usuario/usuario';
import { UsuarioService } from '../services/usuario.service';
import { SnackBarService } from '../services/snack-bar.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly snackBarService: SnackBarService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: Usuario;

    this.usuarioService.currentUser$.pipe(take(1)).subscribe(user => {
      currentUser = user!;

      if (currentUser) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.token}`
          }
        }
        );
      }
    }
    );

    return next.handle(request).pipe(
      catchError((erro: HttpErrorResponse) => {
        if (erro.status === 401) {
          this.usuarioService.logout();
          this.snackBarService.showMessage("Erro ao validar usuário. Faça login novamente.", true);
        }
        return throwError(erro);
      })
    )
  }
}
