import { createLogger } from '../../workers/api_generate/src/logger';

const logger = createLogger('similarity');

// Simple vector embeddings for demonstration
// In production, would use a proper embedding model
export class SimilarityScorer {
  private referenceEmbeddings: Map<string, number[]> = new Map();

  constructor() {
    this.initializeReferenceEmbeddings();
  }

  private initializeReferenceEmbeddings() {
    // Predefined embeddings for each style
    this.referenceEmbeddings.set('wizard', this.createStyleVector([
      'magical', 'mystical', 'staff', 'ethereal', 'ancient', 'symbols', 'glow'
    ]));
    
    this.referenceEmbeddings.set('cosmic', this.createStyleVector([
      'space', 'stars', 'nebula', 'galaxy', 'cosmic', 'celestial', 'universe'
    ]));
    
    this.referenceEmbeddings.set('cyber', this.createStyleVector([
      'neon', 'digital', 'cyber', 'tech', 'futuristic', 'circuit', 'chrome'
    ]));
  }

  private createStyleVector(keywords: string[]): number[] {
    // Create a simple vector based on keywords
    const vector = new Array(50).fill(0);
    
    keywords.forEach((keyword, index) => {
      const hash = this.hashString(keyword);
      const position = hash % vector.length;
      vector[position] = 1;
    });
    
    return this.normalizeVector(vector);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0)
    );
    
    if (magnitude === 0) return vector;
    
    return vector.map(val => val / magnitude);
  }

  private extractPromptVector(prompt: string): number[] {
    // Extract keywords from prompt
    const words = prompt.toLowerCase().split(/\\s+/);
    const vector = new Array(50).fill(0);
    
    words.forEach(word => {
      const hash = this.hashString(word);
      const position = hash % vector.length;
      vector[position] += 1;
    });
    
    return this.normalizeVector(vector);
  }

  calculateCosineSimilarity(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) {
      throw new Error('Vectors must have the same length');
    }
    
    let dotProduct = 0;
    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
    }
    
    return dotProduct; // Vectors are already normalized
  }

  async scoreImage(imageData: {
    prompt: string;
    style: string;
    imageUrl?: string;
  }): Promise<{
    score: number;
    features: {
      style_alignment: number;
      prompt_relevance: number;
      overall_quality: number;
    };
  }> {
    try {
      const { prompt, style } = imageData;
      
      // Get reference embedding for style
      const referenceVector = this.referenceEmbeddings.get(style);
      if (!referenceVector) {
        logger.warn('No reference embedding for style', { style });
        return this.getDefaultScore();
      }
      
      // Extract prompt vector
      const promptVector = this.extractPromptVector(prompt);
      
      // Calculate style alignment
      const styleAlignment = this.calculateCosineSimilarity(promptVector, referenceVector);
      
      // Simulate prompt relevance (in production, would analyze the actual image)
      const promptRelevance = Math.random() * 0.3 + 0.6; // 0.6-0.9
      
      // Overall quality based on multiple factors
      const overallQuality = (styleAlignment * 0.6 + promptRelevance * 0.4);
      
      const features = {
        style_alignment: styleAlignment,
        prompt_relevance: promptRelevance,
        overall_quality: overallQuality,
      };
      
      logger.info('Image scored', { 
        style, 
        score: overallQuality, 
        features 
      });
      
      return {
        score: overallQuality,
        features,
      };
    } catch (error) {
      logger.error('Scoring error', error);
      return this.getDefaultScore();
    }
  }

  findSimilarPrompts(
    prompt: string,
    candidates: { prompt: string; score: number }[],
    topK: number = 5
  ): { prompt: string; score: number; similarity: number }[] {
    const promptVector = this.extractPromptVector(prompt);
    
    const scored = candidates.map(candidate => {
      const candidateVector = this.extractPromptVector(candidate.prompt);
      const similarity = this.calculateCosineSimilarity(promptVector, candidateVector);
      
      return {
        ...candidate,
        similarity,
      };
    });
    
    // Sort by similarity and return top K
    return scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  private getDefaultScore() {
    return {
      score: 0.5,
      features: {
        style_alignment: 0.5,
        prompt_relevance: 0.5,
        overall_quality: 0.5,
      },
    };
  }
}

// Export singleton instance
export const similarityScorer = new SimilarityScorer();