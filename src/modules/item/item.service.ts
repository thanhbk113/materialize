import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { PageDto } from "../../common/dto/page.dto";
import { queryPagination } from "../../common/utils";
import {
  CreateItemDto,
  ItemDto,
  UpdateItemDto,
  UpdateItemResponseDto,
} from "./dtos/item.dto";

import { ItemEntity } from "./item.entity";

@Injectable()
export class ItemService {
  private readonly logger: Logger = new Logger(ItemService.name);
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) {}

  async search(pageOptionsDto: PageOptionsDto): Promise<PageDto<ItemDto>> {
    const qb = this.itemRepository.createQueryBuilder("item");

    const [items, itemCount] = await queryPagination<ItemEntity>({
      query: qb,
      o: pageOptionsDto,
    });

    return new PageDto<ItemEntity>(
      items,
      new PageMetaDto({
        itemCount,
        pageOptionsDto,
      }),
    );
  }

  async create(itemDto: CreateItemDto): Promise<ItemDto> {
    const item = this.itemRepository.create(itemDto);

    return this.itemRepository.save(item);
  }

  async update(updateItemDto: UpdateItemDto): Promise<UpdateItemResponseDto> {
    const u = await this.itemRepository
      .createQueryBuilder()
      .update({
        cost: updateItemDto.cost,
        price: updateItemDto.price,
        name: updateItemDto.name,
        description: updateItemDto.description,
        images: updateItemDto.images,
      })
      .where("id = :id", { id: updateItemDto.id })
      .returning("*")
      .execute();

    return {
      message: "Item updated successfully",
    };
  }
}
