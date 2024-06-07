import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
    constructor(private readonly databaseService: DatabaseService) { }

    create(createCategoryDto: Prisma.CategoryCreateInput) {
        return this.databaseService.category.create({
            data: createCategoryDto
        })
    }

    findAll() {
        return this.databaseService.category.findMany()
    }

    findOne(id: string) {
        return this.databaseService.category.findUnique({
            where: {
                id
            }
        })
    }

    update(id: string, updateCategoryDto: Prisma.CategoryUpdateInput) {
        return this.databaseService.category.update({
            where: {
                id
            },
            data: updateCategoryDto
        })
    }

    remove(id: string) {
        return this.databaseService.category.delete({
            where: {
                id
            }
        })
    }
}
