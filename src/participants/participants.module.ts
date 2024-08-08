import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Participant } from "./entities/participant.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Participant])],
  exports: [TypeOrmModule],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
