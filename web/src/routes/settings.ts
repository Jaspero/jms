import type {RequestHandler} from '@sveltejs/kit';
import {getDocument} from '$lib/firebase';

export const get: RequestHandler = async () => {
	const {headerLinks} = await getDocument('settings', 'layout');
	return {
		body: {
			headerLinks
		}
	}
};