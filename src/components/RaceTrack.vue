<template>
  <div class="bg-green-600 p-4 rounded-lg shadow-md min-h-96 relative">
    <div class="absolute top-2 left-4 text-white text-sm font-medium">{{ currentRaceDistance }}m</div>
    <div class="absolute top-2 right-4 text-white text-lg font-bold">FINISH</div>
    
    <div v-if="currentRace" class="mt-8">
      <div v-for="(horse, index) in currentRace.horses" :key="horse.id" class="relative mb-4 pb-2">
        <div class="flex items-center gap-3">
          <div class="text-white text-sm font-bold w-6 text-center bg-white bg-opacity-20 rounded px-1">{{ index + 1 }}</div>
          <div class="flex-1 h-12 bg-green-500 bg-opacity-60 rounded-lg relative overflow-hidden border border-white border-opacity-30">
            <div class="absolute transition-all duration-100 ease-linear top-1/2 transform -translate-y-1/2" :style="{ left: `${getHorsePositionPercentage(horse)}%`, transform: 'translate(-50%, -50%)' }">
              <div class="text-3xl">🐎</div>
            </div>
            <div class="absolute right-0 top-0 h-full w-2 bg-red-500"></div>
            <div class="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white opacity-40"></div>
            <div class="absolute left-3 bottom-0 text-xs text-white font-medium bg-black bg-opacity-40 px-2 py-0.5 rounded-t max-w-32 truncate">{{ horse.name }}</div>
          </div>
        </div>
      </div>
      
      <div v-if="isRaceInProgress" class="text-center text-white mt-6 bg-black bg-opacity-20 rounded-lg p-3">
        <div class="text-lg font-bold">{{ currentRaceRound }} Lap - {{ currentRaceDistance }}m</div>
        <div class="text-sm opacity-90 animate-pulse">Race in progress...</div>
      </div>
    </div>
    
    <div v-else class="text-center text-white mt-16">
      <div class="text-4xl mb-4">🏇</div>
      <div class="text-lg font-medium">Click GENERATE to create race schedule</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { GameState } from '../types'

const store = useStore<GameState>()

const currentRace = computed(() => store.getters.currentRace)
const isRaceInProgress = computed(() => store.state.isRaceInProgress)

const currentRaceDistance = computed(() => currentRace.value?.distance || 0)
const currentRaceRound = computed(() => {
  const round = currentRace.value?.round
  return round ? getOrdinal(round) : ''
})

function getHorsePositionPercentage(horse: any): number {
  if (typeof horse.position !== 'number' || !currentRace.value) return 0
  if (horse.position === 0) return 0
  return Math.min((horse.position / currentRace.value.distance) * 88, 88) + 2
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
</script>