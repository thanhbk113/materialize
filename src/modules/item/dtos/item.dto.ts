import { BaseRequestDto, BaseResponseDto } from "../../../common/abstract.dto";
import { BaseResponse } from "../../../common/dto/page.dto";
import { CategoryDto } from "../../category/dtos/category.dto";

export class ItemResponseBaseDto extends BaseResponseDto {
  name: string;
  description: string;
  price: number;
  cost: number;
  images: string[];
}

export class ItemRequestBaseDto extends BaseRequestDto {
  name: string;
  description: string;
  price: number;
  cost: number;
  images: string[];
  details: string;
  categoriesId: string[];
}

export class ItemDetailResponseDto extends ItemResponseBaseDto {
  details: string;
  categories: CategoryDto[];
  available: boolean;
  stock: number;
  quantity: number;
}

export class ListItemResponseDto extends ItemResponseBaseDto {}

export class UpdateItemDto extends ItemRequestBaseDto {
  id: string;
}

export class UpdateItemResponseDto extends BaseResponse {}

export class CreateItemDto extends ItemRequestBaseDto {}
