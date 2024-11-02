// lib/db.ts
class ChatDB {
    private db2: IDBDatabase | null = null;
    private readonly dbName = 'ChatDatabase';
    private readonly dbVersion = 1;
  
    async init(): Promise<void> {
      if (typeof window === 'undefined') return; // Skip on server-side
  
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);
  
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db2 = request.result;
          resolve();
        };
  
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('chats')) {
            const store = db.createObjectStore('chats', {
              keyPath: 'id',
              autoIncrement: true
            });
            store.createIndex('input', 'input', { unique: false });
            store.createIndex('llm', 'llm', { unique: false, multiEntry: true });
          }
        };
      });
    }
  
    private async waitForConnection(): Promise<void> {
      if (!this.db2) {
        await this.init();
      }
    }
  
    async addChat(chat: {
      input: string;
      content: string;
      llm: string[];
      timestamp: string;
    }): Promise<number> {
      await this.waitForConnection();
      if (!this.db2) throw new Error('Database not initialized');
  
      return new Promise((resolve, reject) => {
        const transaction = this.db2!.transaction(['chats'], 'readwrite');
        const store = transaction.objectStore('chats');
        const request = store.add({
          ...chat,
          timestamp: new Date().toISOString()
        });
  
        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject(request.error);
      });
    }
  
    async getAllChats(): Promise<Array<{
      id: number;
      input: string;
      content: string;
      llm: string[];
      timestamp: string;
    }>> {
      await this.waitForConnection();
      if (!this.db2) throw new Error('Database not initialized');
  
      return new Promise((resolve, reject) => {
        const transaction = this.db2!.transaction(['chats'], 'readonly');
        const store = transaction.objectStore('chats');
        const request = store.getAll();
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async deleteChat(id: number): Promise<void> {
      await this.waitForConnection();
      if (!this.db2) throw new Error('Database not initialized');
  
      return new Promise((resolve, reject) => {
        const transaction = this.db2!.transaction(['chats'], 'readwrite');
        const store = transaction.objectStore('chats');
        const request = store.delete(id);
  
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }
  
  export const db2 = new ChatDB();