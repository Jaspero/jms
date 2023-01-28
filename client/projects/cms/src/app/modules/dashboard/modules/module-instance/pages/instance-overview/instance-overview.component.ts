import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModuleOverviewView} from '@definitions';
import {UntilDestroy} from '@ngneat/until-destroy';
import {OverviewService} from '../../interfaces/overview-service.interface';
import {InstanceOverviewData} from '../../resolvers/overview/overview.resolver';
import {InstanceOverviewContextService} from '../../services/instance-overview-context.service';

@UntilDestroy()
@Component({
  selector: 'jms-instance-overview',
  templateUrl: './instance-overview.component.html',
  styleUrls: ['./instance-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstanceOverviewComponent implements OnInit {
  constructor(
    public ioc: InstanceOverviewContextService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {
  }

  currentView: string;
  activeView: string;
  showViewSelector: boolean;
  name: string;
  views: ModuleOverviewView[];
  toolbar: string[];
  hideAdd = false;
  overviewService: OverviewService;

  ngOnInit() {

    const data: InstanceOverviewData = this.activatedRoute.snapshot.data.data;

    this.currentView = data.currentView;
    this.activeView = data.activeView;
    this.showViewSelector = data.showViewSelector;
    this.name = data.name;
    this.views = data.views;
    this.toolbar = data.toolbar;
    this.hideAdd = data.hideAdd;
    this.overviewService = data.overviewService;

    this.ioc.setUp(this.cdr);
  }

  getCurrentView(selector: string) {
    this.activeView = selector;
    return this.getCurrentView(selector);
  }

  changeCurrentView(view: string) {
    this.ioc.subHeaderTemplate$.next(null);
    this.currentView = this.getCurrentView(view);
    this.cdr.markForCheck();
  }
}
