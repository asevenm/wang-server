import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Instrument } from './entities/instrument.entity';
import {
  CreateFeatureDto,
  CreateInstrumentDto,
  CreateModelDto,
  CreateParameterDto,
  CreateTypeDto,
  ListPaginationDto,
  UpdateInstrumentDto,
  UpdateTypeDto,
  CreateFeatureImageDto,
} from './instrument.dto';
import { PaginationParams } from 'src/types/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CustomPaginationMeta } from 'src/utils/pagination';
import { Type } from './entities/type.entity';
import { Model } from './entities/model.entity';
import { Feature } from './entities/feature.entity';
import { Image } from './entities/image.entity';
import { FeatureImage } from './entities/featureImage.entity';
import { Parameter } from './entities/parameter.entity';

@Injectable()
export class InstrumentService {
  constructor(
    @InjectRepository(Instrument)
    private instrumentRepository: Repository<Instrument>,
    @InjectRepository(Type)
    private typeRepository: TreeRepository<Type>,
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(FeatureImage)
    private featureImageRepository: Repository<FeatureImage>,
    @InjectRepository(Parameter)
    private paramRepository: Repository<Parameter>,
  ) {}

  async createType(dto: CreateTypeDto) {
    const type = await this.typeRepository.create(dto);
    if (dto.parentId) {
      const parent = await this.typeRepository.findOne({
        where: { id: dto.parentId },
      });
      type.parent = parent;
    }

    return this.typeRepository.save(type);
  }

  async updateType(id: number, dto: UpdateTypeDto) {
    const type = await this.typeRepository.findOne({ where: { id } });
    if (!type) {
      throw new NotFoundException(`Type with Id ${id} not found`);
    }
    if (dto.parentId) {
      const parent = await this.typeRepository.findOne({
        where: { id: dto.parentId },
      });
      if (parent) {
        type.parent = parent;
      }
    }
    Object.assign(type, dto);

    return this.typeRepository.save(type);
  }

  async create(dto: CreateInstrumentDto) {
    const instrument = this.instrumentRepository.create(dto);

    if (dto.typeId) {
      const type = await this.typeRepository.findOne({
        where: { id: dto.typeId },
      });
      if (type) {
        instrument.type = type;
      }
    }

    if (dto.models) {
      instrument.models = [];
      for (const modelDto of dto.models) {
        const model = this.modelRepository.create({
          ...modelDto,
          params: modelDto.params?.map((paramDto) =>
            this.paramRepository.create(paramDto),
          ),
        });
        instrument.models.push(model);
      }
    }

    if (dto.features) {
      instrument.features = [];
      for (const featureDto of dto.features) {
        const feature = this.featureRepository.create({
          ...featureDto,
          images: featureDto.images?.map((imageDto) =>
            this.featureImageRepository.create(imageDto),
          ),
        });
        instrument.features.push(feature);
      }
    }

    if (dto.images) {
      instrument.images = [];
      for (const imageDto of dto.images) {
        const image = this.imageRepository.create(imageDto);
        instrument.images.push(image);
      }
    }

    return this.instrumentRepository.save(instrument);
  }

  async update(id: number, dto: UpdateInstrumentDto) {
    const instrument = await this.instrumentRepository.findOne({
      where: { id },
      relations: ['type', 'features', 'models', 'images'],
    });
    if (!instrument) {
      throw new NotFoundException(`Instrument with Id ${id} not found`);
    }
    if (dto.typeId) {
      const type = await this.typeRepository.findOne({
        where: { id: dto.typeId },
      });
      if (type) {
        instrument.type = type;
      }
    }
    // if (dto.models) {
    //   await this.updateModels(instrument, dto.models);
    // }
    // if (dto.features) {
    //   await this.updateFeatures(instrument, dto.features);
    // }
    // console.log(instrument);
    Object.assign(instrument, dto);
    // console.log('dto', instrument, dto);
    return this.instrumentRepository.save(instrument);
  }

  private async updateFeatures(
    instrument: Instrument,
    featureDtos: CreateFeatureDto[],
  ) {
    const existingFeatures = await this.featureRepository.find({
      where: { instrument: { id: instrument.id } },
    });
    const featuresToUpdate: any[] = [];
    const featuresToCreate: CreateFeatureDto[] = [];
    const featuresToDelete = existingFeatures.filter(
      (existingFeature) =>
        !featureDtos.some((featureDto) => featureDto.id === existingFeature.id),
    );
    for (const featureDto of featureDtos) {
      const existingFeature = existingFeatures.find(
        (existingFeature) => existingFeature.id === featureDto.id,
      );
      if (existingFeature) {
        featuresToUpdate.push({ existingFeature, featureDto });
      } else {
        featuresToCreate.push(featureDto);
      }
    }
    for (const { existingFeature, featureDto } of featuresToUpdate) {
      existingFeature.text = featureDto.text;
      existingFeature.images = await this.updateFeatureImages(
        existingFeature,
        featureDto.images || [],
      );
      await this.featureRepository.save(existingFeature);
    }

    for (const featureDto of featuresToCreate) {
      const feature = this.featureRepository.create(featureDto);
      if (featureDto.images) {
        feature.images = await this.createFeatureImages(featureDto.images);
      }
      // feature.instrument = instrument;
      instrument.features.push(feature);
    }

    for (const feature of featuresToDelete) {
      await this.featureRepository.remove(feature);
    }
  }

