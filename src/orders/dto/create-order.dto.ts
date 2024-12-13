import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsNumber()
  @IsPositive()
  totalItems: number;

  @IsEnum(OrderStatusList, {
    message: `Posible order status value are: ${OrderStatusList}`,
  })
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;
}