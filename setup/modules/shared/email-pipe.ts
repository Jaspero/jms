export const EMAIL_PIPE = {
  pipe: ['custom'],
  pipeArguments: {
    0: (v: string) => `<a href="mailto:${v}" class="link">${v}</a>`
  }
};
