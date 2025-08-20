import { Routes } from '@angular/router';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { ListagemUsuariosComponent } from './pages/listagem-usuarios/listagem-usuarios.component';

export const routes: Routes = [
    { path: '', redirectTo: 'cadastro', pathMatch: 'full' },
    { path: 'cadastro', component: CadastroUsuarioComponent },
    { path: 'usuarios', component: ListagemUsuariosComponent },
    { path: '**', redirectTo: 'cadastro' }
];
