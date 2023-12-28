import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { UsuarioUpdate } from 'src/app/interfaces/usuario/usuarioUpdate';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit, OnDestroy {
  subscription!: Subscription;

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private readonly router: Router) { }

  usuario!: Usuario;

  ngOnInit(): void {
    this.subscription = this.route.data.subscribe({
      next: (data) => {
        this.usuario = data['usuario'];
      },
      error: (err) => {
        this.snackBarService.showMessage("Erro ao carregar usuário.", true);
        this.router.navigateByUrl('/login');
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  profileUpdate(formData: FormData): void {
    this.usuarioService.updateUser(formData).subscribe({
      next: (usuario: UsuarioUpdate) => {
        this.snackBarService.showMessage("Perfil atualizado com sucesso.");
        this.router.navigateByUrl('/pirata');
      },
      error: (err) => {
        this.snackBarService.showMessage("Erro ao atualizar perfil.", true);
      },
    })
  }
}
