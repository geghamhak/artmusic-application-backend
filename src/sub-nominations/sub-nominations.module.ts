import { Module } from '@nestjs/common';
import { SubNominationsService } from './sub-nominations.service';
import { SubNominationsController } from './sub-nominations.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubNomination } from "./entities/sub-nomination.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SubNomination])],
  exports: [TypeOrmModule],
  controllers: [SubNominationsController],
  providers: [SubNominationsService],
})
export class SubNominationsModule {}
