import { baseEmailTemplate } from './base.email';

export const defaultEmailTemplate = (args: any) => {
  const { message } = args;
  return baseEmailTemplate(`${message}`);
};
