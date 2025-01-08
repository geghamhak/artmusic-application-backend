import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParticipantVideoLink } from './entities/participant-video-link.entity';

@Injectable()
export class ParticipantVideoLinksService {
  constructor(
    @InjectRepository(ParticipantVideoLink)
    private participantVideoLinkRepository: Repository<ParticipantVideoLink>,
  ) {}
  async create(participantLinks: string[]) {
    try {
      const videoLinks = [];
      participantLinks.map(async (participantLink) => {
        const videoLink = this.participantVideoLinkRepository.create();
        videoLink.link = participantLink;
        await this.participantVideoLinkRepository.save(videoLink);
        videoLinks.push(videoLink);

        // add to AWS S3
      });

      return videoLinks;
    } catch (e) {
      throw new Error('Unable to create participant video link');
    }
  }
}
