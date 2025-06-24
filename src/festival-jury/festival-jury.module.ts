import { Module } from '@nestjs/common';
import { FestivalJuryService } from './festival-jury.service';
import { FestivalJuryController } from './festival-jury.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivalJury } from './entities/festival-jury.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FestivalJury])],
  controllers: [FestivalJuryController],
  providers: [FestivalJuryService],
  exports: [FestivalJuryService],
})
export class FestivalJuryModule {}
