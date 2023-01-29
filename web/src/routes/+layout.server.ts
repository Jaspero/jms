import {getDocument} from '$lib/firebase';
import type { LayoutServerLoad } from './$types';
 
export const load = (async () => {
	const data = await getDocument('settings', 'layout');
  return {
    headerLinks: (data || {}).headerLinks || []
  };
}) satisfies LayoutServerLoad;