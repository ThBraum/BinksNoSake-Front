import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'BinksNoSake-Front';
  loadingRoute: boolean = false;
  loadingSubscription?: Subscription;

  constructor(private readonly navigationService: NavigationService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.navigationService.loadingRoute$.subscribe(
      (next) => {
        this.loadingRoute = next;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }

}
