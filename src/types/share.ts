export type Rating = 'Excellent' | 'Bon' | 'Correct' | 'Mauvais' | 'Médiocre';

export interface ShareRating {
  valorisation: number; // Score sur 100
  croissance: number; // Score sur 100
  profitabilite: number; // Score sur 100
  santeFInanciere: number; // Score sur 100
  retourInvestisseurs: number; // Score sur 100
}

export interface Share {
  id: string;
  name: string;
  company: string; // Nom complet de l'entreprise
  logo?: string;
  logoColor?: string; // Couleur de fallback pour le logo
  globalScore: number; // Note sur 100
  ratings: ShareRating;
}
