interface TranslationsItem {
  translation: string;
  language: {
    code: string;
  };
}

export interface TranslationToMap {
  id: number;
  name: {
    originalText: string;
    originalLanguage: {
      code: string;
    };
    translations: TranslationsItem[];
  };
}
