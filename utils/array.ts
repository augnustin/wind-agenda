export function mode<T>(arr: Array<T>): T {
  return arr.sort((a, b) => arr.filter((v) => v === a).length - arr.filter((v) => v === b).length).pop();
}

export function min(arr: Array<number>): number {
  return Math.min(...arr);
}

export function max(arr: Array<number>): number {
  return Math.max(...arr);
}

export function avg(arr: Array<number>): number {
  return arr.reduce((total, b, _i, arr) => total + b / arr.length, 0);
}
