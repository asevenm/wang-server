import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstrumentModule } from './instrument/instrument.module';
import { PictureModule } from './picture/picture.module';
import { TransformInterceptor } from './interceptors/transform';
import { ProductModule } from './product/product.module';
import { FileModule } from './file/file.module';
import { MessageModule } from './message/message.module';

@Module({
  // 在imports数组中添加FileModule
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '192.168.31.84',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_DATABASE || 'wang',
      synchronize: true,
      autoLoadEntities: true,
    }),
    InstrumentModule,
    PictureModule,
    ProductModule,
    FileModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
