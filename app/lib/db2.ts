// lib/db2.ts
export interface Chat {
    id?: number;
    input: string;
    content: string;
    llm: string[];
    timestamp: string;
    experimentId: number; // Add this line
    scores?: {
      accuracy: number;
      relevancy: number;
      quality: number;
      factuality: number;
    };
  }

  export interface Experiment {
    id?: number;
    llm: string;
    description: string;
    timestamp: string;
  }
  
  class ChatDB {
    private db2: IDBDatabase | null = null;
    private readonly dbName = 'ChatDatabase';
    private readonly dbVersion = 2; // Increment version to trigger onupgradeneeded
  
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
            if (!db.objectStoreNames.contains('experiments')) {
              const store = db.createObjectStore('experiments', {
                keyPath: 'id',
                autoIncrement: true
              });
              store.createIndex('llm', 'llm', { unique: false });
              store.createIndex('timestamp', 'timestamp', { unique: false });
            }
          };
        });
    }
  
    private async waitForConnection(): Promise<void> {
      if (!this.db2) {
        await this.init();
      }
    }

    async addExperiment(experiment: Omit<Experiment, 'id'>): Promise<number> {
        await this.waitForConnection();
        if (!this.db2) throw new Error('Database not initialized');
    
        return new Promise((resolve, reject) => {
          const transaction = this.db2!.transaction(['experiments'], 'readwrite');
          const store = transaction.objectStore('experiments');
          const request = store.add(experiment);
    
          request.onsuccess = () => resolve(request.result as number);
          request.onerror = () => reject(request.error);
        });
      }

      async getExperiment(id: number): Promise<Experiment | undefined> {
        await this.waitForConnection();
        if (!this.db2) throw new Error('Database not initialized');
    
        return new Promise((resolve, reject) => {
          const transaction = this.db2!.transaction(['experiments'], 'readonly');
          const store = transaction.objectStore('experiments');
          const request = store.get(id);
    
          request.onsuccess = () => resolve(request.result || undefined);
          request.onerror = () => reject(request.error);
        });
      }

      async getAllExperiments(): Promise<Experiment[]> {
        await this.waitForConnection();
        if (!this.db2) throw new Error('Database not initialized');
    
        return new Promise((resolve, reject) => {
          const transaction = this.db2!.transaction(['experiments'], 'readonly');
          const store = transaction.objectStore('experiments');
          const request = store.getAll();
    
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      }

      async updateExperiment(experiment: Experiment): Promise<void> {
        await this.waitForConnection();
        if (!this.db2) throw new Error('Database not initialized');
    
        return new Promise((resolve, reject) => {
          const transaction = this.db2!.transaction(['experiments'], 'readwrite');
          const store = transaction.objectStore('experiments');
          const request = store.put(experiment);
    
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      async deleteExperiment(id: number): Promise<void> {
        await this.waitForConnection();
        if (!this.db2) throw new Error('Database not initialized');
    
        return new Promise((resolve, reject) => {
          const transaction = this.db2!.transaction(['experiments'], 'readwrite');
          const store = transaction.objectStore('experiments');
          const request = store.delete(id);
    
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
  
    async addChat(chat: Omit<Chat, 'id'>): Promise<number> {
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

    // Add this method to your ChatDB class if it doesn't exist
    async getChat(id: number): Promise<Chat | undefined> {
        await this.waitForConnection();
        if (!this.db2) throw new Error('Database not initialized');
    
        return new Promise((resolve, reject) => {
            const transaction = this.db2!.transaction(['chats'], 'readonly');
            const store = transaction.objectStore('chats');
            const request = store.get(id);
    
            request.onsuccess = () => resolve(request.result || undefined);
            request.onerror = () => reject(request.error);
        });
    }
  
    async getAllChats(): Promise<Chat[]> {
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
  
    async updateChatScores(chatId: number, scores: Chat['scores']): Promise<void> {
      await this.waitForConnection();
      if (!this.db2) throw new Error('Database not initialized');
  
      return new Promise((resolve, reject) => {
        const transaction = this.db2!.transaction(['chats'], 'readwrite');
        const store = transaction.objectStore('chats');
        const request = store.get(chatId);
  
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const chat = request.result;
          if (chat) {
            chat.scores = scores;
            const updateRequest = store.put(chat);
            updateRequest.onerror = () => reject(updateRequest.error);
            updateRequest.onsuccess = () => resolve();
          } else {
            reject(new Error('Chat not found'));
          }
        };
      });
    }
  
    async getChatById(id: number): Promise<Chat | null> {
      await this.waitForConnection();
      if (!this.db2) throw new Error('Database not initialized');
  
      return new Promise((resolve, reject) => {
        const transaction = this.db2!.transaction(['chats'], 'readonly');
        const store = transaction.objectStore('chats');
        const request = store.get(id);
  
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    }
  }
  
  export const db2 = new ChatDB();