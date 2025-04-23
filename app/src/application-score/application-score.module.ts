import { Module } from '@nestjs/common';
import { ApplicationScoreService } from './application-score.service';
import { ApplicationScoreController } from './application-score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationScore } from './entities/application-score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationScore])],
  controllers: [ApplicationScoreController],
  providers: [ApplicationScoreService],
  exports: [TypeOrmModule, ApplicationScoreService],
})
export class ApplicationScoreModule {}
