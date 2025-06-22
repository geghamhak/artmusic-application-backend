import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ApplicationsService } from '../applications/applications.service';
import { Application } from '../applications/entities/application.entity';
import { FileSystemStoredFile } from 'nestjs-form-data';

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
      const workbook = new ExcelJS.Workbook();
      const fileData = await workbook.xlsx.readFile(existingSchedule.path);
      const worksheets = fileData.worksheets;
      worksheets.map((worksheet) => {
        worksheet.eachRow((row) => {
          console.log(row.values);
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
