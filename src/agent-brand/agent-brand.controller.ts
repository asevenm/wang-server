import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { AgentBrandService } from './agent-brand.service';
import { CreateAgentBrandDto } from './dto/create-agent-brand.dto';

@Controller('agent-brand')
export class AgentBrandController {
  constructor(private readonly agentBrandService: AgentBrandService) {}

  @Post()
  create(@Body() dto: CreateAgentBrandDto) {
    return this.agentBrandService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateAgentBrandDto) {
    return this.agentBrandService.update(id, dto);
  }

  @Get()
  findAll() {
    return this.agentBrandService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agentBrandService.remove(id);
  }
}
