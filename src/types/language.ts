// Language Type Definitions

export interface Language {
  _id: string;
  name: string;
  slug: string;
  totalKeywords: number;
  isGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupportedLanguage {
  name: string;
  slug: string;
  keywords: string[];
}

// Note: Backend returns data directly as array, not nested
export type LanguagesResponse = Language[];

export interface SupportedLanguagesResponse {
  languages: SupportedLanguage[];
}

export interface SingleLanguageResponse {
  language: Language;
}

export type LanguageSlug =
  | 'python'
  | 'javascript'
  | 'java'
  | 'typescript'
  | 'cpp'
  | 'go'
  | 'rust'
  | 'c'
  | 'kotlin';

export interface LanguageStats {
  totalLanguages: number;
  totalKeywords: number;
  generatedCount: number;
  pendingCount: number;
}
