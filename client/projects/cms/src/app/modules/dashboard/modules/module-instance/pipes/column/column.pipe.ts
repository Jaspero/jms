import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
  TitleCasePipe,
  UpperCasePipe
} from '@angular/common';
import {ChangeDetectorRef, Inject, Optional, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {PipeType} from '@definitions';
import {SanitizePipe} from '@jaspero/ng-helpers';
import {safeEval} from '@jaspero/utils';
import {
  MaybeArray, TranslocoPipe,
  TranslocoScope,
  TranslocoService, TRANSLOCO_LANG,
  TRANSLOCO_SCOPE
} from '@ngneat/transloco';
import {forkJoin, of} from 'rxjs';
import {MathPipe} from '../../../../../../shared/pipes/math/math-pipe.';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {InstanceOverviewContextService} from '../../services/instance-overview-context.service';
import {EllipsisPipe} from '../ellipsis/ellipsis.pipe';

interface Args {
  [key: string]: any;
}

@Pipe({
  name: 'column'
})
export class ColumnPipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer,
    private transloco: TranslocoService,
    private cdr: ChangeDetectorRef,
    @Optional()
    @Inject(TRANSLOCO_SCOPE)
    private providerScope: MaybeArray<TranslocoScope>,
    @Optional()
    @Inject(TRANSLOCO_LANG)
    private providerLang: string | null,
    private db: DbService
  ) {
    this.pipes = {
      [PipeType.Number]: new DecimalPipe('en'),
      [PipeType.Currency]: new CurrencyPipe('en'),
      [PipeType.Percent]: new PercentPipe('en'),
      [PipeType.Date]: new DatePipe('en'),
      [PipeType.Math]: new MathPipe(),
      [PipeType.Json]: new JsonPipe(),
      [PipeType.Lowercase]: new LowerCasePipe(),
      [PipeType.Uppercase]: new UpperCasePipe(),
      [PipeType.Titlecase]: new TitleCasePipe(),
      [PipeType.Sanitize]: new SanitizePipe(this.sanitizer),
      [PipeType.SanitizeFb]: new SanitizePipe(this.sanitizer),
      [PipeType.Ellipsis]: new EllipsisPipe(),
      [PipeType.Transloco]: new TranslocoPipe(
        this.transloco,
        this.providerScope,
        this.providerLang,
        this.cdr
      ),
      [PipeType.Custom]: '',
      [PipeType.GetModule]: '',
      [PipeType.GetDocuments]: ''
    };
  }

  pipes: {[key: string]: any};
  ioc: InstanceOverviewContextService;

  transform(
    value: any,
    pipeTypes: PipeType | PipeType[],
    allArgs?: Args,
    row?: any
  ): any {
    if (!pipeTypes) {
      return value;
    }

    if (Array.isArray(pipeTypes)) {
      return pipeTypes.reduce(
        (acc, type, index) =>
          this.executePipeTransform(type, acc, this.formatArguments((allArgs || {})[index]), row),
        value
      );
    } else {
      return this.executePipeTransform(
        pipeTypes,
        value,
        this.formatArguments(allArgs),
        row
      );
    }
  }

  private formatArguments(args: Args) {
    if (Array.isArray(args)) {
      return args.map(arg => this.formatArgument(arg));
    } else {
      return this.formatArgument(args);
    }
  }

  private formatArgument(value: any) {
    if (typeof value !== 'string') {
      return value;
    }

    const regEx = /{{(.*?)}}/;

    let match = regEx.test(value);

    while (match) {
      const target = value.match(regEx)[0];
      value = value.replace(target, `' + ${target.slice(2, -2)} + '`);
      match = regEx.test(value);
    }

    return value;
  }

  private executePipeTransform(type, val, args, row) {
    switch (type) {
      case PipeType.Date:
        if (!val) {
          return '';
        }

        try {
          const test = new Date(val);
        } catch (e) {
          return '';
        }

        break;
      case PipeType.Titlecase:
      case PipeType.Uppercase:
      case PipeType.Lowercase:
        if (typeof val !== 'string') {
          return '';
        }
        break;
      case PipeType.Number:
      case PipeType.Currency:
      case PipeType.Percent:
        if (typeof val !== 'number') {
          return '';
        }
        break;
      case PipeType.GetModule:
        const getModuleMethod = safeEval(args);

        if (!getModuleMethod || typeof getModuleMethod !== 'function') {
          return;
        }

        let getModuleResponse = '';

        try {
          getModuleResponse = getModuleMethod(val, row);
        } catch (e) {
          console.log('Error GetModule', e);
          return;
        }

        return this.db.getDocumentsSimple(getModuleResponse);
      case PipeType.GetDocuments:
        const getDocumentsMethod = safeEval(args);

        if (!getDocumentsMethod || typeof getDocumentsMethod !== 'function') {
          return;
        }

        let getDocumentsResponse = [];

        try {
          getDocumentsResponse = getDocumentsMethod(val, row) || [];
        } catch (e) {
          console.log('Error GetDocuments', e);
          return;
        }

        if (!getDocumentsResponse.length) {
          return of([]);
        }

        return forkJoin(getDocumentsResponse.map(path => {
          const [module, document] = (path.startsWith('/') ? path.slice(1) : path).split('/');

          if (!document) {
            return of(null);
          }

          return this.db.getDocument(module, document);
        }));
      case PipeType.Custom:
        if (!args) {
          return '';
        }

        const method = safeEval(args);

        if (!method || typeof method !== 'function') {
          return '';
        }

        let response = '';

        try {
          response = method(val, row);
        } catch (e) {
        }

        return response;
    }

    /**
     * Process args (allows for inserting functions where primitives are expected)
     */
    if (!Array.isArray(args)) {
      args = [args];
    }

    const argsToUse = (args || []).map(it => typeof it === 'function' ? it(val, row) : it);

    return this.pipes[type].transform(val, ...argsToUse);
  }
}
