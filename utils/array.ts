export function mode<T>(arr: readonly T[]): T {
  return arr
    .slice()
    .sort((a, b) => arr.filter((v) => v === a).length - arr.filter((v) => v === b).length)
    .pop();
}

export function min(arr: readonly number[]): number {
  return Math.min(...arr);
}

export function max(arr: readonly number[]): number {
  return Math.max(...arr);
}

export function avg(arr: readonly number[]): number {
  return arr.reduce((total, b, _i, arr) => total + b / arr.length, 0);
}

export function circularIndex<T>(values: readonly T[], total: number, angle: number): T {
  const index = Math.round((angle / total) * values.length) % values.length;
  return values.at(index);
}
