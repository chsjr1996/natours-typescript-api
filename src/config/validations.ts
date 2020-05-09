import { BodyOptions } from 'routing-controllers';

export const whitelist: BodyOptions = {
  validate: { whitelist: true },
};
