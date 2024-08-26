import { Module } from '@nestjs/common';
import { InstrumentService } from './instrument.service';
import { InstrumentController } from './instrument.controller';
// import { InstrumentProviders } from './instrument.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrument } from './entities/instrument.entity';
import { Model } from './entities/model.entity';
import { Feature } from './entities/feature.entity';
import { Type } from './entities/type.entity';
import { FeatureImage } from './entities/featureImage.entity';
import { Image } from './entities/image.entity';
import { Parameter } from './entities/parameter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Instrument,
      Model,
      Feature,
      Type,
      FeatureImage,
      Image,
      Parameter,
    ]),
  ],
  providers: [InstrumentService],
  controllers: [InstrumentController],
})
export class InstrumentModule {}
