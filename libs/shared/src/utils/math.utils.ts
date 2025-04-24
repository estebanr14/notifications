import Big from 'big.js';

export const multiply = (x: number, y: number) =>
  new Big(x).times(y).toNumber();
export const div = (x: number, y: number) => new Big(x).div(y).toNumber();
export const pow = (x: number, y: number) => new Big(x).pow(y).toNumber();
export const sum = (x: number, y: number) => new Big(x).plus(y).toNumber();
export const minus = (x: number, y: number) => new Big(x).minus(y).toNumber();
