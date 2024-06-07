import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SubcategoryService {
    constructor(private readonly databaseService: DatabaseService)  {}

    create(createSubcategoryDto: Prisma.CategoryCreateInput) {
        return this.databaseService.category.create({
            data: createSubcategoryDto
        })
    }

    findAll() {
        return this.databaseService.category.findMany({
            where: {
                parentId: {
                    not: null
                }
            }
        })
    }

    findOne(id: string) {
        return this.databaseService.category.findUnique({
            where: {
                id
            }
        })
    }

    update(id: string, updateSubcategoryDto: Prisma.ProjectUpdateInput) {
        return this.databaseService.category.update({
            where: {
                id
            },
            data: updateSubcategoryDto
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
