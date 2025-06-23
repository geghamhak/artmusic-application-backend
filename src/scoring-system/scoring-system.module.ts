import { Module } from '@nestjs/common';
import { ScoringSystemService } from './scoring-system.service';

@Module({
  exports: [ScoringSystemService],
  providers: [ScoringSystemService],
})
export class ScoringSystemModule {}
