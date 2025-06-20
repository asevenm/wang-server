import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  Body,
  NotFoundException,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string = 'file',
    @Body('description') description?: string,
  ) {
    // 根据mimetype自动判断文件类型
    if (!type) {
      if (file.mimetype.startsWith('image/')) {
        type = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        type = 'video';
      } else if (file.mimetype.startsWith('audio/')) {
        type = 'audio';
      } else if (
        file.mimetype.includes('pdf') ||
        file.mimetype.includes('document')
      ) {
        type = 'document';
      }
    }

    const savedFile = await this.fileService.saveFile(file, type, description);
    return {
      id: savedFile.id,
      filename: savedFile.filename,
      originalname: savedFile.originalname,
      mimetype: savedFile.mimetype,
      size: savedFile.size,
      url: this.fileService.getFileUrl(savedFile.filename),
      type: savedFile.type,
      description: savedFile.description,
      createdAt: savedFile.createdAt,
    };
  }

  @Get()
  async getAllFiles(@Query('type') type?: string) {
    const files = await this.fileService.findAll(type);
    return files.map((file) => ({
      ...file,
      url: this.fileService.getFileUrl(file.filename),
    }));
  }

  @Get(':id')
  async getFileById(@Param('id') id: number, @Res() res: Response) {
    const file = await this.fileService.findOne(id);
    if (!file) {
      throw new NotFoundException('文件不存在');
    }
    res.sendFile(join(process.cwd(), file.path));
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: number, @Res() res: Response) {
    const file = await this.fileService.findOne(id);
    if (!file) {
      throw new NotFoundException('文件不存在');
    }
    res.download(join(process.cwd(), file.path), file.originalname);
  }

  @Delete(':id')
  async removeFile(@Param('id') id: number) {
    await this.fileService.remove(id);
    return { success: true };
  }
}
