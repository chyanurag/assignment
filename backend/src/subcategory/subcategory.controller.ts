import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { Prisma } from '@prisma/client';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  create(@Body() createSubcategoryDto: Prisma.CategoryCreateInput) {
    return this.subcategoryService.create(createSubcategoryDto);
  }

  @Get()
  findAll() {
    return this.subcategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubcategoryDto: Prisma.CategoryCreateInput) {
    return this.subcategoryService.update(id, updateSubcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoryService.remove(id);
  }
}
