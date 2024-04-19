import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenTrabajoModel } from '../../models/orden-trabajo/orden-trabajo.model';

export interface SoporteModel {
  id_soporte: number;
  fecha: Date;
  id_cliente: number;
  id_usuario: number;
  id_estado: number;
  descripcion_soporte:string;
}

@Injectable({
  providedIn: 'root'
})
export class SoporteService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getSoportes(): Observable<SoporteModel[]> {
    return this.http.get<SoporteModel[]>(`${this.apiUrl}/soportes`);
  }

  getSoporteById(id: number): Observable<SoporteModel> {
    return this.http.get<SoporteModel>(`${this.apiUrl}/soportes/${id}`);
  }

  createNewSoporte(soporte: SoporteModel): Observable<SoporteModel> {
    return this.http.post<SoporteModel>(`${this.apiUrl}/soportes`, soporte);
  }

  updateSoporteById(id: number, soporte: SoporteModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/soportes/${id}`, soporte);
  }

  deleteSoporteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/soportes/${id}`);
  }
}
