import {ActivatedRouteSnapshot, BaseRouteReuseStrategy} from '@angular/router';
import {InstanceOverviewComponent} from '../../modules/dashboard/modules/module-instance/pages/instance-overview/instance-overview.component';

export class AppReuseStrategy extends BaseRouteReuseStrategy {

	/**
	 * Components that shouldn't be reused
	 */
	exclued = [
		InstanceOverviewComponent
	];

	isObject(object: any) {
		return object != null && typeof object === 'object';
	}

	isEqual(obj1: any, obj2: any) {
		const props1 = Object.getOwnPropertyNames(obj1);
		const props2 = Object.getOwnPropertyNames(obj2);

		if (props1.length != props2.length) {
			return false;
		}

		for (var i = 0; i < props1.length; i++) {
			let val1 = obj1[props1[i]];
			let val2 = obj2[props1[i]];
			let isObjects = this.isObject(val1) && this.isObject(val2);
			if (isObjects && !this.isEqual(val1, val2) || !isObjects && val1 !== val2) {
				return false;
			}
		}
		return true;
	}

	shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot) {
		return future.routeConfig === curr.routeConfig &&
			(
				!this.exclued.includes(curr.routeConfig?.component) ||
				this.isEqual(future.params, curr.params)
			)
	}
}