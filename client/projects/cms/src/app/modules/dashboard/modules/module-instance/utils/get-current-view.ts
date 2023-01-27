import {createSelector} from '../../../../../elements/element.decorator';

export function getCurrentView(selector: string) {
	const toUse = createSelector(selector);

	if (toUse.startsWith('<')) {
		return toUse;
	}

	return `<${toUse}></${toUse}>`;
}