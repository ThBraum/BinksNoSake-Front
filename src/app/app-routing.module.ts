import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { PirataResolver } from './resolvers/pirata.resolver';
import { PirataListaComponent } from './components/pages/piratas/pirata-lista/pirata-lista.component';
import { LoginComponent } from './components/pages/core/login/login.component';

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
    // canMatch: []
  },
  {
    path: 'pirata',
    component: PirataListaComponent,
    resolve: {
      pirata: PirataResolver // responsável por carregar os dados do pirata antes de carregar a página
    }
  },
  {
    path: 'admin/users',
    loadChildren: () =>
      import('./modules/user-management-adm/user-management-adm.module').then(m => m.UserManagementAdmModule),
    // canMatch: []
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
