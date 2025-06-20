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

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Message> {
    return this.messageRepository.findOne({ where: { id } });
  }

  async markAsRead(id: number): Promise<Message> {
    const message = await this.findOne(id);
    if (!message) {
      return null;
    }
    message.isRead = true;
    return this.messageRepository.save(message);
  }

  async remove(id: number): Promise<void> {
    await this.messageRepository.delete(id);
  }
}
