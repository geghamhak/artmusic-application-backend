import { Module } from '@nestjs/common';
import { FestivalJuryService } from './festival-jury.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivalJury } from './entities/festival-jury.entity';
import { FestivalsJuryController } from './festivals-jury.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FestivalJury])],
  controllers: [FestivalsJuryController],
  providers: [FestivalJuryService],
  exports: [FestivalJuryService],
})
export class FestivalJuryModule {}
