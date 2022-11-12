import { Controller, Get, Post, Put } from "@nestjs/common";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { PageDto } from "../../common/dto/page.dto";
import {
  CreateItemDto,
  ItemDto,
  UpdateItemDto,
  UpdateItemResponseDto,
} from "./dtos/item.dto";
import { ItemService } from "./item.service";

@Controller("item")
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get("/search")
  async search(pageOptions: PageOptionsDto): Promise<PageDto<ItemDto>> {
    return await this.itemService.search(pageOptions);
  }

  @Post("/create")
  async create(createItemDto: CreateItemDto): Promise<ItemDto> {
    return await this.itemService.create(createItemDto);
  }

  @Put("/update")
  async update(updateItemDto: UpdateItemDto): Promise<UpdateItemResponseDto> {
    return await this.itemService.update(updateItemDto);
  }
}
