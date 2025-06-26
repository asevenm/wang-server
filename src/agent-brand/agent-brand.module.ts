import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentBrand } from './entities/agent-brand.entity';
import { AgentBrandService } from './agent-brand.service';
import { AgentBrandController } from './agent-brand.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AgentBrand])],
  providers: [AgentBrandService],
  controllers: [AgentBrandController],
})
export class AgentBrandModule {}
