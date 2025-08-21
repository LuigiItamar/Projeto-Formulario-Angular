import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiUsuariosService } from '../../services/api-usuarios.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AtualizarUsuariosComponent } from '../../components/modals/atualizar-usuarios.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listagem-usuarios',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCheckboxModule, FormsModule],
  templateUrl: './listagem-usuarios.component.html',
  styleUrls: ['./listagem-usuarios.component.css']
})
export class ListagemUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  selecionarTodos = false;

  constructor(
    private apiUsuarios: ApiUsuariosService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.apiUsuarios.listar().subscribe({
      next: data => this.usuarios = data,
      error: err => {
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

  toggleTodos() {
    this.usuarios.forEach(u => u.selecionado = this.selecionarTodos);
  }

  abrirEditarMuitos() {
    const selecionados = this.usuarios.filter(u => u.selecionado);
    if (selecionados.length === 0) {
      alert('Selecione pelo menos um usuário para editar.');
      return;
    }
    this.dialog.open(AtualizarUsuariosComponent, {
      data: selecionados
    }).afterClosed().subscribe(result => {
      if (result) {
        // Aqui você pode implementar a lógica de atualização em massa
        // Exemplo: this.apiUsuarios.editarMuitos(result).subscribe(...)
      }
    });
  }
}
