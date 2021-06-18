export function background(
  data: {
    background?: string;
    backgroundSize?: string;
    backgroundRepeat?: boolean;
  }
) {
  const styles: {[key: string]: string} = {};

  if (data.background) {
    if (data.background.startsWith('http')) {

      if (data.backgroundSize) {
        styles['background-size'] = data.backgroundSize;
      }

      if (data.backgroundRepeat) {
        styles['background-repeat'] = 'no-repeat';
      }

      styles['background-image'] = `url("${data.background}")`;
    } else {
      styles.background = data.background;
    }
  }

  return styles;
}
