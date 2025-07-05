import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as xlsx from 'xlsx';
import { ApplicationsService } from '../applications/applications.service';
import { Application } from '../applications/entities/application.entity';
import { FileSystemStoredFile } from 'nestjs-form-data';
import * as fs from 'node:fs';
import { CreateApplicationDto } from '../applications/dto/create-application.dto';
import {
  ParticipantTypeEnum,
  ParticipantTypeMap,
} from '../participants/participants.service';
import { removeNonNumberChars } from '../utils/stringUtils';

@Injectable()
export class ExcelService {
  constructor(private applicationService: ApplicationsService) {}

  async exportApplications(festivalId: number) {
    try {
      return await this.createExportFileBuffer(
        await this.applicationService.findByFestivalId(festivalId),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createExportFileBuffer(applications: Application[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ExportApplications');
    worksheet.columns = this.getApplicationWorksheetColumns();
    for (const application of applications) {
      worksheet.addRow(this.getApplicationWorksheetRow(application));
    }

    return await workbook.xlsx.writeBuffer();
  }

  getApplicationWorksheetColumns() {
    return [
      { header: 'code', key: 'code' },
      { header: 'performanceDate', key: 'performanceDate' },
      { header: 'performanceTime', key: 'performanceTime' },
      { header: 'nomination', key: 'nomination' },
      { header: 'subNomination', key: 'subNomination', width: 20 },
      { header: 'birthYear', key: 'birthYear' },
      { header: 'country', key: 'country' },
      { header: 'region', key: 'region' },
      { header: 'school', key: 'school', width: 35 },
      { header: 'isFree', key: 'isFree' },
      { header: 'isOnline', key: 'isOnline' },
      { header: 'leaderFirstName', key: 'leaderFirstName' },
      { header: 'leaderLastName', key: 'leaderLastName' },
      { header: 'quantity', key: 'quantity' },
      { header: 'participantType', key: 'participantType' },
      { header: 'compositions', key: 'compositions', width: 25 },
      { header: 'participants', key: 'participants', width: 35 },
      { header: 'email', key: 'email' },
      { header: 'phoneNumber', key: 'phoneNumber' },
      { header: 'totalDuration', key: 'totalDuration' },
      { header: 'id', key: 'id' },
    ];
  }

  getApplicationWorksheetRow(application: Application) {
    const armLanguageCode = 'am';
    return {
      id: application.id,
      code: application.code,
      country: application.country.name.translations.find(
        (translation) => translation.language.code === 'en',
      ).translation,
      subNomination: application.subNomination.name.translations.find(
        (translation) => translation.language.code === armLanguageCode,
      ).translation,
      nomination: application.subNomination.nomination.name.translations.find(
        (translation) => translation.language.code === armLanguageCode,
      ).translation,
      region: application.school.region
        ? application.school.region.name.translations.find(
            (translation) => translation.language.code === armLanguageCode,
          ).translation
        : application.regionName,
      school: application.school
        ? application.school.name.translations.find(
            (translation) => translation.language.code === armLanguageCode,
          ).translation
        : application.schoolName,
      isFree: application.isFree,
      isOnline: application.isOnline,
      leaderFirstName: application.leaderFirstName,
      leaderLastName: application.leaderLastName,
      quantity: application.quantity,
      performanceDate: application.performanceDate,
      performanceTime: application.performanceTime,
      participantType: application.participantType,
      compositions: application.compositions
        .map((composition) => composition.title)
        .join(', '),
      participants: application.participants
        ? application.participants
            .map(
              (participant) =>
                `${participant.lastName} ${participant.firstName} ${participant.fatherName} ${participant.birthYear}`,
            )
            .join(', ')
        : '',
      email: application.email,
      phoneNumber: application.phoneNumber,
      totalDuration: application.totalDuration,
    };
  }

  async addApplicationsFromSchedule(
    existingSchedule: FileSystemStoredFile,
    festivalId: number,
  ) {
    try {
      const workbook = xlsx.read(fs.readFileSync(existingSchedule.path), {
        type: 'buffer',
      });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const sheetData = xlsx.utils.sheet_to_json(worksheet);
      const applications: Partial<CreateApplicationDto>[] = [];
      sheetData.map((row) => {
        const participant = row['PARTICIPANT'].split(' ');
        const leader = row['LEADER'].split(' ');
        const isFree = leader.length === 0;

        applications.push({
          code: row['CODE'],
          subNomination: row['NOMINATION'],
          school: row['SCHOOL'],
          participantType:
            ParticipantTypeMap.get(row['QUANTITY']) ??
            ParticipantTypeEnum.ENSEMBLE,
          participants: [
            {
              lastName: participant[0],
              firstName: participant[1],
              ...(participant[2] && {
                fatherName: participant[2],
              }),
              birthYear: row['YEAR'],
            },
          ],
          applicationCompositions: [
            {
              title: row['COMPOSITION 1'],
            },
            {
              title: row['COMPOSITION 2'],
            },
          ],
          ...(leader.length && {
            leaderLastName: leader[0],
            leaderFirstName: leader[1],
          }),
          languageCode: 'am',
          overallScore: row['OVERALL'],
          averageScore: +removeNonNumberChars(row['AVERAGE']),
          quantity: row['QUANTITY'],
          isFree,
        });
      });

      for (const application of applications) {
        await this.applicationService.addFromSchedule(application, festivalId);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
