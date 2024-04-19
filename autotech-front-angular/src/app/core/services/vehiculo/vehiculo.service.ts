import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehiculoModel } from '../../models/vehiculo/vehiculo.model';


@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getVehiculos(): Observable<VehiculoModel[]> {
    return this.http.get<VehiculoModel[]>(`${this.apiUrl}/vehiculos`);
  }

  getVehiculoById(id: number): Observable<VehiculoModel> {
    return this.http.get<VehiculoModel>(`${this.apiUrl}/vehiculos/${id}`);
  }

  createNewVehiculo(vehiculo: VehiculoModel): Observable<VehiculoModel> {
    return this.http.post<VehiculoModel>(`${this.apiUrl}/vehiculos`, vehiculo);
  }

  updateVehiculoById(id: number, vehiculo: VehiculoModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/vehiculos/${id}`, vehiculo);
  }

  deleteVehiculoById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vehiculos/${id}`);
  }

}
