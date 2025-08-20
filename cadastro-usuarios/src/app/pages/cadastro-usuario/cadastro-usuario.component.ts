import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent {
  usuarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
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
      this.http.post('http://localhost:3000/usuarios', this.usuarioForm.value)
        .subscribe(() => {
          alert('Usuário cadastrado com sucesso!');
          this.router.navigate(['/usuarios']);
        });
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }
}
