import type {RequestHandler} from '@sveltejs/kit';
import {getPage} from '$lib/firebase';

export const get: RequestHandler<{id: string}> = async ({ params }) => {
	return await getPage(params.id, 'posts');
};