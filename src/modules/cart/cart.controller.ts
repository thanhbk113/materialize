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
    return this.CartService.findCartById(req.user.id);
  }

  @Post("/add")
  @Auth()
  async addToCart(@Req() req, @Body() addToCartDto: AddToCartDto) {
    console.log(req.user);

    return this.CartService.addToCart(req.user, addToCartDto);
  }
}
