import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pirata } from '../interfaces/pirata/pirata';
import { PiratasPaginado } from '../interfaces/pirata/piratasPaginado';
import { SnackBarService } from './snack-bar.service';
import { FiltroBuscaPiratas } from '../interfaces/pirata/filtro-busca-piratas';
import { Pagination } from '../interfaces/pagination';

@Injectable({
  providedIn: 'root'
})
export class PirataService {
  private apiPirataUrl = environment.apiPirataUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly snackBarService: SnackBarService) { }

  getPiratas(filtro: FiltroBuscaPiratas): Observable<PiratasPaginado> {
    let params = new HttpParams()
      .set('PageNumber', filtro.PageNumber.toString())
      .set('PageSize', filtro.PageSize.toString());
    if (filtro.term) params = params.set('Term', filtro.term);

    return this.http.get<Pirata[]>(`${this.apiPirataUrl}`, { observe: 'response',  params }).pipe(
      take(1),
      map((response) => {
        var paginacao: Pagination = {} as Pagination;
        if(response.headers.has('Pagination')) {
          paginacao = JSON.parse(response.headers.get('Pagination')!);
        }
        return { piratas: response.body, ...paginacao } as PiratasPaginado;
      }));
  }

  getPirataById(id: number): Observable<Pirata> {
    return this.http.get<Pirata>(`${this.apiPirataUrl}/${id}`);
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
