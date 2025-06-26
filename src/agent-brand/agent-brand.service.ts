import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentBrand } from './entities/agent-brand.entity';
import { CreateAgentBrandDto } from './dto/create-agent-brand.dto';

@Injectable()
export class AgentBrandService {
  constructor(
    @InjectRepository(AgentBrand)
    private agentBrandRepository: Repository<AgentBrand>,
  ) {}

  create(dto: CreateAgentBrandDto) {
    const brand = this.agentBrandRepository.create(dto);
    return this.agentBrandRepository.save(brand);
  }

  update(id: string, dto: CreateAgentBrandDto) {
    return this.agentBrandRepository.update(id, dto);
  }

  findAll() {
    return this.agentBrandRepository.find({
      order: { id: 'DESC' },
    });
  }

  remove(id: string) {
    return this.agentBrandRepository.delete(id);
  }
}
