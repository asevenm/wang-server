import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { existsSync, mkdirSync } from 'fs';
import { File } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {
    // 确保上传目录存在
    if (!existsSync('./uploads')) {
      mkdirSync('./uploads', { recursive: true });
    }
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  async saveFile(
    file: Express.Multer.File,
    type: string = 'file',
    description?: string,
  ): Promise<File> {
    const fileEntity = new File();
    fileEntity.filename = file.filename;
    fileEntity.originalname = file.originalname;
    fileEntity.mimetype = file.mimetype;
    fileEntity.size = file.size;
    fileEntity.path = `uploads/${file.filename}`;
    fileEntity.url = `/uploads/${file.filename}`;
    fileEntity.description = description;
    fileEntity.type = type;

    return this.fileRepository.save(fileEntity);
  }

  async findAll(type?: string): Promise<File[]> {
    if (type) {
      return this.fileRepository.find({ where: { type } });
    }
    return this.fileRepository.find();
  }

  async findOne(id: number): Promise<File> {
    return this.fileRepository.findOne({ where: { id } });
  }

  async findByFilename(filename: string): Promise<File> {
    return this.fileRepository.findOne({ where: { filename } });
  }

  async remove(id: number): Promise<void> {
    await this.fileRepository.delete(id);
  }
}
