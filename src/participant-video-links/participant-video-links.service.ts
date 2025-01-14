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
  async saveMany(participantLinks: string[]) {
    try {
      const videoLinks = participantLinks.map(async (participantLink) => {
        return this.create(participantLink);
      });

      return await Promise.all(videoLinks);
      // add to AWS S3
    } catch (e) {
      throw new Error('Unable to create participant video link');
    }
  }

  async create(participantLink: string) {
    const videoLink = new ParticipantVideoLink();
    videoLink.link = participantLink;
    return await this.participantVideoLinkRepository.save(videoLink);
  }
}
