export const JSX = (item) => {
  return item;
};

JSX.createElement = (name: string, props: {[id: string]: string}, ...content: string[]) => {
  props = props || {};

  const onclick = props.onclick || '';
  delete props.onclick;

  const propsString = Object.keys(props)
    .map(key => {
      const value = props[key];
      if (key === 'className') {
        return `class=${value}`;
      }
      return `${key}=${value}`;
    })
    .join(' ');
  const onclickContent = onclick.toString()
    .slice(
      onclick.toString().indexOf('{') + 1,
      onclick.toString().lastIndexOf('}')
    ).trim().replace(/"/g, '\\"');

  const onclickString = onclick ? `onclick="${onclickContent}"` : '';
  return `<${name} ${propsString} ${onclickString}> ${content.join('')}</${name}>`;
};

export default JSX;
