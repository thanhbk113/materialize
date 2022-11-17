import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import type { FindOptionsWhere } from "typeorm";
import { Repository } from "typeorm";
import { PageDto } from "../../common/dto/page.dto";
// import { ValidatorService } from '../../shared/services/validator.service';
import type { AddToCartDto, CartDto } from "./dtos/cart.dto";
import { CartEntity } from "./cart.entity";
import { queryPagination } from "../../common/utils";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
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

  findUserCart(userId: string): Promise<CartEntity> {
    return this.cartRepository.findOne({ where: { userId } });
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartEntity> {
    let cart = await this.cartRepository.findOne({ where: { userId } });
    if (!cart) {
      cart = await this.cartRepository.save({ userId });
    }
    let cartItems = addToCartDto.items.map(item => {
      return this.cartItemRepository.save({
        cart,
        quantity: item.quantity,
        userId,
        item: { id: item.itemId },
      });
    });

    await Promise.all(cartItems);

    return cart;
  }
}
