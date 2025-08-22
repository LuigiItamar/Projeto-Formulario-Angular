import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class ApiUsuariosService {
  private baseUrl = 'http://localhost:3000/usuarios'; // URL da API JSON Server

  constructor(private http: HttpClient) { }

  // Listar todos os usuários
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Criar (cadastrar) um usuário
  criar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario).pipe(
      catchError(this.handleError)
    );
  }

  // Método genérico para GET (caso queira usar em outros lugares)
  getDados(): Observable<any> {
    return this.http.get(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  //Editar um usuário
  editar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${usuario.id}`, usuario).pipe(
      catchError(this.handleError)
    );
  }

  //excluir um usuario
  excluir(id: number | string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Importar usuários em massa
  importarEmMassa(usuarios: Usuario[]): Observable<any> {
    // Remove todos e adiciona os novos (para json-server)
    return this.http.get<Usuario[]>(this.baseUrl).pipe(
      switchMap(existing =>
        forkJoin(existing.map(u => this.http.delete(`${this.baseUrl}/${u.id}`)))
      ),
      switchMap(() =>
        forkJoin(usuarios.map(u => this.http.post(this.baseUrl, u)))
      )
    );
  }

  // Tratamento de erros HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.status === 0) {
      errorMessage = 'Não foi possível conectar ao servidor. O banco de dados pode estar fora do ar.';
    } else if (error.status === 404) {
      errorMessage = 'Dados não encontrados.';
    } else if (error.status === 500) {
      errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    return throwError(() => errorMessage);
  }
}
