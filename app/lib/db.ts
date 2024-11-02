// lib/db.ts
class PromptDB {
    private db: IDBDatabase | null = null;
    private readonly dbName = 'PromptDatabase';
    private readonly dbVersion = 1;
  
    async init(): Promise<void> {
      if (typeof window === 'undefined') return; // Skip on server-side
  
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);
  
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };
  
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('prompts')) {
            const store = db.createObjectStore('prompts', {
              keyPath: 'id',
              autoIncrement: true
            });
            store.createIndex('title', 'title', { unique: false });
            store.createIndex('tags', 'tags', { unique: false, multiEntry: true });
          }
        };
      });
    }
  
    private async waitForConnection(): Promise<void> {
      if (!this.db) {
        await this.init();
      }
    }
  
    async addPrompt(prompt: {
      title: string;
      content: string;
      tags: string[];
    }): Promise<number> {
      await this.waitForConnection();
      if (!this.db) throw new Error('Database not initialized');
  
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['prompts'], 'readwrite');
        const store = transaction.objectStore('prompts');
        const request = store.add({
          ...prompt,
          timestamp: new Date().toISOString()
        });
  
        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject(request.error);
      });
    }
  
    async getAllPrompts(): Promise<Array<{
      id: number;
      title: string;
      content: string;
      tags: string[];
      timestamp: string;
    }>> {
      await this.waitForConnection();
      if (!this.db) throw new Error('Database not initialized');
  
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['prompts'], 'readonly');
        const store = transaction.objectStore('prompts');
        const request = store.getAll();
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async deletePrompt(id: number): Promise<void> {
      await this.waitForConnection();
      if (!this.db) throw new Error('Database not initialized');
  
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['prompts'], 'readwrite');
        const store = transaction.objectStore('prompts');
        const request = store.delete(id);
  
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }
  
  export const db = new PromptDB();