import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario/usuario';
import { UsuarioUpdate } from 'src/app/interfaces/usuario/usuarioUpdate';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit, OnDestroy {
  subscription!: Subscription;

  constructor(private readonly usuarioService: UsuarioService,
    private readonly router: ActivatedRoute,) { }

  usuario!: Usuario;

  ngOnInit(): void {
    this.subscription = this.router.data.subscribe({
      next: (data) => {
        this.usuario = data['usuario'];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  profileUpdate(usuario: UsuarioUpdate): void {
    this.usuarioService.updateUser(usuario).subscribe({
      next: (usuario: UsuarioUpdate) => {
        this.usuario = {...this.usuario, ...usuario};
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
