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
  private retryCount = 0;

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
    return next.handle(req).pipe(catchError(err => this.handleAuthError(err, req)));
  }

  private handleAuthError(err: HttpErrorResponse, req: HttpRequest<any>): Observable<any> {
    if (err.status === 401) {
      return this.handleUnauthorizedError();
    }

    if (err.status === 403) {
      this.snackBarService.showMessage('Você não tem permissão para acessar este recurso!', true, 4000);
      return EMPTY;
    }

    if (err.status === 404 && !this.isImageRequest(req.url)) {
      this.snackBarService.showMessage('Recurso não encontrado!', true, 4000);
      return EMPTY;
    }

    if (err.status === 400) {
      this.snackBarService.showMessage(err.error, true, 4000);
      return EMPTY;
    }

    if (err.status === 500) {
      this.snackBarService.showMessage('Erro interno no servidor!', true, 4000);
      return EMPTY;
    }

    if (err.status === 409) {
      this.snackBarService.showMessage(err.error, true, 3500);
      return EMPTY;
    }

    return throwError(err);
  }

  private handleUnauthorizedError(): Observable<any> {
    if (this.retryCount < 1) {
      this.retryCount++;
      return this.usuarioService.refreshToken().pipe(
        switchMap((response: any) => {
          if (response && response.token) {
            this.usuarioService.atualizarTokenAtual(response.token);
            return of(response);
          }
          return EMPTY;
        }),
        catchError((refreshError: any) => {
          this.retryCount = 0;
          return this.handleRefreshError(null);
        })
      )
    } else {
      return this.handleRefreshError(null);
    }
  }

  private handleRefreshError(refreshError: any): Observable<any> {
    this.usuarioService.logout();
    this.router.navigateByUrl('/login');
    this.snackBarService.showMessage('Sessão expirada, faça login novamente!', true, 5000);
    return EMPTY;
  }

  private isImageRequest(url: string): boolean {
    return url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif') || url.endsWith('.ico') || url.endsWith('.webp');
  }
}
