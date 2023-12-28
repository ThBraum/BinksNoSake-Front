import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/core/login/login.component';
import { RegisterComponent } from './components/pages/core/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule, JwtModuleOptions, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { PirataDetalhesComponent } from './components/piratas/pirata-detalhes/pirata-detalhes.component';
import { PirataListaComponent } from './components/piratas/pirata-lista/pirata-lista.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from './modules/shared/shared.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';

function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    PirataListaComponent,
    PirataDetalhesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    MatTooltipModule,
    JwtModule.forRoot({ config: { tokenGetter } }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
