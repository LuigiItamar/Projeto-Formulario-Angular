import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiUsuariosService } from '../../services/api-usuarios.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Papa } from 'ngx-papaparse';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listagem-usuarios',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './listagem-usuarios.component.html',
  styleUrls: ['./listagem-usuarios.component.css']
})
export class ListagemUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  selecionados: string[] = []; // IDs dos usuários selecionados

  constructor(
    private apiUsuarios: ApiUsuariosService,
    private router: Router,
    private papa: Papa
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
    if (usuario.id && confirm(`Deseja realmente excluir o usuário ${usuario.nome}?`)) {
      this.apiUsuarios.excluir(usuario.id.toString()).subscribe({
        next: () => this.carregarUsuarios(),
        error: err => alert('Erro ao excluir usuário: ' + err)
      });
    }
  }

  editarUsuario(usuario: Usuario) {
    this.router.navigate(['/cadastro'], { queryParams: { id: usuario.id } });
  }

  exportarCSV() {
    const header = ['Nome', 'Email', 'CPF', 'Objetos'];
    const rows = this.usuarios.map(u => [
      `${u.nome} ${u.nomeMeio} ${u.sobrenome}`.trim(),
      u.email,
      u.cpf,
      u.objetos.map(obj =>
        `${obj.tipoProduto} (${obj.quantidade}): ${obj.nSerie.join(', ')}`
      ).join('\n')
    ]);
    const csvContent = this.papa.unparse([header, ...rows], {
      quotes: true,
      delimiter: ";",
      newline: "\r\n"
    });
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  importarCSV(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result as string;
      this.papa.parse(text, {
        delimiter: ";",
        skipEmptyLines: true,
        complete: (result: any) => {
          const data = result.data as string[][];
          const [header, ...rows] = data;
          const expectedHeader = ['Nome', 'Email', 'CPF', 'Objetos'];
          if (!header || header.length < 4 || !expectedHeader.every((h, i) => header[i]?.trim() === h)) {
            alert('Erro: O padrão da planilha está incorreto. Exporte um modelo e mantenha o padrão de colunas.');
            return;
          }
          const usuariosImportados = rows
            .filter((row: string[]) => row.length >= 3)
            .map((row: string[]) => {
              const [nome, nomeMeio, ...sobrenomeArr] = (row[0] || '').split(' ');
              return {
                nome: nome || '',
                nomeMeio: nomeMeio || '',
                sobrenome: sobrenomeArr.join(' ') || '',
                email: row[1] || '',
                cpf: row[2] || '',
                objetos: (row[3] || '').split('\n').filter(Boolean).map(objStr => {
                  const tipoProdutoMatch = objStr.match(/^(.+?) \((\d+)\): (.+)$/);
                  if (tipoProdutoMatch) {
                    return {
                      tipoProduto: tipoProdutoMatch[1],
                      quantidade: Number(tipoProdutoMatch[2]),
                      nSerie: tipoProdutoMatch[3].split(',').map(s => s.trim())
                    };
                  }
                  return null;
                }).filter(Boolean)
              };
            }) as Usuario[];

          // Buscar usuários já cadastrados
          this.apiUsuarios.listar().subscribe({
            next: (usuariosExistentes) => {
              const conflitos: Usuario[] = [];
              const novosUsuarios: Usuario[] = [];

              usuariosImportados.forEach(importado => {
                const existe = usuariosExistentes.some(
                  existente => existente.cpf === importado.cpf
                );
                if (existe) {
                  conflitos.push(importado);
                } else {
                  novosUsuarios.push(importado);
                }
              });

              if (conflitos.length > 0) {
                alert(
                  'Os seguintes usuários já existem e não foram cadastrados:\n\n' +
                  conflitos.map(u => `${u.nome} ${u.nomeMeio} ${u.sobrenome} (CPF: ${u.cpf})`).join('\n')
                );
              }

              if (novosUsuarios.length > 0) {
                this.apiUsuarios.cadastrarEmMassa(novosUsuarios).subscribe({
                  next: () => this.carregarUsuarios(),
                  error: err => alert('Erro ao salvar usuários importados: ' + err)
                });
              } else {
                this.carregarUsuarios();
              }
            },
            error: err => alert('Erro ao buscar usuários existentes: ' + err)
          });
        }
      });
    };
    reader.readAsText(file);
  }

  toggleSelecionado(id: string, checked: boolean) {
    if (!id) return;
    if (checked) {
      if (!this.selecionados.includes(id)) {
        this.selecionados.push(id);
      }
    } else {
      this.selecionados = this.selecionados.filter(sid => sid !== id);
    }
  }

  selecionarTodos(checked: boolean) {
    if (checked) {
      this.selecionados = this.usuarios
        .filter(u => !!u.id)
        .map(u => u.id!.toString());
    } else {
      this.selecionados = [];
    }
  }

  excluirUsuariosSelecionados() {
    if (this.selecionados.length === 0) {
      alert('Selecione pelo menos um usuário para excluir.');
      return;
    }
    if (confirm('Deseja realmente excluir os usuários selecionados?')) {
      const reqs = this.selecionados.map(id => this.apiUsuarios.excluir(id));
      forkJoin(reqs).subscribe({
        next: () => {
          this.selecionados = [];
          this.carregarUsuarios();
        },
        error: err => alert('Erro ao excluir usuários: ' + err)
      });
    }
  }

  get todosSelecionados(): boolean {
    const totalValidos = this.usuarios.filter(u => !!u.id).length;
    return this.selecionados.length === totalValidos && totalValidos > 0;
  }
}
