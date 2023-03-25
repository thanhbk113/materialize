import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { FindOptionsWhere } from "typeorm";
import { Repository } from "typeorm";

import type {
  CategoryDto,
  CreateChildCategoryDto,
  CreateParentCategoryDto,
  UpdateCategoryDto,
} from "./dtos/category.dto";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { CategoryEntity } from "./category.entity";
import { PageDto } from "../../common/dto/page.dto";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private catRepository: Repository<CategoryEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getCategories(): Promise<PageDto<CategoryDto>> {
    const [categories, total] = await this.catRepository.findAndCount({
      relations: ["children"],
    });
    const pageMetaDto = new PageMetaDto({ itemCount: total });
    return new PageDto<CategoryDto>(categories, pageMetaDto);
  }

  async createParentCategory(
    parentCategory: CreateParentCategoryDto,
  ): Promise<CategoryEntity> {
    return this.catRepository.save(parentCategory);
  }

  async createChildCategory(childCategory: CreateChildCategoryDto) {
    return this.catRepository.save(childCategory);
  }

  async updateCategory(category: UpdateCategoryDto) {
    const { id, ...updateCategory } = category;
    const { affected } = await this.catRepository.update(id, updateCategory);
    if (affected === 0) {
      throw new BadRequestException(`Category with id ${id} not found`);
    }
    return this.catRepository.findOne({ where: { id } });
  }

  async deleteCategory(id: string) {
    const { affected } = await this.catRepository.delete(id);
    if (affected === 0) {
      throw new CustomHttpException({
        code: StatusCodesList.CategoryNotFound,
        message: "",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }
}
