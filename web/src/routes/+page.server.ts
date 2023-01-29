import { getPage } from '$lib/firebase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return await getPage('home');
};
