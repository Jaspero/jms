import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslocoService} from '@ngneat/transloco';
import {Observable, throwError} from 'rxjs';
import {catchError, take, tap} from 'rxjs/operators';

const DEFAULT_OPTIONS = {
  showThrownError: false,
  success: 'OPERATION_COMPLETED',
  error: 'OPERATION_FAILED'
};

export function notify(
  options: {
    showThrownError?: boolean;
    success?: string | boolean;
    error?: string | boolean;
  } = {}
): <T>(source$: Observable<T>) => Observable<T> {
  const finalOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const snackBar: MatSnackBar = (window as any).rootInjector.get(MatSnackBar);
  const transloco: TranslocoService = (window as any).rootInjector.get(TranslocoService);
  const mainState: any = (window as any).rootInjector.get('MAIN_STATE');

  const createSnack = (message: string, error = false) => {
    mainState.translationsReady$
      .pipe(
        take(1)
      )
      .subscribe(() =>
        snackBar.open(
          transloco.translate(message),
          transloco.translate('DISMISS'),
          {
            duration: 5000,
            ...error && {panelClass: 'snack-bar-error'}
          }
        )
      )
  }

  return <T>(source$: Observable<T>) => {
    return source$.pipe(
      tap(() => {
        if (finalOptions.success) {
          createSnack(finalOptions.success as string);
        }
      }),
      catchError(err => {
        if (finalOptions.error || finalOptions.showThrownError) {
          createSnack(
            transloco.translate(finalOptions.showThrownError && (err?.message) ? err.message : finalOptions.error as string),
            true
          );
        }

        console.error(err);
        return throwError(() => err);
      })
    );
  };
}
