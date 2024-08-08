import { Module } from '@nestjs/common';
import { ParticipantTypesService } from './participant-types.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ParticipantType} from "./entities/participant-type.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ParticipantType])],
  exports: [TypeOrmModule],
  providers: [ParticipantTypesService],
})
export class ParticipantTypesModule {}
