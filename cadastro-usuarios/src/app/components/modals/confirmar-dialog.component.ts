import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmar-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <ng-container *ngIf="!data?.mensagem">
      <h2 mat-dialog-title>Confirmação</h2>
      <mat-dialog-content>Tem certeza que deseja cadastrar?</mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close="false">Cancelar</button>
        <button mat-raised-button color="primary" [mat-dialog-close]="true">Confirmar</button>
      </mat-dialog-actions>
    </ng-container>
    <ng-container *ngIf="data?.mensagem">
      <h2 mat-dialog-title>{{ data.sucesso ? 'Sucesso' : 'Erro' }}</h2>
      <mat-dialog-content>{{ data.mensagem }}</mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-raised-button color="primary" mat-dialog-close>OK</button>
      </mat-dialog-actions>
    </ng-container>
  `
})
export class ConfirmarDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}