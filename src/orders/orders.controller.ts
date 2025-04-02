import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { PaginationDto } from 'src/common';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
        @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto)

  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    //return (orderPaginationDto)
    return this.ordersClient.send('findAllOrders', orderPaginationDto);

  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOneOrder', {id: id})
      .pipe(
        catchError((err) => { throw new RpcException(err) })
      );
  }

  @Get(':status')
  findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    return this.ordersClient.send('findAllOrders', {...paginationDto, status: statusDto.status})
      .pipe(
        catchError((err) => { throw new RpcException(err) })
      );
  }

  @Patch(':id')
  changeStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    return this.ordersClient.send('changeOrderStatus', {id, status: statusDto.status})
      .pipe(
        catchError((err) => { throw new RpcException(err) })
      );

  }

}
