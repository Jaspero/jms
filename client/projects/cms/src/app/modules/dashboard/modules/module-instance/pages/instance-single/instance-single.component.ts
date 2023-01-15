import {ChangeDetectionStrategy, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilderData, FormBuilderComponent, State, FormBuilderContextService} from '@jaspero/form-builder';
import {parseTemplate, random, safeEval} from '@jaspero/utils';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {notify} from '@shared/utils/notify.operator';
import {interval, Observable, of, Subject, Subscription} from 'rxjs';
import {debounceTime, map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {ViewState} from '../../../../../../shared/enums/view-state.enum';
import {UtilService} from '../../../../../../shared/services/util/util.service';
import {queue} from '../../../../../../shared/utils/queue.operator';
import {InstanceOverviewContextService} from '../../services/instance-overview-context.service';
import {Action} from '../../../../../../shared/interfaces/action.interface';
import {processActions} from '../../../../../../shared/utils/process-actions';
import {StateService} from '../../../../../../shared/services/state/state.service';
import {toObservable} from '../../../../../../shared/utils/to-observable';
import {SingleService} from '../../interfaces/single-service.interface';
import {DefaultSingleService} from '../../services/default-single.service';

interface Instance {
  module: {
    id: string;
    docIdPrefix: string;
    docIdSize: number;
    docIdMethod?: <T = any>(data: T) => string;
    name: string;
    editTitleKey: string;
  };
  actions?: Action[];
  autoSave?: true;
  directLink: boolean;
  formatOnSave: (data: any) => any;
  formatOnEdit: (data: any) => any;
  formatOnCreate: (data: any) => any;
  formBuilder: FormBuilderData;
}

@UntilDestroy()
@Component({
  selector: 'jms-instance-single',
  templateUrl: './instance-single.component.html',
  styleUrls: ['./instance-single.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstanceSingleComponent implements OnInit {
  constructor(
    public ioc: InstanceOverviewContextService,
    public util: UtilService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private state: StateService,
    private injector: Injector,
    private formCtx: FormBuilderContextService
  ) {
  }

  @ViewChild(FormBuilderComponent, {static: false})
  formBuilderComponent: FormBuilderComponent;
  initialValue: string;
  currentValue: string;
  viewState = ViewState;
  currentState: ViewState;
  formState: State;
  data$: Observable<Instance>;
  change: Instance;
  saveBuffer$ = new Subject<Instance>();
  first = true;
  confirmExitOnTouched: boolean;
  actions: {
    [key: string]: Observable<any>
  } = {};
  singleService: SingleService;
  tac: Function;
  
  private autoSaveListener: Subscription;

  ngOnInit() {
    this.tac = this.toActionObservable.bind(this);
    this.data$ = this.ioc.module$.pipe(
      switchMap(module => {

        // @ts-ignore
        this.formCtx.module = module.id;
        this.singleService = this.injector.get(module.layout?.instance?.service || DefaultSingleService);

        return this.activatedRoute.params.pipe(
          switchMap(params => {

            const id = Object.entries(params).reduce((acc, [key, value]) => {
              if (key.startsWith('document')) {
                const index = key.split('-')[1] || 0;

                if (index >= acc[0]) {
                  acc = [index, value];
                }
              }
              return acc;
            }, [0, 'new'])[1] as string;

            this.util.docId = id;

            if (id === 'new') {
              this.currentState = ViewState.New;
              this.formState = State.Create;
              return of(history.state?.data);
            } else if (id.endsWith('--copy')) {
              this.currentState = ViewState.Copy;
              this.formState = State.Create;
              return this.singleService
                .get(module.id, id.replace('--copy', ''))
                .pipe(queue());
            } else {
              this.currentState = ViewState.Edit;
              this.formState = State.Edit;
              return this.singleService
                .get(module.id, id)
                .pipe(queue());
            }
          }),
          map((value: any) => {
            this.initialValue = JSON.stringify(value);
            this.currentValue = JSON.stringify(this.initialValue);

            let editTitleKey = 'id';
            let actions: Action[];

            const formatOn: any = {};
            const autoSave = module.metadata?.hasOwnProperty('autoSave') && this.currentState === ViewState.Edit;
            this.confirmExitOnTouched = module.metadata?.hasOwnProperty('confirmExitOnTouched')
              && module.metadata?.confirmExitOnTouched && this.currentState === ViewState.Edit;

              if (module.layout?.editTitleKey) {
                const evaluated = safeEval(module.layout.editTitleKey);
                const eValue = (
                  typeof evaluated === 'function'
                    ? evaluated(value)
                    : parseTemplate(`{{${module.layout.editTitleKey}}}`, value)
                );
                editTitleKey = eValue !== undefined && eValue !== 'undefined' ?
                  eValue :
                  (module.layout.editTitleKeyFallback || '-');
              } else {
                editTitleKey = value?.[editTitleKey] || '';
              }

            if (module.layout) {
              if (module.layout.instance) {

                if (module.layout.instance.actions) {
                  actions = processActions(this.state.role, module.layout.instance.actions, this.ioc);
                }

                if (module.layout.instance.formatOnLoad) {
                  const method = safeEval(module.layout.instance.formatOnLoad);

                  if (method) {
                    value = method(value);
                  }
                }

                ['formatOnSave', 'formatOnEdit', 'formatOnCreate'].forEach(it => {
                  if (module.layout.instance[it]) {
                    const method = safeEval(module.layout.instance[it]);

                    if (method) {
                      formatOn[it] = method;
                    }
                  }
                });
              }
            }

            if (this.autoSaveListener) {
              this.autoSaveListener.unsubscribe();
            }

            if (autoSave && module.metadata.autoSave) {
              this.autoSaveListener = interval(module.metadata.autoSave)
                .pipe(
                  untilDestroyed(this)
                )
                .subscribe(() => {
                  if (this.change) {
                    this.saveBuffer$.next(this.change);
                    this.change = null;
                  }
                });
            }

            return {
              module: {
                id: module.id,
                docIdPrefix: module.metadata?.docIdPrefix || module.id.slice(0, 2),
                docIdSize: module.metadata?.docIdSize || 12,
                docIdMethod: module.metadata?.docIdMethod,
                name: module.name,
                editTitleKey
              },
              directLink: !!(module.layout && module.layout.directLink),
              ...actions && {actions},
              ...formatOn,
              formBuilder: {
                schema: module.schema,
                definitions: module.definitions,
                value,
                ...module.layout && module.layout.instance && module.layout.instance.segments && {
                  segments: module.layout.instance.segments
                }
              },
              ...autoSave && {autoSave: true}
            };
          })
        )
      })
    );

    this.saveBuffer$
      .pipe(
        debounceTime(300),
        switchMap(instance =>
          this.save(instance, false)()
        ),
        untilDestroyed(this)
      )
      .subscribe();
  }

  save(instance: Instance, navigate = true) {
    return () => {
      this.formBuilderComponent.process();
      const initial = this.formBuilderComponent.form.getRawValue();
      const id =
        initial.id ||
        (instance.module.docIdMethod ?
          instance.module.docIdMethod(initial) :
          `${instance.module.docIdPrefix}-${random.string(instance.module.docIdSize)}`);

      const actions: any[] = [
        switchMap((data: any) => {
          if (this.currentState === ViewState.Edit && instance.formatOnEdit) {
            data = instance.formatOnEdit(data);
          } else if (this.currentState === ViewState.New && instance.formatOnCreate) {
            data = instance.formatOnCreate(data);
          }

          if (instance.formatOnSave) {
            data = instance.formatOnSave(data);
          }

          this.initialValue = JSON.stringify(data);

          delete data.id;

          return this.singleService.save(instance.module.id, id, data);
        })
      ];

      if (navigate) {
        actions.push(notify());

        if (!instance.directLink) {
          actions.push(tap(() => this.back()));
        }
      }

      this.confirmExitOnTouched = false;

      return (this.formBuilderComponent.save(
        instance.module.id,
        id
      ).pipe as any)(...actions);
    };
  }

  back() {
    this.initialValue = '';
    this.currentValue = '';

    if (this.activatedRoute.snapshot.queryParams.back) {
      this.router.navigate([this.activatedRoute.snapshot.queryParams.back]);
    } else {
      this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    }
  }

  valueChange(data: any, instance: Instance) {
    if (instance.autoSave) {
      if (this.first) {
        this.first = false;
        return;
      }

      const newValue = JSON.stringify(data);

      if (newValue !== this.initialValue) {
        if (this.autoSaveListener) {
          this.change = instance;
        } else {
          this.saveBuffer$.next(instance);
        }
      }
    }
  }

  toActionObservable(value, data) {
    return toObservable(value({id: this.util.docId, data}))
      .pipe(shareReplay(1)) as Observable<string>;
  }
}
