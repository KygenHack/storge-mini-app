// src/types.ts

export interface User {
    id: number;
    firstName: string;
    username?: string;
    isBot?: boolean;
    lastName?: string;
    languageCode?: string;
    photoUrl?: string;
    isPremium?: boolean; // Add isPremium property
    allowsWriteToPm?: boolean; // Add allowsWriteToPm property
  }
  
  export interface InitData {
    user: User;
  }
  
  export interface TelegramInitData {
    user?: User;
    authDate: Date;
  }
  