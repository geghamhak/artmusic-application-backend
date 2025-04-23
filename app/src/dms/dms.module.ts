import { Module } from '@nestjs/common';
import { DmsService } from './dms.service';

@Module({
  providers: [DmsService],
})
export class DmsModule {}
