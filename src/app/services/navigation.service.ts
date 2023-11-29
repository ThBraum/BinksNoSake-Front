import { Injectable } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loadingRoute$ = this.loadingSubject.asObservable();
  public routesStarts = Array<string>();

  constructor(private readonly router: Router) {
    this.router.events.subscribe((routerEvent) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  private checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loadingSubject.next(true);
      this.routesStarts.push(routerEvent.url);
    } else if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.loadingSubject.next(false);
    }
  }
}
