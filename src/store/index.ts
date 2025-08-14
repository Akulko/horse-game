import { createStore } from 'vuex'
import type { GameState, Horse, Race, RaceSchedule } from '../types'
import { generateHorses, selectRandomHorses } from '../utils/horseGenerator'
import { simulateHorseMovement } from '../utils/raceEngine'

const RACE_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]

let raceController: AbortController | null = null

const store = createStore<GameState>({
  state: {
    horses: [],
    raceSchedule: null,
    isGameRunning: false,
    isRaceInProgress: false,
    isPaused: false
  },

  mutations: {
    SET_HORSES(state, horses: Horse[]) {
      state.horses = horses
    },

    SET_RACE_SCHEDULE(state, schedule: RaceSchedule) {
      state.raceSchedule = schedule
    },

    SET_GAME_RUNNING(state, isRunning: boolean) {
      state.isGameRunning = isRunning
    },

    SET_RACE_IN_PROGRESS(state, inProgress: boolean) {
      state.isRaceInProgress = inProgress
    },

    SET_PAUSED(state, isPaused: boolean) {
      state.isPaused = isPaused
    },

    UPDATE_RACE_STATUS(state, { raceIndex, status }: { raceIndex: number, status: Race['status'] }) {
      if (state.raceSchedule) {
        state.raceSchedule.races[raceIndex].status = status
      }
    },

    UPDATE_RACE_RESULTS(state, { raceIndex, results }: { raceIndex: number, results: any[] }) {
      if (state.raceSchedule) {
        state.raceSchedule.races[raceIndex].results = results
      }
    },

    UPDATE_CURRENT_RACE_INDEX(state, index: number) {
      if (state.raceSchedule) {
        state.raceSchedule.currentRaceIndex = index
      }
    },

    UPDATE_HORSE_POSITIONS(state, horses: Horse[]) {
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

      const races: Race[] = RACE_DISTANCES.map((distance, index) => ({
        id: index + 1,
        round: index + 1,
        distance,
        horses: selectRandomHorses(state.horses, 10).map(horse => ({
          ...horse,
          position: 0
        })),
        results: [],
        status: 'pending'
      }))

      const schedule: RaceSchedule = {
        races,
        currentRaceIndex: 0
      }

      commit('SET_RACE_SCHEDULE', schedule)
    },

    async startRaces({ commit, state, dispatch }) {
      if (!state.raceSchedule) return

      raceController = new AbortController()
      commit('SET_GAME_RUNNING', true)
      commit('SET_PAUSED', false)

      try {
        for (let i = 0; i < state.raceSchedule.races.length; i++) {
          if (raceController.signal.aborted) break
          commit('UPDATE_CURRENT_RACE_INDEX', i)
          await dispatch('runSingleRace', i)
          if (i < state.raceSchedule.races.length - 1 && !raceController.signal.aborted) {
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(resolve, 1000)
              raceController!.signal.addEventListener('abort', () => { clearTimeout(timeout); reject(new Error('Race stopped')) })
            })
          }
        }
      } catch (error) {}
      commit('SET_GAME_RUNNING', false)
      commit('SET_PAUSED', false)
    },

    stopRaces({ commit }) {
      if (raceController) {
        raceController.abort()
        raceController = null
      }
      commit('SET_GAME_RUNNING', false)
      commit('SET_RACE_IN_PROGRESS', false)
      commit('SET_PAUSED', false)
    },

    async runSingleRace({ commit, state }, raceIndex: number) {
      if (!state.raceSchedule) return
      const race = state.raceSchedule.races[raceIndex]
      commit('SET_RACE_IN_PROGRESS', true)
      commit('UPDATE_RACE_STATUS', { raceIndex, status: 'running' })
      try {
        const results = await simulateHorseMovement(race.horses, race.distance, raceController?.signal)
        commit('UPDATE_RACE_RESULTS', { raceIndex, results })
        commit('UPDATE_RACE_STATUS', { raceIndex, status: 'completed' })
      } catch (error) {}
      commit('SET_RACE_IN_PROGRESS', false)
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

export default store