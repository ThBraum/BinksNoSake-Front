import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario/usuario';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { UsuarioUpdate } from '../interfaces/usuario/usuarioUpdate';
import { catchError, map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiAccountUrl = environment.apiAccountUrl;

  private currentUserSource: BehaviorSubject<Usuario | null> =
    new BehaviorSubject<Usuario | null>(
      localStorage.getItem('usuario') != null
        ? JSON.parse(localStorage.getItem('usuario')!)
        : null
    );
  public currentUser$ = this.currentUserSource.asObservable();

  private _tokenAtual: string | null = null;
  public get tokenAtual(): string | null {
    return this._tokenAtual;
  }

  private reautenticateTimeoutId?: any;

  constructor(
    private http: HttpClient,
    private readonly jwtHelperService: JwtHelperService,
    private readonly router: Router) {
  }

  login(model: any): Observable<any> {
    console.log("localStorage: ", localStorage);
    console.log("currentUserSource: ", this.currentUserSource);
    console.log("currentUserSource.value: ", this.currentUserSource.value);
    console.log("_tokenAtual: ", this._tokenAtual);
    console.log("reautenticateTimeoutId: ", this.reautenticateTimeoutId);

    return this.http.post<void>(`${this.apiAccountUrl}/login`, model);
  }

  getUser(): Observable<UsuarioUpdate> {
    return this.http.get<UsuarioUpdate>(this.apiAccountUrl + 'getUser').pipe(take(1));
  }

  register(model: any): Observable<void> {
    return this.http.post<Usuario>(this.apiAccountUrl + 'register', model).pipe(
      take(1),
      map((response: Usuario) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user)
        }
      })
    );
  }

  updateuser(model: UsuarioUpdate): Observable<any> {
    return this.http.put<any>(this.apiAccountUrl + 'updateuser', model).pipe(take(1),
      map((response: Usuario) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user)
        }
      })
    )
  }

  logout(): void {
    console.log("localStorage: ", localStorage);
    console.log("currentUserSource: ", this.currentUserSource);
    console.log("currentUserSource.value: ", this.currentUserSource.value);
    console.log("_tokenAtual: ", this._tokenAtual);
    console.log("reautenticateTimeoutId: ", this.reautenticateTimeoutId);

    localStorage.removeItem('usuario');
    this.currentUserSource.next(null);
    // localStorage.removeItem('token');
    // this._tokenAtual = null;
    this.currentUserSource.complete();
  }

  setCurrentUser(user: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

}
