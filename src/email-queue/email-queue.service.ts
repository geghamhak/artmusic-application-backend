import { Injectable } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { v4 } from 'uuid';
import { EmailQueue } from './entities/email-queue.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export enum EmailQueueStatus {
  IN_QUEUE = 'in-queue',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum TemplateTypeEnum {
  EmailConfirmation = 'email-confirmation',
}

export type EmailPayload = {
  type: string;
  subject: string;
  emailsTo: string[];
  languageCode: string;
};

@Injectable()
export class EmailQueueService {
  private readonly queueName: string;
  constructor(
    @InjectRepository(EmailQueue)
    private emailQueueRepository: Repository<EmailQueue>,
    private readonly sqsService: SqsService,
    private readonly configService: ConfigService,
  ) {
    this.queueName = this.configService.get('EMAIL_QUEUE_NAME');
  }
  async sendMessage(body: EmailPayload) {
    try {
      const { type, subject, emailsTo, languageCode } = body;
      const email = await this.emailQueueRepository.save({
        id: v4(),
        type,
        subject,
        emailsTo: emailsTo.toString(),
        status: EmailQueueStatus.IN_QUEUE,
        languageCode,
      } as unknown as EmailQueue);

      await this.sqsService.send(this.queueName, {
        id: v4(),
        body: JSON.stringify({
          id: email.id,
        }),
      });
      console.log(`message send it with email id: ${email.id}`);
    } catch (error) {
      console.log('error in producing message for report queue', error);
    }
  }
}
