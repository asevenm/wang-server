import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { ServiceCategoryService } from './service-category.service';
import { ServiceCategoryController } from './service-category.controller';
import { Service } from './entities/service.entity';
import { ServiceCategory } from './entities/service-category.entity';
import { ServiceImage } from './entities/service-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceCategory, ServiceImage])],
  controllers: [ServiceController, ServiceCategoryController],
  providers: [ServiceService, ServiceCategoryService],
  exports: [ServiceService, ServiceCategoryService],
})
export class ServiceModule {}
