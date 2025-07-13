import { Controller, Param, Delete, Get } from '@nestjs/common';
import { FestivalJuryService } from './festival-jury.service';

@Controller('festival-juries')
export class FestivalsJuryController {
  constructor(private readonly festivalJuryService: FestivalJuryService) {}

  @Get(':festivalId/nomination/:nominationId')
  findFestivalJuriesCountByNomination(
    @Param('festivalId') festivalId: string,
    @Param('nominationId') nominationId: string,
  ) {
    return this.festivalJuryService.findJuriesCount(+festivalId, +nominationId);
  }

  @Get('/:festivalId/sub-nomination/:subNominationId')
  findFestivalJuriesCountBySubNomination(
    @Param('festivalId') festivalId: string,
    @Param('subNominationId') subNominationId: string,
  ) {
    return this.festivalJuryService.findJuriesCount(
      +festivalId,
      undefined,
      +subNominationId,
    );
  }

  @Delete(':festivalId/nomination/:nominationId')
  removeByNominationId(
    @Param('festivalId') festivalId: string,
    @Param('nominationId') nominationId: string,
  ) {
    return this.festivalJuryService.removeByNominationId(
      +festivalId,
      +nominationId,
    );
  }
  @Delete(':festivalId/sub-nomination/:subNominationId')
  removeBySubNominationId(
    @Param('festivalId') festivalId: string,
    @Param('subNominationId') subNominationId: string,
  ) {
    return this.festivalJuryService.removeBySubNominationId(
      +festivalId,
      +subNominationId,
    );
  }
}
