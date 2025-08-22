import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUsuariosService } from '../../services/api-usuarios.service';
import { Usuario } from '../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmarDialogComponent } from '../../components/modals/confirmar-dialog.component';
import { FormControl } from '@angular/forms';
import { CepService } from '../../services/cep.service';
import { TypebotComponent } from '../../components/bots/typebot.component';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    TypebotComponent
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  isEdicao = false;
  tiposProdutosLista = ['Monitor', 'Notebook', 'Teclado', 'Mouse'];

  constructor(
    private fb: FormBuilder,
    private apiUsuarios: ApiUsuariosService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private cepService: CepService
  ) {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      nomeMeio: [''],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      objetos: this.fb.array([]),
      endereco: [''],
      cidadeEstado: ['']
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
            this.objetos.clear();
            if (usuario.objetos && usuario.objetos.length) {
              usuario.objetos.forEach((obj: any) => {
                const nSerieArray = this.fb.array([]);
                if (obj.nSerie && Array.isArray(obj.nSerie)) {
                  obj.nSerie.forEach((serie: string) => {
                    nSerieArray.push(this.fb.control(serie, Validators.required));
                  });
                } else {
                  nSerieArray.push(this.fb.control('', Validators.required));
                }
                const objGroup = this.fb.group({
                  tipoProduto: [obj.tipoProduto, Validators.required],
                  quantidade: [obj.quantidade, [Validators.required, Validators.min(1)]],
                  nSerie: nSerieArray
                });
                this.objetos.push(objGroup);
              });
            }
          }
        });
      }
    });
  }

  adicionarObjeto() {
    const objGroup = this.fb.group({
      tipoProduto: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      nSerie: this.fb.array([this.fb.control('', Validators.required)])
    });
    this.objetos.push(objGroup);
  }

  removerObjeto(index: number) {
    this.objetos.removeAt(index);
  }

  atualizarNumerosSerie(i: number) {
    const objGroup = this.objetos.at(i) as FormGroup;
    const quantidade = objGroup.get('quantidade')?.value || 1;
    const nSerieArray = objGroup.get('nSerie') as FormArray;

    // Adiciona ou remove controles para igualar à quantidade
    while (nSerieArray.length < quantidade) {
      nSerieArray.push(this.fb.control('', Validators.required));
    }
    while (nSerieArray.length > quantidade) {
      nSerieArray.removeAt(nSerieArray.length - 1);
    }
  }

  getNumerosSerie(obj: AbstractControl): FormControl[] {
    return (obj.get('nSerie') as FormArray).controls as FormControl[];
  }

  getNSerieControls(obj: AbstractControl) {
    return (obj.get('nSerie') as FormArray).controls as FormControl[];
  }

  getNSerieRows(nSerieControls: FormControl[]) {
    const rows = [];
    for (let i = 0; i < nSerieControls.length; i += 3) {
      // Retorna apenas os índices
      rows.push(Array.from({length: Math.min(3, nSerieControls.length - i)}, (_, idx) => i + idx));
    }
    return rows;
  }

  cadastrar() {
    if (this.usuarioForm.valid) {
      const objetosParaSalvar = this.objetos.controls.map(control => {
        const objGroup = control as FormGroup;
        return {
          tipoProduto: objGroup.get('tipoProduto')?.value,
          quantidade: objGroup.get('quantidade')?.value,
          nSerie: (objGroup.get('nSerie') as FormArray).value
        };
      });

      const usuarioParaSalvar = {
        ...this.usuarioForm.value,
        objetos: objetosParaSalvar
      };

      this.dialog.open(ConfirmarDialogComponent).afterClosed().subscribe(result => {
        if (result === true) {
          if (this.isEdicao) {
            const id = this.route.snapshot.queryParamMap.get('id');
            this.apiUsuarios.editar({ ...usuarioParaSalvar, id }).subscribe({
              next: () => {
                this.dialog.open(ConfirmarDialogComponent, {
                  data: {
                    sucesso: true,
                    mensagem: 'Usuário atualizado com sucesso!'
                  }
                }).afterClosed().subscribe(() => {
                  this.usuarioForm.reset();
                  this.objetos.clear();
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
            this.apiUsuarios.criar(usuarioParaSalvar).subscribe({
              next: () => {
                this.dialog.open(ConfirmarDialogComponent, {
                  data: {
                    sucesso: true,
                    mensagem: 'Usuário cadastrado com sucesso!'
                  }
                }).afterClosed().subscribe(() => {
                  this.usuarioForm.reset();
                  this.objetos.clear();
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

  onCepChange() {
    const cep = this.usuarioForm.get('cep')?.value;
    if (cep && cep.length === 8) {
      this.cepService.buscarCep(cep).subscribe((data: any) => {
        if (data) {
          this.usuarioForm.patchValue({
            endereco: data.logradouro || '',
            cidadeEstado: `${data.localidade || ''} / ${data.uf || ''}`
          });
        }
      });
    }
  }
}