  private async createFeatureImages(imageDtos: CreateFeatureImageDto[]) {
    const images: FeatureImage[] = [];
    for (const imageDto of imageDtos) {
      const image = this.featureImageRepository.create(imageDto);
      images.push(image);
    }
    return images;
  }

  private async updateFeatureImages(
    feature: Feature,
    imageDtos: CreateFeatureImageDto[],
  ) {
    const existingImages = await this.featureImageRepository.find({
      where: { feature: { id: feature.id } },
    });
    const imagesToUpdate: any[] = [];
    const imagesToCreate: CreateFeatureImageDto[] = [];
    const imagesToDelete = existingImages.filter(
      (existingImage) =>
        !imageDtos.some((imageDto) => imageDto.id === existingImage.id),
    );
    for (const imageDto of imageDtos) {
      const existingImage = existingImages.find(
        (existingImage) => existingImage.id === imageDto.id,
      );
      if (existingImage) {
        imagesToUpdate.push({ existingImage, imageDto });
      } else {
        imagesToCreate.push(imageDto);
      }
    }

    for (const { existingImage, imageDto } of imagesToUpdate) {
      existingImage.url = imageDto.url;
      await this.featureImageRepository.save(existingImage);
    }

    for (const imageDto of imagesToCreate) {
      const image = this.featureImageRepository.create(imageDto);
      feature.images.push(image);
    }

    for (const image of imagesToDelete) {
      await this.featureImageRepository.remove(image);
    }
  }

  private async updateModels(
    instrument: Instrument,
    modelsDto: CreateModelDto[],
  ): Promise<void> {
    const existingModels = await this.modelRepository.find({
      where: { instrument: { id: instrument.id } },
    });
    const modelsToUpdate: any[] = [];
    const modelsToCreate: CreateModelDto[] = [];
    const modelsToDelete = existingModels.filter(
      (existingModel) =>
        !modelsDto.some((modelDto) => modelDto.id === existingModel.id),
    );
    for (const modelDto of modelsDto) {
      const existingModel = existingModels.find(
        (existingModel) => existingModel.id === modelDto.id,
      );
      if (existingModel) {
        modelsToUpdate.push({ existingModel, modelDto });
      } else {
        modelsToCreate.push(modelDto);
      }
    }

    for (const { existingModel, modelDto } of modelsToUpdate) {
      existingModel.name = modelDto.name;
      existingModel.params = await this.updateParams(
        existingModel,
        modelDto.params ?? [],
      );
      await this.modelRepository.save(existingModel);
    }

    for (const modelDto of modelsToCreate) {
      const model = this.modelRepository.create(modelDto);
      instrument.models.push(model);
    }

    for (const model of modelsToDelete) {
      await this.modelRepository.delete(model);
    }
  }

  private async updateParams(model: Model, paramsDto: CreateParameterDto[]) {
    const existingParams = await this.paramRepository.find({
      where: { model: { id: model.id } },
    });
    const paramsToUpdate: any[] = [];
    const paramsToCreate: CreateParameterDto[] = [];
    const paramsToDelete = existingParams.filter(
      (existingParam) =>
        !paramsDto.some((paramDto) => paramDto.id === existingParam.id),
    );
    for (const paramDto of paramsDto) {
      const existingParam = existingParams.find(
        (existingParam) => existingParam.id === paramDto.id,
      );
      if (existingParam) {
        paramsToUpdate.push({ existingParam, paramDto });
      } else {
        paramsToCreate.push(paramDto);
      }
    }

    for (const { existingParam, paramDto } of paramsToUpdate) {
      existingParam.value = paramDto.value;
      existingParam.name = paramDto.name;
      await this.paramRepository.save(existingParam);
    }

    for (const paramDto of paramsToCreate) {
      const param = this.paramRepository.create(paramDto);
      model.params.push(param);
    }

    for (const param of paramsToDelete) {
      await this.paramRepository.remove(param);
    }

    return this.paramRepository.find({ where: { model: { id: model.id } } });
  }

