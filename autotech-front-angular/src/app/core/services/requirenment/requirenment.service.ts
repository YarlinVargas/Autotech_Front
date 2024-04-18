import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Requirenment } from './models/requirenment';


@Injectable({
  providedIn: 'root'
})
export class RequirenmentService {

  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getRequerimientos(): Observable<Requirenment[]> {
    return this.http.get<Requirenment[]>(`${this.apiUrl}/requerimientos`);
  }

  getRequerimientoById(id: number): Observable<Requirenment> {
    return this.http.get<Requirenment>(`${this.apiUrl}/requerimientos/${id}`);
  }

  createNewRequerimiento(requirenment: Requirenment): Observable<Requirenment> {
    return this.http.post<Requirenment>(`${this.apiUrl}/requerimientos`, requirenment);
  }

  updateRequerimientoById(id: number, requirenment: Requirenment): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/requerimientos/${id}`, requirenment);
  }

  deleteRequerimientoById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/requerimientos/${id}`);
  }
}
