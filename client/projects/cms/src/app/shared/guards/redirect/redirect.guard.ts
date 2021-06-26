import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {StateService} from '../../services/state/state.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  constructor(
    private state: StateService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    next: RouterStateSnapshot
  ) {
    this.state.entryPath = next.url;
    return true;
  }
}
