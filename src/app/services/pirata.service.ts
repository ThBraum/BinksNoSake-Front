import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map, take, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pirata } from '../interfaces/pirata/pirata';
import { PiratasPaginado } from '../interfaces/pirata/piratasPaginado';
import { SnackBarService } from './snack-bar.service';
import { FiltroBusca } from '../interfaces/filtro-busca';
import { Pagination } from '../interfaces/pagination';

@Injectable({
  providedIn: 'root'
})
export class PirataService {
  private apiPirataUrl = environment.apiPirataUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly snackBarService: SnackBarService) { }

  getPiratas(filtro: FiltroBusca): Observable<PiratasPaginado> {
    let params = new HttpParams()
      .set('PageNumber', filtro.pageNumber.toString())
      .set('PageSize', filtro.pageSize.toString());
    if (filtro.term) params = params.set('Term', filtro.term);

    if (filtro.sort?.active) {
      params = params.set('OrderBy', filtro.sort.active);
      params = params.set('SortDirection', filtro.sort.direction);
    }

    return this.http.get<Pirata[]>(`${this.apiPirataUrl}`, { observe: 'response', params }).pipe(
      take(1),
      map((response) => {
        var paginacao: Pagination = {} as Pagination;
        if (response.headers.has('Pagination')) {
          paginacao = JSON.parse(response.headers.get('Pagination')!);
        }
        return { piratas: response.body, ...paginacao } as PiratasPaginado;
      }));
  }

  getPirataById(id: number): Observable<Pirata> {
    return this.http.get<Pirata>(`${this.apiPirataUrl}/${id}`);
  }

  postPirata(pirata: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiPirataUrl}`, pirata).pipe(
      take(1),
      map((response: any) => {
        this.snackBarService.showMessage("Pirata criado com sucesso.");
        return response;
      }),
      catchError((error) => {
        this.snackBarService.showMessage("Erro ao criar pirata.", true);
        return throwError(error);
      })
    );
  }

  putPirata(pirata: Pirata, id: number): Observable<Pirata> {
    return this.http.put<Pirata>(`${this.apiPirataUrl}/${id}`, pirata);
  }

  deletePirata(id: number): Observable<Pirata> {
    return this.http.delete<Pirata>(`${this.apiPirataUrl}/${id}`);
  }
}
