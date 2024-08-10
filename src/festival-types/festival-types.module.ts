import { Module } from '@nestjs/common';
import { FestivalTypesService } from './festival-types.service';
import { FestivalTypesController } from './festival-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivalType } from './entities/festival-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FestivalType])],
  exports: [TypeOrmModule],
  controllers: [FestivalTypesController],
  providers: [FestivalTypesService],
})
export class FestivalTypesModule {}
