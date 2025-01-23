import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ApplicationsService } from '../applications/applications.service';
import { Application } from '../applications/entities/application.entity';

@Injectable()
export class ExcelService {
  constructor(private applicationService: ApplicationsService) {}

  async exportApplications(festivalId: number) {
    const applications =
      await this.applicationService.findByFestivalId(festivalId);
    return await this.createExportFileBuffer(applications);
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
      { header: 'id', key: 'id' },
      { header: 'code', key: 'code' },
      { header: 'country', key: 'country' },
      { header: 'region', key: 'region' },
      { header: 'school', key: 'school' },
      { header: 'isFree', key: 'isFree' },
      { header: 'isOnline', key: 'isOnline' },
      { header: 'leaderFirstName', key: 'leaderFirstName' },
      { header: 'leaderLastName', key: 'leaderLastName' },
      { header: 'quantity', key: 'quantity' },
      { header: 'performanceDate', key: 'performanceDate' },
      { header: 'performanceTime', key: 'performanceTime' },
      { header: 'subNomination', key: 'subNomination' },
      { header: 'participantType', key: 'participantType' },
      { header: 'compositions', key: 'compositions' },
      { header: 'email', key: 'email' },
      { header: 'phoneNumber', key: 'phoneNumber' },
      { header: 'totalDuration', key: 'totalDuration' },
    ];
  }

  getApplicationWorksheetRow(application: Application) {
    return {
      id: application.id,
      code: application.code,
      country: application.country.name.translations[0],
      region: application.region
        ? application.region.name.translations[0]
        : application.regionName,
      school: application.school
        ? application.school.name.translations[0]
        : application.schoolName,
      isFree: application.isFree,
      isOnline: application.isOnline,
      leaderFirstName: application.leaderFirstName,
      leaderLastName: application.leaderLastName,
      quantity: application.quantity,
      performanceDate: application.performanceDate,
      performanceTime: application.performanceTime,
      subNomination: application.subNomination.name.translations[0],
      participantType: application.participantType,
      compositions: application.compositions
        .map((composition) => composition.title)
        .join(', '),
      email: application.email,
      phoneNumber: application.phoneNumber,
      totalDuration: application.totalDuration,
    };
  }
}
