import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario/usuario';
import { BehaviorSubject, ReplaySubject, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { UsuarioUpdate } from '../interfaces/usuario/usuarioUpdate';
import { catchError, map, take, tap } from 'rxjs/operators';
import { RefreshTokens } from '../interfaces/usuario/refreshTokens';
import { SnackBarService } from './snack-bar.service';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiAccountUrl = environment.apiAccountUrl;
  private apiAcessoUrl = environment.apiAcessoUrl;

  private currentUserSource: BehaviorSubject<Usuario | null> =
    new BehaviorSubject<Usuario | null>(
      localStorage.getItem('usuario') != null
        ? JSON.parse(localStorage.getItem('usuario')!)
        : null
    );
  public currentUser$ = this.currentUserSource.asObservable();

  private loginEventSource = new BehaviorSubject<Usuario | null>(null);
  loginEvent = this.loginEventSource.asObservable();

  private _tokenAtual: string | null = null;
  public get tokenAtual(): string | null {
    return this._tokenAtual;
  }

  private reautenticateTimeoutId?: any;

  constructor(
    private http: HttpClient,
    private readonly jwtHelperService: JwtHelperService,
    private readonly router: Router,
    private snackBarService: SnackBarService,
    private afAuth: AngularFireAuth,) {
    const token = localStorage.getItem('token');
    this._tokenAtual = token;
  }

  login(model: any): Observable<any> {
    return this.http.post<Usuario>(`${this.apiAcessoUrl}/login`, model).pipe(
      take(1),
      map((response: Usuario) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user),
            this.atualizarTokenAtual(user.token!);
          this.emitLoginEvent();
          this.snackBarService.showMessage("Login efetuado com sucesso!", false, 1500);
        }
      }),
    );
  }

  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider()).then((result: any) => {
      this.exchangeFirebaseTokenForApiToken(result.user).subscribe((response: any) => {
      })
    });
  }

  authLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider).then((result) => {
      return result;
    }).catch((error) => {
      console.log("error authlogin: ", error)
    });
  }

  exchangeFirebaseTokenForApiToken(firebaseToken: any): Observable<any> {
    var firebaseToken = firebaseToken ? firebaseToken._delegate.accessToken : null;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiAcessoUrl}/LoginWithGoogle`, { firebaseToken: JSON.stringify(firebaseToken) }, { headers }).pipe(
      take(1),
      map((response: any) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user),
            this.atualizarTokenAtual(user.token!);
          this.emitLoginEvent();
          this.snackBarService.showMessage("Login efetuado com sucesso!", false, 1500);
          this.router.navigateByUrl('/pirata');
        }
      }),
    );
  }

  emitLoginEvent(): void {
    const currentUser = this.currentUserSource.value;
    this.loginEventSource.next(currentUser);
  }

  getUser(): Observable<Usuario> {
    return this.http.get<Usuario>(this.apiAccountUrl + '/getUser').pipe(take(1));
  }

  setUser(user: Usuario | null): void {
    this.currentUserSource.next(user);
  }

  setCurrentUser(user: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.emitLoginEvent();
  }

  register(model: any): Observable<void> {
    return this.http.post<Usuario>(this.apiAccountUrl + '/register', model).pipe(
      take(1),
      map((response: Usuario) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user)
        }
      })
    );
  }

  updateUser(userData: FormData): Observable<any> {
    return this.http.put<any>(this.apiAccountUrl + '/update', userData).pipe(
      take(1),
      map((response: Usuario) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user)
        }
      })
    );
  }

  logout(navegadorHome: boolean = true): void {
    localStorage.removeItem('usuario');
    this.currentUserSource.next(null);

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this._tokenAtual = null;

    clearTimeout(this.reautenticateTimeoutId);

    this.currentUserSource.complete();
    this.emitLoginEvent();
    window.location.reload();

    if (navegadorHome) this.router.navigateByUrl('/pirata');
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(this.apiAcessoUrl + '/refreshToken', null).pipe(
      take(1),
      catchError(error => {
        this.logout();
        this.snackBarService.showMessage("Erro ao validar usuário. Faça login novamente para continuar.", true);
        return throwError(() => error);
      }),
      map((response) => {
        if (response && response.token) {
          this.atualizarTokenAtual(response.token);
          this.snackBarService.showMessage("Repita sua última ação.", false);
          return response;
        }
      })
    );
  }

  atualizarTokenAtual(token: string) {
    if (token) {
      localStorage.setItem('token', token);
      this._tokenAtual = token;
    }
  }

  private notificarAtualizacaoUsuarioAtual(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.currentUserSource.next(usuario);
  }
}
