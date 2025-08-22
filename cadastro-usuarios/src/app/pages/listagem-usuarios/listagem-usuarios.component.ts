import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiUsuariosService } from '../../services/api-usuarios.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-listagem-usuarios',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './listagem-usuarios.component.html',
  styleUrls: ['./listagem-usuarios.component.css']
})
export class ListagemUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
    private apiUsuarios: ApiUsuariosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.apiUsuarios.listar().subscribe({
      next: data => this.usuarios = data,
      error: err => {
        alert('Erro ao carregar usuários: ' + err);
      }
    });
  }

  excluirUsuario(usuario: Usuario) {
    if (confirm(`Deseja realmente excluir o usuário ${usuario.nome}?`)) {
      this.apiUsuarios.excluir(usuario.id!).subscribe({
        next: () => this.carregarUsuarios(),
        error: err => alert('Erro ao excluir usuário: ' + err)
      });
    }
  }

  editarUsuario(usuario: Usuario) {
    this.router.navigate(['/cadastro'], { queryParams: { id: usuario.id } });
  }
}
