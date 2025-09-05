// Gestionnaire de requêtes optimisé avec typage strict
export interface CacheEntry<T = any> {
    data: T;
    timestamp: number;
    promise?: Promise<T>;
  }
  
  export class RequestManager {
    private cache: Map<string, CacheEntry> = new Map();
    private pendingRequests: Map<string, Promise<any>> = new Map();
    
    constructor(
      private readonly defaultCacheDuration: number = 5 * 60 * 1000, // 5 minutes par défaut
      private readonly defaultDebounceTime: number = 2000 // 2 secondes par défaut
    ) {}
  
    async request<T>(
      key: string,
      fetchFn: () => Promise<T>,
      options: {
        forceRefresh?: boolean;
        cacheDuration?: number;
        debounceTime?: number;
      } = {}
    ): Promise<T> {
      const now = Date.now();
      const cacheDuration = options.cacheDuration ?? this.defaultCacheDuration;
      const debounceTime = options.debounceTime ?? this.defaultDebounceTime;
  
      // Vérifier le cache existant
      const cached = this.cache.get(key);
      if (
        !options.forceRefresh &&
        cached &&
        now - cached.timestamp < cacheDuration &&
        'data' in cached
      ) {
        return cached.data as T;
      }
  
      // Réutiliser une requête en cours si elle existe
      const pendingRequest = this.pendingRequests.get(key);
      if (pendingRequest) {
        return pendingRequest as Promise<T>;
      }
  
      // Créer une nouvelle requête
      try {
        const promise = fetchFn();
        this.pendingRequests.set(key, promise);
  
        const data = await promise;
        
        // Mettre en cache le résultat
        const cacheEntry: CacheEntry<T> = {
          data,
          timestamp: now,
        };
        
        this.cache.set(key, cacheEntry);
        this.pendingRequests.delete(key);
        
        return data;
      } catch (error) {
        this.pendingRequests.delete(key);
        throw error;
      }
    }
  
    clearCache(pattern?: string | RegExp): void {
      if (!pattern) {
        this.cache.clear();
        this.pendingRequests.clear();
        return;
      }
  
      const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
      // Utiliser Array.from pour éviter les problèmes de compatibilité
      Array.from(this.cache.keys()).forEach(key => {
        if (regex.test(key)) {
          this.cache.delete(key);
          this.pendingRequests.delete(key);
        }
      });
    }
  
    invalidateCache(key: string): void {
      this.cache.delete(key);
      this.pendingRequests.delete(key);
    }
  }
  
  // Exporter une instance unique pour l'application
  export const globalRequestManager = new RequestManager();