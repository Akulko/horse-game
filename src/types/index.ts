export interface Horse {
  id: number
  name: string
  condition: number
  color: string
  position?: number
}

export interface Race {
  id: number
  round: number
  distance: number
  horses: Horse[]
  results: RaceResult[]
  status: 'pending' | 'running' | 'completed'
}

export interface RaceResult {
  position: number
  horse: Horse
  time?: string
}

export interface RaceSchedule {
  races: Race[]
  currentRaceIndex: number
}

export interface GameState {
  horses: Horse[]
  raceSchedule: RaceSchedule | null
  isGameRunning: boolean
  isRaceInProgress: boolean
  isPaused: boolean
}