import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoOrdenModel {
  id_tipo_orden: number;
  descripcion:string;
}

@Injectable({
  providedIn: 'root'
})
export class TipoOrdenTrabajoService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getTiposOrden(): Observable<TipoOrdenModel[]> {
    return this.http.get<TipoOrdenModel[]>(`${this.apiUrl}/tipos-orden`);
  }

  getTipoOrdenById(id: number): Observable<TipoOrdenModel> {
    return this.http.get<TipoOrdenModel>(`${this.apiUrl}/tipos-orden/${id}`);
  }

  createNewTipoOrden(tipoOrden: TipoOrdenModel): Observable<TipoOrdenModel> {
    return this.http.post<TipoOrdenModel>(`${this.apiUrl}/tipos-orden`, tipoOrden);
  }

  updateTipoOrdenById(id: number, tipoOrden: TipoOrdenModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/tipos-orden/${id}`, tipoOrden);
  }

  deleteTipoOrdenById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tipos-orden/${id}`);
  }
}
