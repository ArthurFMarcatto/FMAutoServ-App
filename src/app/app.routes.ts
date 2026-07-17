import { Routes } from '@angular/router';
import { ClienteListComponent } from './features/clientes/pages/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './features/clientes/pages/cliente-form/cliente-form.component';
import { ClienteDetailComponent } from './features/clientes/pages/cliente-detail/cliente-detail.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'FM - Mecanica 40 - Tela Inicial' },
  { path: 'home', redirectTo: '', pathMatch: 'full' },

  { path: 'clientes', component: ClienteListComponent, title: 'FM - Mecanica 40 - Clientes' },
  { path: 'clientes/novo', component: ClienteFormComponent, title: 'FM - Mecanica 40 - Novo Cliente' },
  { path: 'clientes/:id', component: ClienteDetailComponent, title: 'FM - Mecanica 40 - Detalhes do Cliente' },
  { path: 'clientes/:id/editar', component: ClienteFormComponent, title: 'FM - Mecanica 40 - Editar Cliente' },
  { path: 'veiculos', component: ClienteListComponent, title: 'FM - Mecanica 40 - Clientes' },
  { path: 'veiculos/novo', component: ClienteFormComponent, title: 'FM - Mecanica 40 - Novo Cliente' },
  { path: 'veiculos/:id', component: ClienteDetailComponent, title: 'FM - Mecanica 40 - Detalhes do Cliente' },
  { path: 'veiculos/:id/editar', component: ClienteFormComponent, title: 'FM - Mecanica 40 - Editar Cliente' }

];