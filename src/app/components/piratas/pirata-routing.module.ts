import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PirataListaComponent } from './pirata-lista/pirata-lista.component';
import { pirataListaResolver } from 'src/app/resolvers/pirata-lista.resolver';
import { CriacaoPirataComponent } from './criacao-pirata/criacao-pirata.component';
import { PirataDetalhesComponent } from './pirata-detalhes/pirata-detalhes.component';

const routes: Routes = [
  {
    path: '',
    component: PirataListaComponent,
    resolve: { pirata: pirataListaResolver },
  },
  { path: 'create', component: CriacaoPirataComponent },
  { path: 'detalhes', component: PirataDetalhesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PirataRoutingModule { }
