import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParticipantVideoLink } from './entities/participant-video-link.entity';
import { CreateParticipantVideoLinkDto } from './dto/create-participant-video-link.dto';

@Injectable()
export class ParticipantVideoLinksService {
  constructor(
    @InjectRepository(ParticipantVideoLink)
    private participantVideoLinkRepository: Repository<ParticipantVideoLink>,
  ) {}
  create(createParticipantVideoLinkDtos: CreateParticipantVideoLinkDto[]) {
    try {
      const videoLinks = [];
      createParticipantVideoLinkDtos.map((createParticipantVideoLinkDto) => {
        const videoLink = this.participantVideoLinkRepository.create();
        // add to AWS S3
        console.log(createParticipantVideoLinkDto);
        videoLinks.push(videoLink);
      });

      return videoLinks;
    } catch (e) {
      throw new Error('Unable to create participant video link');
    }
  }
}
