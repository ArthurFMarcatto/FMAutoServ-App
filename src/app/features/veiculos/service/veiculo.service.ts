import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Veiculo } from '../models/veiculo.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8080/api/veiculo';

  findAll(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(this.api);
  }

  findById(id: number): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${this.api}/${id}`);
  }

  create(veiculo: Veiculo): Observable<Veiculo> {
    return this.http.post<Veiculo>(this.api, veiculo);
  }

  update(id: number, veiculo: Veiculo): Observable<Veiculo> {
    return this.http.put<Veiculo>(`${this.api}/${id}`, veiculo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}