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
      if (err.status === 409) {
        this.snackBarService.showMessage(err.error, true, 3500);
        return EMPTY;
      }
      if (err.status === 401) {
        this.usuarioService.refreshToken().subscribe({
          next: (response: any) => {
            if (response && response.token) {
              this.usuarioService.atualizarTokenAtual(response.token);
              retry(1);
            }
            return EMPTY;
          },
          error: (err: any) => {
            this.ctr = 0; // --------------------------- Temporário ---------------------------
            // this.usuarioService.getUser().subscribe({
            //   next: (usuario: Usuario) => {
            //     if (usuario && usuario.token) {
            //       this.usuarioService.atualizarTokenAtual(usuario.token!);
            //       retry(1);
            //     }
            //     return EMPTY;
            //   },
            //   error: (err: any) => {
            //     this.usuarioService.logout();
            //     this.router.navigateByUrl('/login');
            //     this.snackBarService.showMessage('Sessão expirada, faça login novamente!', true, 5000);
            //     return EMPTY;
            //   }
            // });
          }
        });
      } // --------------------------- Temporário ---------------------------
      // this.usuarioService.logout();
      // this.router.navigateByUrl('/login');
      // this.snackBarService.showMessage('Sessão expirada, faça login novamente!', true, 5000);
      // return EMPTY;
      // this.usuarioService.getUser().subscribe({
      //   next: (usuario: Usuario) => {
      //     if (usuario && usuario.token) {
      //       this.usuarioService.atualizarTokenAtual(usuario.token!);
      //       this.ctr = 0;
      //       retry(1);
      //     }
      //     return EMPTY;
      //   },
      //   error: (err: any) => {
      //     this.usuarioService.logout();
      //     this.router.navigateByUrl('/login');
      //     this.snackBarService.showMessage('Sessão expirada, faça login novamente!', true, 5000);
      //     return EMPTY;
      //   }
      // });
      // return EMPTY; --------------------------- Temporário ---------------------------
      // if (err.status !== 500) {
      //   this.usuarioService.logout();
      //   this.router.navigateByUrl('/login');
      //   this.snackBarService.showMessage('Sessão expirada, faça login novamente!', true, 5000);
      // }
      this.usuarioService.logout();
      this.router.navigateByUrl('/login');
      this.snackBarService.showMessage('Sessão expirada, faça login novamente!', true, 5000);
      return EMPTY;
    } else {
      // this.ctr = 0;
      return EMPTY;
    }
  }
}
