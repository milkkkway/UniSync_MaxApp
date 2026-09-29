export type UserRole = 'student' | 'employer';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  passwordHash: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface CaseLink {
  id: string;
  title: string;
  url: string;
  platform: 'github' | 'behance' | 'kaggle' | 'website' | 'other';
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface StudentProfile {
  userId: string;
  fullName: string;
  age: number;
  university: string;
  city: string;
  experience: string;
  sphere: string;
  about: string;
  softSkills: string[];
  hardSkills: string[];
  caseLinks: CaseLink[];
  certificates: Certificate[];
  completedProjectsCount: number;
  rating: number;
  reviewsCount: number;
}

export interface EmployerProfile {
  userId: string;
  companyName: string;
  contactPerson: string;
  sphere: string;
  city: string;
  inn?: string;
  website?: string;
  description: string;
  logoUrl?: string;
  rating: number;
  reviewsCount: number;
}

export type WorkFormat = 'Удаленно' | 'Офис' | 'Гибрид';

export interface Vacancy {
  id: string;
  employerId: string;
  companyName: string;
  city: string;
  title: string;
  sphere: string;
  description: string;
  budget: number;
  format: WorkFormat;
  deadline: string;
  requiredSkills: string[];
  status: 'active' | 'paused' | 'in_progress' | 'completed';
  responsesCount: number;
  createdAt: string;
}

export type ApplicationStatus = 'sent' | 'viewed' | 'in_chat' | 'agreed' | 'rejected' | 'completed';

export interface Application {
  id: string;
  vacancyId: string;
  studentId: string;
  studentName: string;
  studentUniversity: string;
  studentRating: number;
  coverLetter: string;
  proposedPrice: number;
  deliveryDays: number;
  status: ApplicationStatus;
  rejectReason?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  vacancyId?: string;
  title: string;
  clientName: string;
  studentId: string;
  employerId?: string;
  amount: number;
  completedDate: string;
  description: string;
  externalUrl?: string;
  rating?: number;
  reviewText?: string;
  isManual?: boolean;
}

export interface Review {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  targetId: string;
  targetRole: UserRole;
  rating: number;
  text: string;
  projectName: string;
  date: string;
  replyText?: string;
}

export type MessageType = 'text' | 'system' | 'requisites' | 'link';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: UserRole;
  text: string;
  type: MessageType;
  metadata?: {
    bankName?: string;
    recipientPhone?: string;
    cardNumber?: string;
    amount?: number;
    linkUrl?: string;
  };
  timestamp: string;
}

export type DealStage = 'negotiation' | 'in_progress' | 'waiting_payment' | 'completed';

export interface Deal {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  studentId: string;
  studentName: string;
  employerId: string;
  employerName: string;
  stage: DealStage;
  agreedAmount: number;
  requisites?: {
    bankName: string;
    recipientPhone: string;
    cardNumber?: string;
    note?: string;
  };
  studentReviewLeft?: boolean;
  employerReviewLeft?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StudentTab = 'profile' | 'vacancies' | 'portfolio' | 'reviews';
export type EmployerTab = 'company' | 'tasks' | 'responses' | 'portfolio' | 'reviews';
