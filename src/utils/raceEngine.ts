import type { Horse, RaceResult } from '../types'

export function calculateRaceResults(horses: Horse[], distance: number): RaceResult[] {
  const results = horses.map(horse => ({ horse, time: (distance / 10 * (1 + (100 - horse.condition) / 100 + Math.random() * 0.3 - 0.15)).toFixed(3), position: 0 }))
  results.sort((a, b) => parseFloat(a.time!) - parseFloat(b.time!))
  results.forEach((result, index) => result.position = index + 1)
  return results
}

export function simulateHorseMovement(horses: Horse[], distance: number, signal?: AbortSignal): Promise<RaceResult[]> {
  return new Promise((resolve, reject) => {
    const raceDuration = 3000, updateInterval = 50, totalUpdates = raceDuration / updateInterval
    let currentUpdate = 0
    horses.forEach(horse => horse.position = 0)
    const interval = setInterval(() => {
      if (signal?.aborted) { clearInterval(interval); reject(new Error('Race stopped')); return }
      currentUpdate++
      horses.forEach(horse => horse.position = Math.min((horse.position || 0) + (horse.condition / 100 + Math.random() * 0.1) * (distance / totalUpdates), distance))
      if (currentUpdate >= totalUpdates) { clearInterval(interval); resolve(calculateRaceResults(horses, distance)) }
    }, updateInterval)
  })
}