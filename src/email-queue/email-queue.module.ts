import { Module } from '@nestjs/common';
import { EmailQueueService } from './email-queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailQueue } from './entities/email-queue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailQueue])],
  providers: [EmailQueueService],
  exports: [EmailQueueService],
})
export class EmailQueueModule {}
