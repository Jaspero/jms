import {AbstractControl} from '@angular/forms';
import {distinctUntilChanged, map, startWith, tap} from 'rxjs';
import {Observable} from 'rxjs';
import {StorageState} from '../../types/storage-state';

export class StorageStateEmulator extends StorageState {
	constructor(
		private ctr: AbstractControl
	) {
		super();

		this.listener = ctr.valueChanges
			.pipe(
				startWith(''),
				distinctUntilChanged(),
				map(it => (it || '').split('/').filter(Boolean))
			);
	}

	listener: Observable<string[]>;

	get routes() {
		return this.listener;
	}

	navigateTo(path: string[], extras?: any) {
		this.ctr.setValue(
			path
				.join('/')
				.replace('storage/', '')
				.replace('storage', '')
		);
	}
}