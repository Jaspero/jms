import {Injectable} from '@angular/core';
import {InstanceSort, Module} from '@definitions';
import {merge, Observable} from 'rxjs';
import {map, skip, startWith, switchMap, tap} from 'rxjs/operators';
import {WhereFilter} from '../../../../../shared/interfaces/where-filter.interface';
import {DbService} from '../../../../../shared/services/db/db.service';
import {queue} from '../../../../../shared/utils/queue.operator';
import {OverviewService} from '../interfaces/overview-service.interface';
import {generateFilters} from '../utils/generate-filters';
import {InstanceOverviewContextService} from './instance-overview-context.service';

@Injectable()
export class DefaultOverviewService implements OverviewService {
	constructor(
		private db: DbService,
		private ioc: InstanceOverviewContextService
	) { }

	getDocuments(
		collection: string,
		pageSize: number,
		filter?: WhereFilter[]
	) {
		return this.db
			.getDocuments(collection, pageSize, undefined, undefined, filter)
	}

	get(module: Module, pageSize: number, filter?: WhereFilter[], search?: string, sort?: InstanceSort): Observable<any[]> {
		return this.db.getDocuments(
			module.id,
			pageSize,
			sort,
			null,
			generateFilters(
				module,
				search,
				filter
			),
			null,
			module.collectionGroup
		)
			.pipe(
				queue(),
				switchMap(snapshots => {
					let cursor;

					this.ioc.hasMore$.next(snapshots.length === this.ioc.routeData.pageSize);

					if (snapshots.length) {
						cursor = snapshots[snapshots.length - 1];
						this.ioc.emptyState$.next(false);
					} else {
						this.ioc.emptyState$.next(true);
					}

					const changeListener = (cu = null) => {
						return this.db.getStateChanges(
							module.id,
							this.ioc.routeData.pageSize,
							this.ioc.routeData.sort,
							cu,
							generateFilters(module, this.ioc.routeData.search, this.ioc.routeData.filter),
							module.collectionGroup
						).pipe(
							skip(1),
							tap(snaps => {
								snaps.forEach(snap => {
									const index = snapshots.findIndex(
										sp => sp.id === snap.doc.id
									);

									switch (snap.type) {
										case 'added':
											if (index === -1) {
												snapshots.push(snap.doc);
											}
											break;
										case 'modified':
											if (index !== -1) {
												snapshots[index] = snap.doc;
											}
											break;
										case 'removed':
											if (index !== -1) {
												snapshots.splice(index, 1);
											}
											break;
									}
								});
							})
						);
					};

					return merge(
						this.ioc.loadMore$
							.pipe(
								switchMap(() =>
									merge(
										this.db
											.getDocuments(
												module.id,
												this.ioc.routeData.pageSize,
												this.ioc.routeData.sort,
												cursor,
												generateFilters(module, this.ioc.routeData.search, this.ioc.routeData.filter),
												null,
												module.collectionGroup
											)
											.pipe(
												queue(),
												tap(snaps => {
													if (snaps.length < this.ioc.routeData.pageSize) {
														this.ioc.hasMore$.next(false);
													}

													if (snaps.length) {
														cursor = snaps[snaps.length - 1];

														snapshots.push(
															...snaps
														);
													}
												})
											),
										changeListener(cursor)
									)
								)
							),
						changeListener(null)
					)
						.pipe(
							startWith({}),
							map(() =>
								snapshots.map(it => ({
									data: it.data(),
									ref: it.ref,
									id: it.id
								}))
							)
						);
				}),
			)
	}
}