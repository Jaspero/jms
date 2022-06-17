import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		preserve: ['module']
	}),

	kit: {
		adapter: adapter({
			pages: '../public/web'
		}),
		prerender: {
			default: true,
			/**
			 * You can add any pages that should be rendered
			 * but aren't accessible through links on the website here.
			 */
			entries: []
		}
	}
};

export default config;
