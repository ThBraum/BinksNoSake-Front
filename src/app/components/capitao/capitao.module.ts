import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapitaoRoutingModule } from './capitao-routing.module';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper'
import { MatSortModule } from '@angular/material/sort';
import { CapitaoListaComponent } from './capitao-lista/capitao-lista.component';
import { CapitaoDetalhesComponent } from './capitao-detalhes/capitao-detalhes.component';
import { CapitaoCriacaoComponent } from './capitao-criacao/capitao-criacao.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CapitaoListaComponent,
    CapitaoDetalhesComponent,
    CapitaoCriacaoComponent
  ],
  imports: [
    CommonModule,
    CapitaoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatIconModule,
    MatTableModule,
    MatStepperModule,
    MatSortModule
  ]
})
export class CapitaoModule { }