  async getAllInstrument(searchParams: { typeType?: 1 | 2 }) {
    const queryBuilder = this.instrumentRepository
      .createQueryBuilder('instrument')
      .leftJoinAndSelect('instrument.type', 'type')
      .leftJoinAndSelect('instrument.features', 'feature')
      .leftJoinAndSelect('instrument.images', 'images')
      .leftJoinAndSelect('instrument.models', 'model')
      .leftJoinAndSelect('model.params', 'param')
      .distinct(true);

    if (searchParams.typeType) {
      queryBuilder.andWhere('type.type = :typeType', {
        typeType: searchParams.typeType,
      });
    }
    return queryBuilder.getMany();
  }

  async findAll(
    searchParams: ListPaginationDto,
    page?: PaginationParams,
  ): Promise<Pagination<Instrument, CustomPaginationMeta>> {
    const queryBuilder = this.instrumentRepository
      .createQueryBuilder('instrument')
      .leftJoinAndSelect('instrument.type', 'type')
      .leftJoinAndSelect('instrument.features', 'feature')
      .leftJoinAndSelect('instrument.images', 'images')
      .leftJoinAndSelect('instrument.models', 'model')
      .leftJoinAndSelect('model.params', 'param')
      .distinct(true);

    if (searchParams.name) {
      queryBuilder.andWhere('instrument.name like :name', {
        name: `%${searchParams.name}%`,
      });
    }

    if (searchParams.type) {
      queryBuilder.andWhere('type.id = :type', { type: searchParams.type });
    }

    if (searchParams.typeType) {
      queryBuilder.andWhere('type.type = :typeType', {
        typeType: searchParams.typeType,
      });
    }

    const totalQuery = this.instrumentRepository
      .createQueryBuilder('instrument')
      .leftJoin('instrument.type', 'type')
      .leftJoin('instrument.features', 'feature')
      .leftJoin('instrument.models', 'model')
      .leftJoin('instrument.images', 'image')
      .select('COUNT(DISTINCT instrument.id)', 'count');

    if (searchParams.name) {
      totalQuery.andWhere('instrument.name like :name', {
        name: `%${searchParams.name}%`,
      });
    }

    if (searchParams.type) {
      totalQuery.andWhere('type.id = :type', { type: searchParams.type });
    }

    if (searchParams.typeType) {
      totalQuery.andWhere('type.type = :typeType', {
        typeType: searchParams.typeType,
      });
    }

    const totalCountResult = await totalQuery.getRawOne();
    const totalCount = parseInt(totalCountResult.count, 10);

    // 2. Paginated data query
    const items = await queryBuilder
      .skip((page.currentPage - 1) * page.pageSize)
      .take(page.pageSize)
      .getMany();

    // Create pagination meta
    const paginationMeta = new CustomPaginationMeta(
      page.currentPage,
      page.pageSize,
      Math.ceil(totalCount / page.pageSize),
      totalCount,
    );

    return {
      items,
      meta: paginationMeta,
    };
  }

  findOne(id: number) {
    return this.instrumentRepository.findOne({
      where: { id },
      relations: ['type', 'features', 'images', 'models', 'models.params'],
    });
  }

  delete(id: number) {
    return this.instrumentRepository.delete(id);
  }

  async findAllType() {
    return this.typeRepository.findTrees();
    // try {
    //   console.log('开始查询 types 表...');
    //   const result = await this.typeRepository.findTrees();
    //   console.log('查询成功，结果数量:', result.length);
    //   return result;
    // } catch (error) {
    //   console.error('findAllType 错误:', error);
    //   console.error('错误 SQL:', error.query); // 如果有的话
    //   throw error;
    // }
  }

  async deleteType(id: number) {
    const type = await this.typeRepository.findOne({
      where: { id },
      relations: ['children'],
    });
    if (!type) {
      throw new NotFoundException(`Type with Id ${id} not found`);
    }
    await this.deleteTypeAndChildren(type);
  }

  private async deleteTypeAndChildren(type: Type) {
    if (type.children && type.children.length > 0) {
      for (const child of type.children) {
        await this.deleteTypeAndChildren(child);
      }
    }
    await this.typeRepository.delete(type.id);
  }

  async getAllTypesWithProducts() {
    const types = await this.typeRepository.findTrees();
    for (const type of types) {
      await this.loadProductsRecursively(type);
    }
    return types;
  }

  private async loadProductsRecursively(type: Type) {
    type.instruments = await this.typeRepository.manager
      .getRepository(Instrument)
      .createQueryBuilder('type')
      .leftJoinAndSelect('type.instruments', 'instrument')
      .where('type.id = :id', { id: type.id })
      .getMany();
    if (type.children && type.children.length > 0) {
      for (const child of type.children) {
        await this.loadProductsRecursively(child);
      }
    }
  }
}
