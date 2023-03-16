import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { PageDto } from "../../common/dto/page.dto";
import {
  CreateItemDto,
  ItemDetailResponseDto,
  ListItemResponseDto,
  UpdateItemDto,
  UpdateItemResponseDto,
} from "./dtos/item.dto";
import { ItemService } from "./item.service";

@Controller("item")
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get("/search")
  async search(
    @Query(new ValidationPipe({ transform: true }))
    pageOptions: PageOptionsDto,
  ): Promise<PageDto<ListItemResponseDto>> {
    return await this.itemService.search(pageOptions);
  }

  @Get("/suggest")
  async suggest(
    @Query("keyword") keyword: string,
  ): Promise<ListItemResponseDto[]> {
    return await this.itemService.suggest(keyword);
  }

  @Post("/create")
  async create(
    @Body() createItemDto: CreateItemDto,
  ): Promise<ItemDetailResponseDto> {
    return await this.itemService.create(createItemDto);
  }

  @Get("/:id")
  async get(@Query("id") id: string): Promise<ItemDetailResponseDto> {
    return await this.itemService.getOneItemById(id);
  }

  @Delete("/:id")
  async delete(@Query("id") id: string): Promise<void> {
    return await this.itemService.deleteOneItemById(id);
  }

  @Put("/update")
  async update(
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<UpdateItemResponseDto> {
    return await this.itemService.update(updateItemDto);
  }
}
