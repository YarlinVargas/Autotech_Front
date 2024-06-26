import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { FiltroReport, ReportProductoModel, ReportVehiculoModel } from '../../models/report/report.model';



@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }


  //CONSULTAR TODOS LOS PRODUCTOS SIN STOCK
  getProductosSinStock(): Observable<ReportProductoModel[]> {
    return this.http.get<ReportProductoModel[]>(`${this.apiUrl}/reportes/getProductosSinStock`);
  }

  //CONSULTAR HISTORIAL DE VEHICULOS POR PLACA Y FECHA
  getHistorialVehiculoxPlacaxFechas(placa:String,fechainicial:String, fechafin:string): Observable<ReportVehiculoModel[]> {
    const data = {
      placa: placa,
      fecha_inicio: fechainicial,
      fecha_fin: fechafin
    };
    return this.http.post<ReportVehiculoModel[]>(`${this.apiUrl}/reportes/getHistorialVehiculoxPlacaxFechas`,data);
  }
}
