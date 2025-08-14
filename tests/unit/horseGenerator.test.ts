import { describe, it, expect } from 'vitest'
import { generateHorses, selectRandomHorses } from '@/utils/horseGenerator'

describe('Horse Generator', () => {
  describe('generateHorses', () => {
    it('should generate exactly 20 horses', () => {
      const horses = generateHorses()
      expect(horses).toHaveLength(20)
    })

    it('should generate horses with valid properties', () => {
      const horses = generateHorses()
      
      horses.forEach(horse => {
        expect(horse).toHaveProperty('id')
        expect(horse).toHaveProperty('name')
        expect(horse).toHaveProperty('condition')
        expect(horse).toHaveProperty('color')
        expect(horse).toHaveProperty('position')
        
        expect(typeof horse.id).toBe('number')
        expect(typeof horse.name).toBe('string')
        expect(typeof horse.condition).toBe('number')
        expect(typeof horse.color).toBe('string')
        expect(horse.condition).toBeGreaterThan(0)
        expect(horse.condition).toBeLessThanOrEqual(100)
        expect(horse.name.length).toBeGreaterThan(0)
        expect(horse.color.startsWith('#')).toBe(true)
      })
    })

    it('should generate horses with unique ids', () => {
      const horses = generateHorses()
      const ids = horses.map(h => h.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(horses.length)
    })
  })

  describe('selectRandomHorses', () => {
    it('should select the correct number of horses', () => {
      const allHorses = generateHorses()
      const selected = selectRandomHorses(allHorses, 10)
      expect(selected).toHaveLength(10)
    })

    it('should not modify the original array', () => {
      const allHorses = generateHorses()
      const originalLength = allHorses.length
      selectRandomHorses(allHorses, 5)
      expect(allHorses).toHaveLength(originalLength)
    })

    it('should select unique horses', () => {
      const allHorses = generateHorses()
      const selected = selectRandomHorses(allHorses, 10)
      const ids = selected.map(h => h.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(selected.length)
    })
  })
})