import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SnackBarService } from './snack-bar.service';
import { FiltroBusca } from '../interfaces/filtro-busca';
import { Observable, map, take } from 'rxjs';
import { CapitaesPaginado } from '../interfaces/capitao/capitaesPaginado';
import { Capitao } from '../interfaces/capitao/capitao';
import { Pagination } from '../interfaces/pagination';

@Injectable({
  providedIn: 'root'
})
export class CapitaoService {
  private apiCapitaoUrl = environment.apiCapitaoUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly snackBarService: SnackBarService
  ) { }

  getCapitaes(filtro: FiltroBusca): Observable<CapitaesPaginado> {
    let params = new HttpParams()
      .set('PageNumber', filtro.pageNumber.toString())
      .set('PageSize', filtro.pageSize.toString());
    if (filtro.term) params = params.set('Term', filtro.term);


    return this.http.get<Capitao[]>(`${this.apiCapitaoUrl}`, { observe: 'response', params }).pipe(
      take(1),
      map((response) => {
        var paginacao: Pagination = {} as Pagination;
        if (response.headers.has('Pagination')) {
          paginacao = JSON.parse(response.headers.get('Pagination')!);
        }
        return { capitães: response.body, ...paginacao } as CapitaesPaginado;
      })
    )
  }

  postCapitao(nome: string): Observable<Capitao> {
    const capitao: Capitao = {} as Capitao;
    capitao.nome = nome;

    return this.http.post<Capitao>(`${this.apiCapitaoUrl}`, capitao).pipe(
      take(1),
      map((response: any) => {
        return response;
      })
    );
  }

}
