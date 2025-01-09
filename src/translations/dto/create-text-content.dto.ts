export interface TranslationDto {
  languageCode: string;
  translation: string;
}

export class CreateTextContentDto {
  translations: TranslationDto[];
}
