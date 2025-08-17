export interface User {
  _id: string;
  email: string;
  name: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  _id: string;
  userId: string;
  title: string;
  imageUrl: string;
  analysis: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    medicinesSuggested: string[];
    reportType: string;
    severity?: 'low' | 'medium' | 'high';
  };
  chatHistory: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UploadedFile {
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}