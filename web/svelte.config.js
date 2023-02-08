import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const BLOGS = [];

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
      entries: ['/404', ...BLOGS]
    }
  }
};

export default config;
