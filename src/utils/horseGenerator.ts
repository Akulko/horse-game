import type { Horse } from '../types'

const HORSE_NAMES = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton', 'Joan Clarke', 'Katherine Johnson', 'Dorothy Vaughan', 'Mary Jackson', 'Hedy Lamarr', 'Radia Perlman', 'Barbara Liskov', 'Frances Allen', 'Carol Shaw', 'Adele Goldberg', 'Jean Jennings', 'Betty Snyder', 'Marlyn Wescoff', 'Ruth Lichterman', 'Fran Bilas', 'Kay McNulty', 'Rosalind Franklin']

const HORSE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85929E', '#D5A6BD', '#A9CCE3', '#D7DBDD', '#FADBD8', '#D1F2EB', '#FCF3CF']

export function generateHorses(): Horse[] {
  return HORSE_NAMES.map((name, index) => ({ id: index + 1, name, condition: Math.floor(Math.random() * 100) + 1, color: HORSE_COLORS[index], position: 0 }))
}

export function selectRandomHorses(horses: Horse[], count: number): Horse[] {
  return [...horses].sort(() => Math.random() - 0.5).slice(0, count)
}