import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs';
import {StorageState} from '../../types/storage-state';

export class StorageStateRouter extends StorageState {
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		super();
	}

	get routes() {
		return this.activatedRoute.data
			.pipe(
				map(data => data.route)
			);
	}

	navigateTo(path: string[], extras?: any): void {
		this.router.navigate(path, extras);
	}
}