import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUsuariosService } from '../../services/api-usuarios.service';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmarDialogComponent } from '../../components/modals/confirmar-dialog.component';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  isEdicao = false;

  constructor(
    private fb: FormBuilder,
    private apiUsuarios: ApiUsuariosService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      nomeMeio: [''],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      objetos: this.fb.array([])
    });
  }

  get objetos() {
    return this.usuarioForm.get('objetos') as FormArray;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      this.isEdicao = !!id;
      if (id) {
        this.apiUsuarios.getDados().subscribe(usuarios => {
          const usuario = usuarios.find((u: Usuario) => u.id == id);
          if (usuario) {
            this.usuarioForm.patchValue(usuario);
            // Preenche o FormArray de objetos, se houver
            this.objetos.clear();
            if (usuario.objetos && usuario.objetos.length) {
              usuario.objetos.forEach((obj: { nome: string; quantidade: number; nSerie: string }) => {
                this.objetos.push(this.fb.group({
                  nome: [obj.nome, Validators.required],
                  quantidade: [obj.quantidade, [Validators.required, Validators.min(1)]],
                  nSerie: [obj.nSerie, Validators.required]
                }));
              });
            }
          }
        });
      }
    });
  }

  adicionarObjeto() {
    this.objetos.push(this.fb.group({
      nome: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      nSerie: ['', Validators.required]
    }));
  }

  removerObjeto(index: number) {
    this.objetos.removeAt(index);
  }

  cadastrar() {
    if (this.usuarioForm.valid) {
      this.dialog.open(ConfirmarDialogComponent).afterClosed().subscribe(result => {
        if (result === true) {
          const id = this.route.snapshot.queryParamMap.get('id');
          if (id) {
            // Edição
            this.apiUsuarios.editar({ ...this.usuarioForm.value, id }).subscribe({
              next: () => {
                this.dialog.open(ConfirmarDialogComponent, {
                  data: {
                    sucesso: true,
                    mensagem: 'Usuário editado com sucesso!'
                  }
                }).afterClosed().subscribe(() => {
                  this.usuarioForm.reset();
                  this.markAllPristineUntouched(this.usuarioForm);
                  this.router.navigate(['/usuarios']);
                });
              },
              error: err => {
                this.dialog.open(ConfirmarDialogComponent, {
                  data: {
                    sucesso: false,
                    mensagem: err
                  }
                });
              }
            });
          } else {
            // Cadastro novo
            this.apiUsuarios.criar(this.usuarioForm.value).subscribe({
              next: () => {
                this.dialog.open(ConfirmarDialogComponent, {
                  data: {
                    sucesso: true,
                    mensagem: 'Usuário cadastrado com sucesso!'
                  }
                }).afterClosed().subscribe(() => {
                  this.usuarioForm.reset();
                  this.markAllPristineUntouched(this.usuarioForm);
                  this.router.navigate(['/usuarios']);
                });
              },
              error: err => {
                this.dialog.open(ConfirmarDialogComponent, {
                  data: {
                    sucesso: false,
                    mensagem: err
                  }
                });
              }
            });
          }
        }
      });
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }

  private markAllPristineUntouched(formGroup: FormGroup | FormArray) {
    formGroup.markAsPristine();
    formGroup.markAsUntouched();
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllPristineUntouched(control);
      } else {
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
  }
}
