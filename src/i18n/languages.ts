export interface LanguageOption {
  code: string;
  label: string;
}

export const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "EN" },
  { code: "ja", label: "日本語" },
];
