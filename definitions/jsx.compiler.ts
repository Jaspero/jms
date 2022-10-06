export const JSX = (item) => {
  return item;
};

JSX.createElement = (name: string, props: {[id: string]: string}, ...content: string[]) => {
  props = props || {};

  const proccessed = [];

  for (let prop in props) {
    let value = props[prop];

    if (prop.startsWith('on') || prop.endsWith('Func')) {

      let key = prop;

      if (key.endsWith('Func')) {
        key = key.replace(/Func$/, '');
      }

      proccessed.push(`${key}="${value.toString().trim()}"`)

      continue;
    }

    if (prop === 'className') {
      prop = 'class';
    }

    proccessed.push(`${prop}="${value}"`);
  }

  return `<${name} ${proccessed.join(' ')}> ${content.join('')}</${name}>`;
};

export default JSX;
