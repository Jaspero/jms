export class Random {

  static CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  static aToB(a = 0, b = 1) {
    return Math.floor(Math.random() * (b - a + 1) + a);
  }

  static string(size = 8) {
    return Array.apply(null, Array(size)).map(() => {
      return Random.fromArray<string>(Random.CHARACTERS.split(''));
    }).join('');
  }

  static fromArray<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)];
  }

  static bool() {
    return Math.random() >= 0.5;
  }

  static int(a = 0, b = 10) {
    return Random.aToB(a, b);
  }

  static float(a = 0, b = 1) {
    return Math.random() * (b - a) + a;
  }
}
