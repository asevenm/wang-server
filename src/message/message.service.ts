import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(message);
  }

  // 分页查询
  async findAll(
    page = 1,
    pageSize = 10,
    status?: number,
    name?: string,
    email?: string,
    phone?: string,
  ) {
    const qb = this.messageRepository.createQueryBuilder('message');
    if (status) {
      qb.andWhere('message.status = :status', { status });
    }
    if (name) {
      qb.andWhere('message.name LIKE :name', { name: `%${name}%` });
    }
    if (email) {
      qb.andWhere('message.email LIKE :email', { email: `%${email}%` });
    }
    if (phone) {
      qb.andWhere('message.phone LIKE :phone', { phone: `%${phone}%` });
    }
    qb.orderBy('message.createAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async findOne(id: number): Promise<Message> {
    return this.messageRepository.findOne({ where: { id } });
  }

  async markAsRead(id: number): Promise<Message> {
    const message = await this.findOne(id);
    if (!message) {
      return null;
    }
    message.status = 1;
    return this.messageRepository.save(message);
  }

  async remove(id: number): Promise<void> {
    await this.messageRepository.delete(id);
  }
}
