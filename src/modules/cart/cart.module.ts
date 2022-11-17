import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartItemEntity } from "./cart-item.entity";

import { CartController } from "./cart.controller";
import { CartEntity } from "./cart.entity";
import { CartService } from "./cart.service";

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity])],
  controllers: [CartController],
  exports: [CartService],
  providers: [CartService],
})
export class CartModule {}
