import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagmentAdmComponent } from './user-managment-adm/user-managment-adm.component';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AppModule } from 'src/app/app.module';


@NgModule({
  declarations: [
    UserManagmentAdmComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserManagementAdmModule { }
