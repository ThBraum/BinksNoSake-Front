import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Pirata } from 'src/app/interfaces/pirata/Pirata';
import { PirataService } from 'src/app/services/pirata.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-pirata-lista',
  templateUrl: './pirata-lista.component.html',
  styleUrls: ['./pirata-lista.component.css']
})
export class PirataListaComponent implements OnInit, OnDestroy {
  autoplaySubscription?: Subscription;
  dataSubscription?: Subscription;

  piratas = new Array<Pirata>();

  constructor(
    private readonly router: ActivatedRoute,
    private readonly pirataService: PirataService,
    private readonly snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.dataSubscription = this.router.data.subscribe({
      next: (data) => {
        this.piratas = data['pirata'];
      },
      error: (error) => {
        console.log(error);
        this.snackBarService.showMessage('Não foi possível carregar os piratas', true);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.autoplaySubscription) this.autoplaySubscription.unsubscribe();
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }
}
