import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { Auth } from "../../decorators";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dtos/cart.dto";

@Controller("cart")
export class CartController {
  constructor(private CartService: CartService) {}

  @Get("/")
  @Auth()
  async findUserCart(@Req() req) {
    return this.CartService.findUserCart(req.user.id);
  }

  @Post("/add")
  @Auth()
  async addToCart(@Req() req, @Body() addToCartDto: AddToCartDto) {
    return this.CartService.addToCart(req.user.id, addToCartDto);
  }
}
