import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id_cliente: number;
  nombres:string;
  apellidos: string;
  Direccion: string;
  telefono:string;
  email: string;
  documento_identidad: string;
  fecha_nacimiento:String;
  id_estado:number;
}


export interface ClienteReq {
  id_cliente: number;
  nombres:string;
  apellidos: string;
  direccion: string;
  telefono:string;
  email: string;
  documento_identidad: string;
  fecha_nacimiento:String;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {

    private readonly apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    getClientes(): Observable<Cliente[]> {
      return this.http.get<Cliente[]>(`${this.apiUrl}/clientes`);
    }

    getClienteById(id: number): Observable<Cliente> {
      return this.http.get<Cliente>(`${this.apiUrl}/clientes/${id}`);
    }

    createNewCliente(client: Cliente): Observable<Cliente> {
      return this.http.post<Cliente>(`${this.apiUrl}/clientes`, client);
    }

    updateClienteById(id: number, client: Cliente): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/clientes/${id}`, client);
    }

    deleteClienteById(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/clientes/${id}`);
    }

}
