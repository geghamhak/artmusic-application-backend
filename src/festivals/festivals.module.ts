import { Module } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { FestivalsController } from './festivals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Festival } from './entities/festival.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Festival])],
  exports: [TypeOrmModule, FestivalsService],
  controllers: [FestivalsController],
  providers: [FestivalsService],
})
export class FestivalsModule {}
