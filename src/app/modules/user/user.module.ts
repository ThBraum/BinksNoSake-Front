import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { AppModule } from 'src/app/app.module';

@NgModule({
  declarations: [
    ProfileUpdateComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AppModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule
  ]
})
export class UserModule { }
