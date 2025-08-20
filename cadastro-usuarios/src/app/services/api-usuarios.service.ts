import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class ApiUsuariosService {
  private baseUrl = 'http://localhost:3000/usuarios'; // URL da API JSON Server

  constructor(private http: HttpClient) {}

  // Listar todos os usuários
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  // Criar (cadastrar) um usuário
  criar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }
}
