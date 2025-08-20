import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header style="padding:16px; border-bottom:1px solid #eee; display:flex; gap:12px; align-items:center;">
      <h1 style="margin:0; font-size:18px;">Gerenciamento de usuários</h1>
      <nav style="display:flex; gap:8px;">
        <a routerLink="/cadastro" routerLinkActive="active">Cadastro</a>
        <a routerLink="/usuarios" routerLinkActive="active">Listagem</a>
      </nav>
    </header>
    <main style="padding:16px;">
      <router-outlet />
    </main>
  `,
  styles: [`
    a { text-decoration:none; padding:6px 10px; border-radius:8px; }
    a.active { background:#f0f0f0; }
  `]
})
export class AppComponent {}