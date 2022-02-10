import {Injectable} from '@angular/core';
import {NavigationEnd, NavigationStart, Router, Scroll} from '@angular/router';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class StateService {
  constructor(
    private router: Router
  ) {
    this.routeLoading$ = this.router.events
      .pipe(
        map(event => {
          switch (event.constructor) {
            case NavigationStart:
              return true;
            case NavigationEnd:
            case Scroll:
              return false;
          }
        }),
        distinctUntilChanged()
      );
  }

  routeLoading$: Observable<boolean>;

  private firstPage = false;

  firstPageLoaded() {
    if (this.firstPage) {
      return;
    }

    document.body.classList.remove('body-loading');
    document.body.removeChild(document.querySelector('.app-loading'));

    this.firstPage = true;
  }
}
