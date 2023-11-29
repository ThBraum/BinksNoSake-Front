import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GerenciamentoUserService {
  private apiAdminAccountUrl = environment.apiAccountUrl;

  constructor(private readonly http: HttpClient) { }

  carregarUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiAdminAccountUrl}/${id}`).pipe(take(1));
  }
}
