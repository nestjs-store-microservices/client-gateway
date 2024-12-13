import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDERS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { catchError } from 'rxjs';
import { OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() pagination: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', pagination);
  }

  @Get(':status')
  findAllByStatus(
    @Param() status: StatusDto,
    @Query() pagination: PaginationDto,
  ) {
    try {
      return this.ordersClient.send('findAllByStatus', {
        ...status,
        ...pagination,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOneOrder', { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this.ordersClient
      .send('changeOrderStatus', { id, ...statusDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
