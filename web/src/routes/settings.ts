import type {RequestHandler} from '@sveltejs/kit';
import {getDocument} from '$lib/firebase';
import {writable} from 'svelte/store';

export const get: RequestHandler = async () => {
	const data = await getDocument('settings', 'layout');
	return {
		body: {
			headerLinks: (data || {}).headerLinks || []
		}
	}
};

export const isLoggedIn = writable(false);