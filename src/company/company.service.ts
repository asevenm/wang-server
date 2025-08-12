import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async findOne(): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: {} });
    if (!company) {
      // 如果没有公司信息，创建一个默认的
      return this.companyRepository.create({});
    }
    return company;
  }

  async update(dto: CreateCompanyDto): Promise<Company> {
    let company = await this.companyRepository.findOne({ where: {} });
    
    if (!company) {
      // 如果不存在，创建新的公司信息
      company = this.companyRepository.create(dto);
      return this.companyRepository.save(company);
    } else {
      // 更新现有的公司信息
      await this.companyRepository.update(company.id, dto);
      return this.companyRepository.findOne({ where: { id: company.id } });
    }
  }
}