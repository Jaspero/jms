import type {Handle} from '@sveltejs/kit';
import {getDocument} from './lib/firebase';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.locals.headerLinks) {
		event.locals.headerLinks = (await getDocument('settings', 'layout') as any).headerLinks
	}

	const response = await resolve(event);

	return response;
};
