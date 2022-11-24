import {Observable} from 'rxjs';

export abstract class StorageState {
	get routes(): Observable<string[]> {
		return;
	}

	navigateTo(path: string[], extras?: any) {}
}