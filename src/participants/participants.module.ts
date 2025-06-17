import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { TranslationsModule } from '../translations/translations.module';

@Module({
  imports: [TypeOrmModule.forFeature([Participant]), TranslationsModule],
  exports: [TypeOrmModule, ParticipantsService],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
