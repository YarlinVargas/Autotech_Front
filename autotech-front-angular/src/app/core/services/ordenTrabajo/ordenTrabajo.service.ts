import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenTrabajoModel } from '../../models/orden-trabajo/orden-trabajo.model';

export interface TipoOrdenModel {
  id_tipo_orden: number;
  descripcion:string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdenTrabajoService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getOrdenesTrabajo(): Observable<OrdenTrabajoModel[]> {
    return this.http.get<OrdenTrabajoModel[]>(`${this.apiUrl}/ordenes-trabajo`);
  }

  getOrdenTrabajoById(id: number): Observable<OrdenTrabajoModel> {
    return this.http.get<OrdenTrabajoModel>(`${this.apiUrl}/ordenes-trabajo/${id}`);
  }

  createNewOrdenTrabajo(orden: OrdenTrabajoModel): Observable<OrdenTrabajoModel> {
    return this.http.post<OrdenTrabajoModel>(`${this.apiUrl}/ordenes-trabajo`, orden);
  }

  updateOrdenTrabajoById(id: number, orden: OrdenTrabajoModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/ordenes-trabajo/${id}`, orden);
  }

  deleteOrdenTrabajoById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ordenes-trabajo/${id}`);
  }
}

