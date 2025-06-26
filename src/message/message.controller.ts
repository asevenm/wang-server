import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    const message = await this.messageService.create(createMessageDto);
    return {
      success: true,
      message: '留言提交成功',
      data: message,
    };
  }

  @Post('list')
  async findAll(
    @Body()
    body: {
      page?: number;
      pageSize?: number;
      status?: number;
      name?: string;
      email?: string;
      phone?: string;
    },
  ) {
    return this.messageService.findAll(
      body.page,
      body.pageSize,
      body.status,
      body.name,
      body.email,
      body.phone,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const message = await this.messageService.findOne(id);
    if (!message) {
      throw new NotFoundException('留言不存在');
    }
    return message;
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: number) {
    const message = await this.messageService.markAsRead(id);
    if (!message) {
      throw new NotFoundException('留言不存在');
    }
    return {
      success: true,
      message: '已标记为已读',
      data: message,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.messageService.remove(id);
    return {
      success: true,
      message: '留言已删除',
    };
  }
}
