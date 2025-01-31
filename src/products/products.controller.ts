import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { Auth } from 'src/auth/decorators';

import { NATS_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() productDto: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, productDto);
  }

  @Auth()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Auth()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'find_one_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Auth(ValidRoles.admin)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() product: UpdateProductDto,
  ) {
    return this.client
      .send({ cmd: 'update_product' }, { ...product, id: id.toString() })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Auth(ValidRoles.admin)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
