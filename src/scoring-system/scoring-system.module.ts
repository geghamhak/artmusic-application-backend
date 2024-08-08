import { Module } from '@nestjs/common';
import { ScoringSystemService } from './scoring-system.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScoringSystem } from "./entities/scoring-system.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ScoringSystem])],
  exports: [TypeOrmModule],
  providers: [ScoringSystemService],
})
export class ScoringSystemModule {}
