import type {RequestHandler} from '@sveltejs/kit';
import {getPage} from '$lib/firebase';

export const get: RequestHandler = async () => {
	return await getPage('home');
};