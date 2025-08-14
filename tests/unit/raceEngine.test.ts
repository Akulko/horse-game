import { describe, it, expect } from 'vitest'
import { calculateRaceResults } from '@/utils/raceEngine'
import type { Horse } from '@/types'

describe('Race Engine', () => {
  describe('calculateRaceResults', () => {
    const mockHorses: Horse[] = [
      { id: 1, name: 'Fast Horse', condition: 90, color: '#FF0000', position: 0 },
      { id: 2, name: 'Slow Horse', condition: 30, color: '#00FF00', position: 0 },
      { id: 3, name: 'Medium Horse', condition: 60, color: '#0000FF', position: 0 }
    ]

    it('should return results for all horses', () => {
      const results = calculateRaceResults(mockHorses, 1200)
      expect(results).toHaveLength(3)
    })

    it('should assign positions from 1 to number of horses', () => {
      const results = calculateRaceResults(mockHorses, 1200)
      const positions = results.map(r => r.position).sort()
      expect(positions).toEqual([1, 2, 3])
    })

    it('should include time for each result', () => {
      const results = calculateRaceResults(mockHorses, 1200)
      results.forEach(result => {
        expect(result.time).toBeDefined()
        expect(typeof result.time).toBe('string')
        expect(parseFloat(result.time!)).toBeGreaterThan(0)
      })
    })

    it('should include horse information in results', () => {
      const results = calculateRaceResults(mockHorses, 1200)
      results.forEach(result => {
        expect(result.horse).toBeDefined()
        expect(mockHorses.map(h => h.id)).toContain(result.horse.id)
      })
    })

    it('should sort results by time (fastest first)', () => {
      const results = calculateRaceResults(mockHorses, 1200)
      for (let i = 1; i < results.length; i++) {
        const previousTime = parseFloat(results[i - 1].time!)
        const currentTime = parseFloat(results[i].time!)
        expect(previousTime).toBeLessThanOrEqual(currentTime)
      }
    })
  })
})