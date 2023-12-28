import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { PirataService } from 'src/app/services/pirata.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  routerSubscription!: Subscription;

  usuario: Usuario | null = null;

  constructor(
    private readonly router: Router,
    private readonly usuarioService: UsuarioService,
    private readonly snackBarService: SnackBarService,
    private readonly pirataService: PirataService) { }

  ngOnInit(): void {
    this.subscription = this.usuarioService.currentUser$.subscribe({
      next: (usuario: Usuario | null) => {
        this.usuario = usuario;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  logout(): void {
    this.usuarioService.logout();
  }
}
