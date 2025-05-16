import { createLogger } from '../../workers/api_generate/src/logger';

const logger = createLogger('tuner-cache');

export interface PromptCache {
  id: string;
  prompt: string;
  style: string;
  score: number;
  features: any;
  image_url: string;
  created_at: string;
  expires_at: string;
}

export class KVPromptCache {
  constructor(private kv: KVNamespace) {}

  async get(promptKey: string): Promise<PromptCache | null> {
    try {
      const key = this.normalizeKey(promptKey);
      const cached = await this.kv.get(`prompt:${key}`, 'json');
      
      if (!cached) {
        logger.debug('Cache miss', { key });
        return null;
      }
      
      const cacheData = cached as PromptCache;
      
      // Check expiration
      if (new Date(cacheData.expires_at) < new Date()) {
        logger.debug('Cache expired', { key, expires_at: cacheData.expires_at });
        await this.delete(promptKey);
        return null;
      }
      
      logger.info('Cache hit', { key, score: cacheData.score });
      return cacheData;
    } catch (error) {
      logger.error('Cache get error', error);
      return null;
    }
  }

  async set(
    promptKey: string,
    data: Omit<PromptCache, 'id' | 'created_at' | 'expires_at'>,
    ttl: number = 3600
  ): Promise<boolean> {
    try {
      const key = this.normalizeKey(promptKey);
      const now = new Date();
      
      const cacheData: PromptCache = {
        ...data,
        id: key,
        created_at: now.toISOString(),
        expires_at: new Date(now.getTime() + ttl * 1000).toISOString(),
      };
      
      await this.kv.put(
        `prompt:${key}`,
        JSON.stringify(cacheData),
        {
          expirationTtl: ttl,
          metadata: {
            prompt: data.prompt,
            score: data.score,
            style: data.style,
          },
        }
      );
      
      logger.info('Cache set', { key, score: data.score, ttl });
      return true;
    } catch (error) {
      logger.error('Cache set error', error);
      return false;
    }
  }

  async delete(promptKey: string): Promise<boolean> {
    try {
      const key = this.normalizeKey(promptKey);
      await this.kv.delete(`prompt:${key}`);
      logger.info('Cache deleted', { key });
      return true;
    } catch (error) {
      logger.error('Cache delete error', error);
      return false;
    }
  }

  async findSimilar(prompt: string, style: string, threshold: number = 0.8): Promise<PromptCache[]> {
    try {
      // In a real implementation, we'd use vector embeddings for similarity
      // For now, we'll use simple keyword matching
      const results: PromptCache[] = [];
      
      // List all cached prompts
      const list = await this.kv.list({ prefix: 'prompt:' });
      
      for (const key of list.keys) {
        const cached = await this.kv.get(key.name, 'json') as PromptCache;
        if (!cached) continue;
        
        // Check style match
        if (cached.style !== style) continue;
        
        // Simple similarity based on shared words
        const similarity = this.calculateSimpleSimilarity(prompt, cached.prompt);
        
        if (similarity >= threshold) {
          results.push(cached);
        }
      }
      
      // Sort by score
      results.sort((a, b) => b.score - a.score);
      
      logger.info('Found similar prompts', { count: results.length, threshold });
      return results.slice(0, 5); // Return top 5
    } catch (error) {
      logger.error('Find similar error', error);
      return [];
    }
  }

  async getStats(): Promise<{
    total: number;
    byStyle: Record<string, number>;
    avgScore: number;
  }> {
    try {
      const stats = {
        total: 0,
        byStyle: {} as Record<string, number>,
        avgScore: 0,
      };
      
      const list = await this.kv.list({ prefix: 'prompt:' });
      let totalScore = 0;
      
      for (const key of list.keys) {
        const metadata = key.metadata as any;
        if (!metadata) continue;
        
        stats.total++;
        totalScore += metadata.score || 0;
        
        const style = metadata.style || 'unknown';
        stats.byStyle[style] = (stats.byStyle[style] || 0) + 1;
      }
      
      stats.avgScore = stats.total > 0 ? totalScore / stats.total : 0;
      
      logger.info('Cache stats', stats);
      return stats;
    } catch (error) {
      logger.error('Get stats error', error);
      return { total: 0, byStyle: {}, avgScore: 0 };
    }
  }

  private normalizeKey(prompt: string): string {
    // Create a normalized key from the prompt
    return prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 100);
  }

  private calculateSimpleSimilarity(prompt1: string, prompt2: string): number {
    const words1 = new Set(prompt1.toLowerCase().split(/\\s+/));
    const words2 = new Set(prompt2.toLowerCase().split(/\\s+/));
    
    let commonWords = 0;
    for (const word of words1) {
      if (words2.has(word)) {
        commonWords++;
      }
    }
    
    return commonWords / Math.max(words1.size, words2.size);
  }
}