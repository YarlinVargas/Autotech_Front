import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrdenTrabajo {
  id: number;
  descripcion:string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdenTrabajoService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getOrdenesTrabajo(): Observable<OrdenTrabajo[]> {
    return this.http.get<OrdenTrabajo[]>(`${this.apiUrl}/ordenes-trabajo`);
  }

  getOrdenTrabajoById(id: number): Observable<OrdenTrabajo> {
    return this.http.get<OrdenTrabajo>(`${this.apiUrl}/ordenes-trabajo/${id}`);
  }

  createNewOrdenTrabajo(orden: OrdenTrabajo): Observable<OrdenTrabajo> {
    return this.http.post<OrdenTrabajo>(`${this.apiUrl}/ordenes-trabajo`, orden);
  }

  updateOrdenTrabajoById(id: number, orden: OrdenTrabajo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/ordenes-trabajo/${id}`, orden);
  }

  deleteOrdenTrabajoById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ordenes-trabajo/${id}`);
  }
}

