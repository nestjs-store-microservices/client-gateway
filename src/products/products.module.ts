import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { envs, PRODUCT_SERVICE } from 'src/config';

import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: { host: envs.host_product, port: envs.port_product },
      },
    ]),
  ],
  providers: [],
})
export class ProductsModule {}
