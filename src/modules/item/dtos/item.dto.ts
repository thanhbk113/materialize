import { BaseDto } from "../../../common/abstract.dto";
import { BaseResponseDto } from "../../../common/dto/page.dto";
import { CategoryDto } from "../../category/dtos/category.dto";

export class ItemDto extends BaseDto {
  name: string;

  description: string;

  price: number;

  cost: number;

  images: string[];

  category: CategoryDto;
}

export class UpdateItemDto {
  id: string;

  name: string;

  description: string;

  price: number;

  cost: number;

  images: string[];

  category: string;
}

export class UpdateItemResponseDto extends BaseResponseDto {}

export class CreateItemDto {
  name: string;

  description: string;

  price: number;

  cost: number;

  images: string[];

  categoryId: string;
}
