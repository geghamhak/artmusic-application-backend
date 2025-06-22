interface TranslationsItem {
  translation: string;
  language: {
    code: string;
  };
}

export interface TranslationToMap {
  id: number;
  priority: number;
  name: {
    translations: TranslationsItem[];
  };
}
