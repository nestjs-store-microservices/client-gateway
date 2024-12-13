import { IsEnum } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum';

export class StatusDto {
  @IsEnum(OrderStatusList, {
    message: `Valid status are: ${OrderStatusList}`,
  })
  status: OrderStatus;
}
