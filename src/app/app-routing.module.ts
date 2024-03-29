import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/core/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { PirataDetalhesComponent } from './components/piratas/pirata-detalhes/pirata-detalhes.component';
import { UsuarioResolver } from './resolvers/usuario.resolver';
import { PirataListaComponent } from './components/piratas/pirata-lista/pirata-lista.component';
import { pirataListaResolver } from './resolvers/pirata-lista.resolver';
import { CriacaoPirataComponent } from './components/piratas/criacao-pirata/criacao-pirata.component';
import { RegisterComponent } from './components/pages/core/register/register.component';

const homeRoute = 'pirata';
const routes: Routes = [
  {
    path: '',
    redirectTo: homeRoute,
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
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
    path: 'admin/users',
    loadChildren: () =>
      import('./modules/user-management-adm/user-management-adm.module').then(m => m.UserManagementAdmModule),
    // canMatch: []
  },
  {
    path: 'pirata',
    loadChildren: () =>
      import('./components/piratas/pirata.module').then(m => m.PirataModule),
  },
  {
    path: 'capitao',
    loadChildren: () =>
      import('./components/capitao/capitao.module').then(m => m.CapitaoModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
