import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailQueueDto } from './create-email-queue.dto';

export class UpdateEmailQueueDto extends PartialType(CreateEmailQueueDto) {}
