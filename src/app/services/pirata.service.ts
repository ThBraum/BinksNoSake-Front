import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pirata } from '../interfaces/pirata/Pirata';

@Injectable({
  providedIn: 'root'
})
export class PirataService {
  private apiPirataUrl = environment.apiPirataUrl;

  constructor(private readonly http: HttpClient) { }

  getPiratas(): Observable<Pirata> {
    return this.http.get<Pirata>(`${this.apiPirataUrl}`);
  }

  getPirataById(id: number): Observable<Pirata> {
    return this.http.get<Pirata>(`${this.apiPirataUrl}/${id}`);
  }

  getPirataByNome(nome: string): Observable<Pirata> {
    return this.http.get<Pirata>(`${this.apiPirataUrl}/nome/${nome}`);
  }

  postPirata(pirata: Pirata): Observable<Pirata> {
    return this.http.post<Pirata>(`${this.apiPirataUrl}`, pirata);
  }

  putPirata(pirata: Pirata, id: number): Observable<Pirata> {
    return this.http.put<Pirata>(`${this.apiPirataUrl}/${id}`, pirata);
  }

  deletePirata(id: number): Observable<Pirata> {
    return this.http.delete<Pirata>(`${this.apiPirataUrl}/${id}`);
  }
}
