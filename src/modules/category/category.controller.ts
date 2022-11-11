import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { PageDto } from '../../common/dto/page.dto';
import { CategoryEntity } from './category.entity';
import { CategoryService } from './category.service';
import {
  CategoryDto,
  CreateChildCategoryDto,
  CreateParentCategoryDto,
  UpdateCategoryDto,
} from './dtos/category.dto';

@Controller('cat')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  async getCategories(): Promise<PageDto<CategoryDto>> {
    return this.categoryService.getCategories();
  }

  @Post('/create-parent-category')
  async createCategory(@Body() request: CreateParentCategoryDto) {
    return this.categoryService.createParentCategory(request);
  }

  @Post('/create-child-category')
  async createChildCategory(@Body() request: CreateChildCategoryDto) {
    return this.categoryService.createChildCategory(request);
  }

  @Put('/update-category')
  async updateCategory(@Body() request: UpdateCategoryDto) {
    return this.categoryService.updateCategory(request);
  }
}
