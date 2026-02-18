
export interface Mantra {
  id: string;
  frontText: string;
  backText: string;
  author: string;
  index: number;
  colorTheme: ColorTheme;
}

export interface ColorTheme {
  bg: string;
  postIt: string;
  text: string;
  accent: string;
}

export interface GeminiResponse {
  mantras: {
    backText: string;
    author: string;
  }[];
}
