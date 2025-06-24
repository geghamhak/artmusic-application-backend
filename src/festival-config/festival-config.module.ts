import { Module } from '@nestjs/common';
import { FestivalConfigService } from './festival-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivalConfig } from './entities/festival-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FestivalConfig])],
  providers: [FestivalConfigService],
  exports: [FestivalConfigService],
})
export class FestivalConfigModule {}
