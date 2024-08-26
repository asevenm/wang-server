import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationParams } from 'src/types/common';

export class CreateInstrumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // 可选字段，可能用于嵌套创建产品时带上图片、功能和模型
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images?: CreateImageDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureDto)
  features?: CreateFeatureDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModelDto)
  models?: CreateModelDto[];

  @IsNumber()
  @IsNotEmpty()
  typeId: number;

  @IsString()
  @IsNotEmpty()
  creator: string;

  @IsString()
  @IsNotEmpty()
  updator: string;
}

export class CreateImageDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  description: string;
}

export class CreateFeatureDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureImageDto)
  images?: CreateFeatureImageDto[];
}

export class CreateFeatureImageDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  description: string;
}

export class CreateModelDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateParameterDto)
  params: CreateParameterDto[];
}

export class CreateTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}

export class CreateParameterDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdateInstrumentDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images?: CreateImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureDto)
  features?: CreateFeatureDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModelDto)
  models?: CreateModelDto[];

  @IsOptional()
  @IsNumber()
  typeId?: number;

  @IsString()
  @IsNotEmpty()
  updator: string;

  @IsString()
  @IsNotEmpty()
  creator: string;
}

export class UpdateTypeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  parentId?: number;
}

export class ListPaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  type?: number;

  page?: PaginationParams;
}
