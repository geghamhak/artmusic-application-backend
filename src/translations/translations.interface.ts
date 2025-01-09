interface TranslationsItem {
  translation: string;
  language: {
    code: string;
  };
}

export interface TranslationToMap {
  id: number;
  name: {
    translations: TranslationsItem[];
  };
}
