import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  imports: [DatabaseModule]
})
export class SubcategoryModule {}
