import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from './services/navigation.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Usuario } from './interfaces/usuario/usuario';
import { UsuarioService } from './services/usuario.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  title = 'BinksNoSake';
  loadingRoute: boolean = false;
  loadingSubscription?: Subscription;
  subscription!: Subscription;
  routerSubscription!: Subscription;
  isExpanded = false;
  showAccountSubMenu = false;
  showSubSubMenu = false;
  isShowing = false;

  usuario: Usuario | null = null;
  imageUrl: string = '../assets/default-avatar.svg';

  constructor(
    private readonly navigationService: NavigationService,
    private readonly usuarioService: UsuarioService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.loadingSubscription = this.navigationService.loadingRoute$.subscribe(
      (next) => {
        this.loadingRoute = next;
      },
      (error) => {
        console.error(error);
      }
    );

    this.subscription = this.usuarioService.currentUser$.subscribe({
      next: (usuario: Usuario | null) => {
        this.usuario = usuario;
        this.loadImageUrl();
      }
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  logout(): void {
    this.usuarioService.logout();
  }

  toggleSidenav(): void {
    this.isExpanded = !this.isExpanded;
    this.isShowing = !this.isExpanded;
  }

  onAccountClick(): void {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.showAccountSubMenu = true;
    }
  }

  loadImageUrl(): void {
    if (this.usuario && this.usuario.imagemURL) {
      const imageUrl = this.usuario.imagemURL;

      if (imageUrl.startsWith('http')) {
        this.imageUrl = imageUrl;
      } else {
        const apiUrl = `${environment.apiURL}/resources/images/${imageUrl}`;

        this.http.head(apiUrl).subscribe(
          () => {
            this.imageUrl = apiUrl;
          },
          (error) => {
            if (error.status === 404 || error.status === 403) {
              this.imageUrl = '../assets/default-avatar.svg';
            } else {
              this.imageUrl = apiUrl;
            }
          }
        );
      }
    } else {
      this.imageUrl = '../assets/default-avatar.svg';
    }
  }
}
