import { Module } from '@nestjs/common';
import { ApplicationCompositionService } from './application-composition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationComposition } from './entities/application-composition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationComposition])],
  providers: [ApplicationCompositionService],
  exports: [TypeOrmModule, ApplicationCompositionService],
})
export class ApplicationCompositionModule {}
