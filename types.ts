export interface ProductInfo {
  title: string;
  description: string;
}

export interface GeneratedContent {
  captions: {
    option1: string;
    option2: string;
    option3: string;
    bestOption: string;
    reason: string;
  };
  hashtags: string[];
  titles: {
    option1: string;
    option2: string;
    option3: string;
    bestOption: string;
    reason: string;
  };
}

export enum AppState {
  IDLE = 'IDLE',
  EXTRACTING = 'EXTRACTING',
  GENERATING = 'GENERATING',
  DONE = 'DONE',
  ERROR = 'ERROR'
}