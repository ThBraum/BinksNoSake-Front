import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapitaoListaComponent } from './capitao-lista/capitao-lista.component';
import { CapitaoListaResolver } from 'src/app/resolvers/capitao-lista.resolver';
import { CapitaoCriacaoComponent } from './capitao-criacao/capitao-criacao.component';
import { CapitaoDetalhesComponent } from './capitao-detalhes/capitao-detalhes.component';

const routes: Routes = [
  {
    path: '',
    component : CapitaoListaComponent,
    resolve: {
      capitao: CapitaoListaResolver
    }
  },
  { path: 'create', component: CapitaoCriacaoComponent },
  { path: 'detalhes', component: CapitaoDetalhesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapitaoRoutingModule { }
