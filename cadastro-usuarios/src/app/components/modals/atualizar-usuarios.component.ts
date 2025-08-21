import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-atualizar-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Editar Usuário</h2>
    <form [formGroup]="form" (ngSubmit)="salvar()">
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Nome*</mat-label>
        <input matInput formControlName="nome" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Nome do Meio</mat-label>
        <input matInput formControlName="nomeMeio" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Sobrenome*</mat-label>
        <input matInput formControlName="sobrenome" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Email*</mat-label>
        <input matInput formControlName="email" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>CEP*</mat-label>
        <input matInput formControlName="cep" />
      </mat-form-field>
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>CPF*</mat-label>
        <input matInput formControlName="cpf" />
      </mat-form-field>
      <!-- Objetos pode ser adicionado aqui se desejar -->
      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="fechar()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Salvar</button>
      </div>
    </form>
  `
})
export class AtualizarUsuariosComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AtualizarUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario
  ) {
    this.form = this.fb.group({
      nome: [data.nome, Validators.required],
      nomeMeio: [data.nomeMeio],
      sobrenome: [data.sobrenome, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      cep: [data.cep, [Validators.required, Validators.pattern(/^\d{8}$/)]],
      cpf: [data.cpf, [Validators.required, Validators.pattern(/^\d{11}$/)]],
      // objetos: this.fb.array([]) // Adapte se quiser editar objetos também
    });
  }

  salvar() {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.data, ...this.form.value });
    }
  }

  fechar() {
    this.dialogRef.close();
  }
}