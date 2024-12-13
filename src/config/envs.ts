import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  HOST_PRODUCT_MS: string;
  PORT_PRODUCT_MS: number;

  HOST_ORDERS_MS: string;
  PORT_ORDERS_MS: number;
}

const envsScheme = joi
  .object({
    PORT: joi.number().required(),
    HOST_PRODUCT_MS: joi.string().required(),
    PORT_PRODUCT_MS: joi.number().required(),
    HOST_ORDERS_MS: joi.string().required(),
    PORT_ORDERS_MS: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envsScheme.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  host_product: envVars.HOST_PRODUCT_MS,
  port_product: envVars.PORT_PRODUCT_MS,

  host_order: envVars.HOST_ORDERS_MS,
  port_order: envVars.PORT_ORDERS_MS,
};
