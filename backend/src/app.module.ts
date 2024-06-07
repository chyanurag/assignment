import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [ProductModule, DatabaseModule, CategoryModule, SubcategoryModule, TaskModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
