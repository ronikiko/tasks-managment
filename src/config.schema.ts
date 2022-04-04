import * as Joi from '@hapi/joi';

export const configSchemaValidation = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432).required(),
  JWT_SECRET: Joi.string().required(),
});
