import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable, catchError, of, retry, switchMap, take, throwError } from 'rxjs';
import { Usuario } from '../interfaces/usuario/usuario';
import { UsuarioService } from '../services/usuario.service';
import { SnackBarService } from '../services/snack-bar.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Route, Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  ctr = 0;

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly snackBarService: SnackBarService,
    private readonly jwtHelperService: JwtHelperService,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/login')) {
      return next.handle(req);
    }

    const tokenAtual = this.usuarioService.tokenAtual;
    if (tokenAtual) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${tokenAtual}`
        }
      });
    }
    return next.handle(req).pipe(catchError(err => this.handleAuthError(err)));
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err && this.ctr != 1) {
      this.ctr++;
      this.usuarioService.refreshToken().subscribe({
        next: (response: any) => {
          if (response && response.token) {
            this.usuarioService.atualizarTokenAtual(response.token);
            retry(1);
          }
          return EMPTY;
        },
        error: (err: any) => {
          this.usuarioService.logout();
          this.router.navigateByUrl('/login');
          this.snackBarService.showMessage('Sessão expirada, faça login novamente!');
          return EMPTY;
        }
      });
      return EMPTY;
    } else {
      this.ctr = 0;
      return EMPTY;
    }
  }
}
