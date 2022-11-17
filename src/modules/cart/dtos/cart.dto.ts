import { BaseDto } from "../../../common/abstract.dto";

export class CartDto extends BaseDto {}

export class AddToCartDto {
  items: ItemAddToCartDto[];
}

export class ItemAddToCartDto {
  itemId: string;
  quantity: number;
}
