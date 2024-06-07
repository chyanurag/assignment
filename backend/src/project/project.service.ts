import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
    constructor(private readonly databaseService: DatabaseService) {}

  create(createProjectDto: Prisma.ProjectCreateInput) {
      return this.databaseService.project.create({
          data: createProjectDto
      })
  }

  findAll() {
      return this.databaseService.project.findMany()
  }

  findOne(id: string) {
      return this.databaseService.project.findUnique({
          where: {
              id
          }
      })
  }

  update(id: string, updateProjectDto: Prisma.ProjectUpdateInput) {
      return this.databaseService.project.update({
        where: {
            id
        },
        data: updateProjectDto
      })
  }

  remove(id: string) {
      return this.databaseService.project.delete({
          where: {
              id
          }
      })
  }
}
