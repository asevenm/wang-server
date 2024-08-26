import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { InstrumentService } from './instrument.service';
import {
  CreateInstrumentDto,
  ListPaginationDto,
  UpdateInstrumentDto,
} from './instrument.dto';
import { PayloadUser } from 'src/utils/user';

@Controller('instrument')
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Post('save')
  saveOrUpdate(
    @Body() dto: CreateInstrumentDto & UpdateInstrumentDto,
    @PayloadUser() user,
  ) {
    if (dto.id) {
      return this.instrumentService.update(dto.id, {
        ...dto,
        updator: user.username,
        creator: user.username,
      });
    }
    return this.instrumentService.create({
      ...dto,
      creator: user.username,
      updator: user.username,
    });
  }

  @Post('list')
  async findAll(@Body() dto: ListPaginationDto) {
    const { page, ...params } = dto;
    const dataSource = await this.instrumentService.findAll(params, page);
    return { ...dataSource.meta, list: dataSource.items };
  }

  @Get('delete/:id')
  delete(@Param('id') id: string) {
    return this.instrumentService.delete(+id);
  }

  @Get('detail/:id')
  findOne(@Param('id') id) {
    return this.instrumentService.findOne(+id);
  }

  @Post('type/save')
  saveOrUpdateType(@Body() dto) {
    if (dto.id) {
      return this.instrumentService.updateType(dto.id, { ...dto });
    }
    return this.instrumentService.createType(dto);
  }

  @Get('types')
  findAllTypes() {
    return this.instrumentService.findAllType();
  }

  @Get('type/delete/:id')
  deleteType(@Param('id') id) {
    return this.instrumentService.deleteType(+id);
  }

  @Get('type-with-products')
  async getAllTypesWithProduct() {
    return this.instrumentService.getAllTypesWithProducts();
  }
}
