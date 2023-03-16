import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { PageDto } from "../../common/dto/page.dto";
import { queryPagination } from "../../common/utils";
import {
  CreateItemDto,
  ItemDetailResponseDto,
  ListItemResponseDto,
  UpdateItemDto,
  UpdateItemResponseDto,
} from "./dtos/item.dto";

import { ItemEntity } from "./item.entity";

interface ItemServiceInterface {
  search(pageOptionsDto: PageOptionsDto): Promise<PageDto<ListItemResponseDto>>;
  create(itemDto: CreateItemDto): Promise<ItemDetailResponseDto>;
  update(updateItemDto: UpdateItemDto): Promise<UpdateItemResponseDto>;
  getOneItemById(id: string): Promise<ItemDetailResponseDto>;
  deleteOneItemById(id: string): Promise<void>;
  suggest(keyword: string): Promise<ListItemResponseDto[]>;
}

@Injectable()
export class ItemService implements ItemServiceInterface {
  private readonly logger: Logger = new Logger(ItemService.name);
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) {}

  async search(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ListItemResponseDto>> {
    const qb = this.itemRepository.createQueryBuilder("item");

    const [items, itemCount] = await queryPagination<ItemEntity>({
      query: qb,
      o: pageOptionsDto,
    });

    return new PageDto<ListItemResponseDto>(
      items,
      new PageMetaDto({
        itemCount,
        pageOptionsDto,
      }),
    );
  }

  async create(itemDto: CreateItemDto): Promise<ItemDetailResponseDto> {
    // create unique sku with prefix "SKU" like "SKU-1234567890"
    let unique = false;
    let sku = "";
    while (!unique) {
      sku = `SKU-${Math.floor(Math.random() * 10000000000)}`;
      const rs = await this.itemRepository.findOneBy({ sku: sku });
      if (!rs) {
        unique = true;
      }
    }

    const item = this.itemRepository.create({
      ...itemDto,
      sku: sku,
    });

    const rs = await this.itemRepository.save(item);
    return {
      ...rs,
      available: rs.stock > 0,
    };
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

  async getOneItemById(id: string): Promise<ItemDetailResponseDto> {
    const rs = await this.itemRepository.findOneBy({ id: id });
    return {
      ...rs,
      available: rs.stock > 0,
    };
  }

  async deleteOneItemById(id: string): Promise<void> {
    await this.itemRepository.softDelete({ id: id });
  }

  async suggest(keyword: string): Promise<ListItemResponseDto[]> {
    const rs = await this.itemRepository
      .createQueryBuilder("item")
      .where("item.name ILIKE :keyword", { keyword: `%${keyword}%` })
      .getMany();

    return rs.map(item => ({
      ...item,
      available: item.stock > 0,
    }));
  }
}
