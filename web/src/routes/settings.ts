import type {RequestHandler} from '@sveltejs/kit';
import {getDocument} from '$lib/firebase';


export const get: RequestHandler = async () => {
	const data = await getDocument('settings', 'layout');
	return {
		body: {
			headerLinks: (data || {}).headerLinks || []
		}
	}
};


