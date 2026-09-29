import {
  User,
  StudentProfile,
  EmployerProfile,
  Vacancy,
  Application,
  Project,
  Review,
  Deal,
  ChatMessage,
} from '../types';

const DB_NAME = 'max_cases_database_v2';
const DB_VERSION = 1;

export class DatabaseService {
  private db: IDBDatabase | null = null;
  private isReady: boolean = false;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[MAX DB] IndexedDB not available, using localStorage fallback');
      this.isReady = true;
      return;
    }

    return new Promise((resolve) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const stores = [
          'users',
          'student_profiles',
          'employer_profiles',
          'vacancies',
          'applications',
          'projects',
          'reviews',
          'deals',
          'messages',
        ];
        for (const store of stores) {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.isReady = true;
        resolve();
      };

      request.onerror = () => {
        console.warn('[MAX DB] Error opening IndexedDB, falling back to localStorage');
        this.isReady = true;
        resolve();
      };
    });
  }

  public async setItem<T>(storeName: string, key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(`max_${storeName}_${key}`, JSON.stringify(value));
    } catch {

    }
  }

  public async getItem<T>(storeName: string, key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(`max_${storeName}_${key}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  public async saveCollection<T>(collectionName: string, data: T[]): Promise<void> {
    try {
      localStorage.setItem(`max_db_${collectionName}`, JSON.stringify(data));
    } catch {

    }
  }

  public getCollection<T>(collectionName: string, defaultData: T[]): T[] {
    try {
      const saved = localStorage.getItem(`max_db_${collectionName}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {

    }
    return defaultData;
  }
}

export const dbService = new DatabaseService();
