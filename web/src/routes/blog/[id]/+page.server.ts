import {getPage} from '$lib/firebase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({params}) => {
  return await getPage(params.id, 'posts');
};
