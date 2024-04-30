import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recordatorio {
  id_recordatorio: number;
  fecha:string;
  id_cliente: number;
  id_usuario:number;
  eliminado:number;
}
export interface RecordatorioModule {
  id_recordatorio: number;
  fecha:string;
  nombre: string;
  email:string;
}

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getRecordatorios(): Observable<Recordatorio[]> {
    return this.http.get<Recordatorio[]>(`${this.apiUrl}/recordatorios`);
  }

  getRecordatorioById(id: number): Observable<Recordatorio> {
    return this.http.get<Recordatorio>(`${this.apiUrl}/recordatorios/${id}`);
  }

  createNewRecordatorio(recordatorio: Recordatorio): Observable<Recordatorio> {
    return this.http.post<Recordatorio>(`${this.apiUrl}/recordatorios`, recordatorio);
  }

  updateRecordatorioById(id: number, recordatorio: Recordatorio): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/recordatorios/${id}`, recordatorio);
  }

  deleteRecordatorioById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recordatorios/${id}`);
  }
}
