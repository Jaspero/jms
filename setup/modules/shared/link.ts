const link = (prefix?: string, url?: string) => ({
  pipe: ['custom'],
  pipeArguments: {
    0: `id => \`<a class="link" target="_blank" href="https://air-locker-training${url || ''}.web.app${prefix ? ('/' + prefix) : ''}/\${id === 'home' ? '' : id}">\${id === 'home' ? '/' : id}</a>\``
  }
});

export const SHOP_LINK = (prefix?: string) => link(prefix, '-shop');
export const WEB_LINK = (prefix?: string) => link(prefix);
