<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-7xl mx-auto">
      <div class="bg-red-400 text-white p-4 rounded-lg shadow-md mb-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 class="text-xl sm:text-2xl font-bold">Horse Racing</h1>
          <div class="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              @click="generateProgram"
              :disabled="isGameRunning"
              class="bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1 sm:flex-none"
            >
              GENERATE
            </button>
            <button
              @click="startRace"
              :disabled="!raceSchedule"
              class="px-3 py-2 rounded text-sm font-medium transition-colors flex-1 sm:flex-none"
              :class="isGameRunning ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300'"
            >
              {{ getStartButtonText() }}
            </button>
            <button
              v-if="isGameRunning"
              @click="stopRace"
              class="bg-red-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-600 transition-colors flex-1 sm:flex-none"
            >
              STOP
            </button>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div class="lg:col-span-1 order-1 lg:order-1">
          <HorseList />
        </div>
        
        <div class="lg:col-span-2 order-3 lg:order-2">
          <RaceTrack />
        </div>
        
        <div class="lg:col-span-1 order-2 lg:order-3">
          <RaceResults />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import HorseList from './components/HorseList.vue'
import RaceTrack from './components/RaceTrack.vue'
import RaceResults from './components/RaceResults.vue'
import type { GameState } from './types'

const store = useStore<GameState>()

const raceSchedule = computed(() => store.state.raceSchedule)
const isGameRunning = computed(() => store.state.isGameRunning)
const isRaceInProgress = computed(() => store.state.isRaceInProgress)

function generateProgram() {
  store.dispatch('generateRaceSchedule')
}

function startRace() {
  if (raceSchedule.value && !isGameRunning.value) {
    store.dispatch('startRaces')
  }
}

function stopRace() {
  store.dispatch('stopRaces')
}

function getStartButtonText(): string {
  if (isGameRunning.value) {
    return isRaceInProgress.value ? 'RACING...' : 'PAUSED'
  }
  return 'START RACES'
}

onMounted(() => {
  store.dispatch('generateHorses')
})
</script>