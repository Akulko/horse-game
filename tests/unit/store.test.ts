import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import type { GameState } from '@/types'
import { generateHorses, selectRandomHorses } from '@/utils/horseGenerator'
import { simulateHorseMovement } from '@/utils/raceEngine'

const RACE_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]

describe('Vuex Store', () => {
  let store: ReturnType<typeof createStore<GameState>>

  beforeEach(() => {
    store = createStore<GameState>({
      state: {
        horses: [],
        raceSchedule: null,
        isGameRunning: false,
        isRaceInProgress: false
      },

      mutations: {
        SET_HORSES(state, horses) {
          state.horses = horses
        },

        SET_RACE_SCHEDULE(state, schedule) {
          state.raceSchedule = schedule
        },

        SET_GAME_RUNNING(state, isRunning) {
          state.isGameRunning = isRunning
        },

        SET_RACE_IN_PROGRESS(state, inProgress) {
          state.isRaceInProgress = inProgress
        },

        UPDATE_RACE_STATUS(state, { raceIndex, status }) {
          if (state.raceSchedule) {
            state.raceSchedule.races[raceIndex].status = status
          }
        },

        UPDATE_RACE_RESULTS(state, { raceIndex, results }) {
          if (state.raceSchedule) {
            state.raceSchedule.races[raceIndex].results = results
          }
        },

        UPDATE_CURRENT_RACE_INDEX(state, index) {
          if (state.raceSchedule) {
            state.raceSchedule.currentRaceIndex = index
          }
        },

        UPDATE_HORSE_POSITIONS(state, horses) {
          if (state.raceSchedule) {
            const currentRace = state.raceSchedule.races[state.raceSchedule.currentRaceIndex]
            if (currentRace) {
              currentRace.horses = horses
            }
          }
        }
      },

      actions: {
        generateHorses({ commit }) {
          const horses = generateHorses()
          commit('SET_HORSES', horses)
        },

        generateRaceSchedule({ commit, state }) {
          if (state.horses.length === 0) return

          const races = RACE_DISTANCES.map((distance, index) => ({
            id: index + 1,
            round: index + 1,
            distance,
            horses: selectRandomHorses(state.horses, 10),
            results: [],
            status: 'pending' as const
          }))

          const schedule = {
            races,
            currentRaceIndex: 0
          }

          commit('SET_RACE_SCHEDULE', schedule)
        }
      },

      getters: {
        currentRace: (state) => {
          if (!state.raceSchedule) return null
          return state.raceSchedule.races[state.raceSchedule.currentRaceIndex]
        },

        completedRaces: (state) => {
          if (!state.raceSchedule) return []
          return state.raceSchedule.races.filter(race => race.status === 'completed')
        }
      }
    })
  })

  describe('initial state', () => {
    it('should have empty horses array', () => {
      expect(store.state.horses).toEqual([])
    })

    it('should have null race schedule', () => {
      expect(store.state.raceSchedule).toBeNull()
    })

    it('should not be running', () => {
      expect(store.state.isGameRunning).toBe(false)
      expect(store.state.isRaceInProgress).toBe(false)
    })
  })

  describe('actions', () => {
    it('should generate horses', () => {
      store.dispatch('generateHorses')
      expect(store.state.horses).toHaveLength(20)
    })

    it('should generate race schedule after horses are generated', () => {
      store.dispatch('generateHorses')
      store.dispatch('generateRaceSchedule')
      
      expect(store.state.raceSchedule).not.toBeNull()
      expect(store.state.raceSchedule!.races).toHaveLength(6)
      
      const distances = [1200, 1400, 1600, 1800, 2000, 2200]
      store.state.raceSchedule!.races.forEach((race, index) => {
        expect(race.distance).toBe(distances[index])
        expect(race.horses).toHaveLength(10)
        expect(race.status).toBe('pending')
      })
    })
  })

  describe('getters', () => {
    it('should return current race', () => {
      store.dispatch('generateHorses')
      store.dispatch('generateRaceSchedule')
      
      const currentRace = store.getters.currentRace
      expect(currentRace).toBe(store.state.raceSchedule!.races[0])
    })

    it('should return completed races', () => {
      store.dispatch('generateHorses')
      store.dispatch('generateRaceSchedule')
      
      store.commit('UPDATE_RACE_STATUS', { raceIndex: 0, status: 'completed' })
      store.commit('UPDATE_RACE_STATUS', { raceIndex: 1, status: 'completed' })
      
      const completedRaces = store.getters.completedRaces
      expect(completedRaces).toHaveLength(2)
    })
  })
})