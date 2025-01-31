import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  HOST_PRODUCT_MS: string;
  PORT_PRODUCT_MS: number;

  HOST_ORDERS_MS: string;
  PORT_ORDERS_MS: number;

  NATS_SERVERS: string[];

  URL_FRONTENDS: string[];
}

const envsScheme = joi
  .object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    URL_FRONTENDS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsScheme.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(';'),
  URL_FRONTENDS: process.env.URL_FRONTENDS?.split(';'),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
  urlFrontEnds: envVars.URL_FRONTENDS,
};
