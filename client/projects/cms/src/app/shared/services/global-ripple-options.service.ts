import {Injectable} from '@angular/core';
import {RippleGlobalOptions} from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalRippleOptionsService implements RippleGlobalOptions {
  disabled = true;
}
