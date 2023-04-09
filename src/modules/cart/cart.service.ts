import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
// import { ValidatorService } from '../../shared/services/validator.service';
import type { AddToCartDto } from "./dtos/cart.dto";
import { CartEntity } from "./cart.entity";
import { CartItemEntity } from "./cart-item.entity";

@Injectable()
export class CartService {
  private readonly logger: Logger = new Logger(CartService.name);
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>,
  ) {}

  findCartById(cartId: string): Promise<CartEntity> {
    return this.cartRepository.findOne({ where: { id: cartId } });
  }

  async addToCart(
    cartId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartEntity> {
    let cart = await this.findCartById(cartId);
    let cartItems = addToCartDto.items.map(item => {
      return this.cartItemRepository.save({
        cart,
        quantity: item.quantity,
        item: { id: item.itemId },
      });
    });

    await Promise.all(cartItems);

    return cart;
  }

  async createCart(): Promise<CartEntity> {
    return this.cartRepository.save({});
  }
}
