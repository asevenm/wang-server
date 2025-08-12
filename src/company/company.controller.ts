import {
  Controller,
  Get,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  findOne() {
    return this.companyService.findOne();
  }

  @Put()
  @UseInterceptors(
    FileInterceptor('wechatQrCodeFile', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Body() dto: CreateCompanyDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.wechatQrCode = file.filename;
    }
    return this.companyService.update(dto);
  }
}