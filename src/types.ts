// src/types.ts
export interface User {
  id: string; // Ensure id is a string
  firstName: string;
  username?: string;
  isBot?: boolean;
  lastName?: string;
  languageCode?: string;
  photoUrl?: string;
  isPremium?: boolean;
  allowsWriteToPm?: boolean;
}

export interface InitData {
  user: User;
}

  
  export interface InitData {
    user: User;
  }
  
  export interface TelegramInitData {
    user?: User;
    authDate: Date;
  }
  