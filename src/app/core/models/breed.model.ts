/**
 * Breed model interfaces for cat API
 */

export interface Breed {
  id: string;
  name: string;
  temperament: string;
  origin: string;
  description: string;
  life_span: string;
  adaptability: number;
  affection_level: number;
  child_friendly: number;
  dog_friendly: number;
  energy_level: number;
  grooming: number;
  health_issues: number;
  intelligence: number;
  shedding_level: number;
  social_needs: number;
  stranger_friendly: number;
  vocalisation: number;
}

export interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}
