import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/core/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { PirataDetalhesComponent } from './components/piratas/pirata-detalhes/pirata-detalhes.component';
import { UsuarioResolver } from './resolvers/usuario.resolver';
import { PirataListaComponent } from './components/piratas/pirata-lista/pirata-lista.component';
import { pirataListaResolver } from './resolvers/pirata-lista.resolver';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'user',
    loadChildren: () =>
      import('./modules/user/user.module').then(m => m.UserModule),
    resolve: {
      usuario: UsuarioResolver,
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'pirata',
    component: PirataListaComponent,
    resolve: {
      pirata: pirataListaResolver,
    },
    children: [
      { path: 'pirata-datalhes', component: PirataDetalhesComponent },
    ],
    pathMatch: 'full'
  },
  {
    path: 'pirata', redirectTo: 'pirata/pirata-lista', pathMatch: 'full'
  },
  {
    path: 'admin/users',
    loadChildren: () =>
      import('./modules/user-management-adm/user-management-adm.module').then(m => m.UserManagementAdmModule),
    // canMatch: []
  },
  { path: '', redirectTo: 'pirata', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
