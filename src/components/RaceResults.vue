<template>
  <div class="space-y-4">
    <div class="bg-white rounded-lg shadow-md p-3 sm:p-4 max-h-80 overflow-y-auto">
      <h3 class="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center bg-blue-500 text-white p-2 rounded">
        Program
      </h3>
      
      <div v-if="raceSchedule" class="space-y-3">
        <div
          v-for="race in raceSchedule.races"
          :key="race.id"
          class="border rounded-lg p-3"
          :class="getRaceStatusClass(race)"
        >
          <div class="bg-orange-400 text-white text-center py-2 rounded text-sm font-bold mb-3">
            {{ getOrdinal(race.round) }} Lap - {{ race.distance }}m
            <span v-if="race.status === 'running'" class="ml-2 animate-pulse">RUNNING</span>
            <span v-else-if="race.status === 'completed'" class="ml-2">DONE</span>
          </div>
          
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="font-semibold text-gray-600">Lane</div>
            <div class="font-semibold text-gray-600">Horse</div>
          </div>
          
          <div
            v-for="(horse, index) in race.horses"
            :key="horse.id"
            class="grid grid-cols-2 gap-2 text-xs py-1 border-t border-gray-200"
          >
            <div class="font-medium">{{ index + 1 }}</div>
            <div class="truncate">{{ horse.name }}</div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center text-gray-500 py-12">
        <div class="text-4xl mb-4">🐎</div>
        <div>Click GENERATE to create race schedule</div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-3 sm:p-4 max-h-80 overflow-y-auto">
      <h3 class="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center bg-green-500 text-white p-2 rounded">
        Results
      </h3>
      
      <div v-if="completedRaces.length" class="space-y-3">
        <div
          v-for="race in completedRaces"
          :key="`result-${race.id}`"
          class="border rounded-lg p-3 bg-green-50"
        >
          <div class="bg-green-600 text-white text-center py-2 rounded text-sm font-bold mb-3">
            {{ getOrdinal(race.round) }} Lap - {{ race.distance }}m Final Results
          </div>
          
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="font-semibold text-gray-600">Position</div>
            <div class="font-semibold text-gray-600">Horse</div>
            <div class="font-semibold text-gray-600">Time</div>
          </div>
          
          <div
            v-for="result in race.results.slice(0, 3)"
            :key="`result-${result.horse.id}`"
            class="grid grid-cols-3 gap-2 text-xs py-1 border-t border-gray-200"
            :class="getPositionClass(result.position)"
          >
            <div class="font-bold">{{ result.position }}</div>
            <div class="truncate">{{ result.horse.name }}</div>
            <div>{{ result.time }}s</div>
          </div>
          
          <details v-if="race.results.length > 3" class="mt-2">
            <summary class="text-xs text-gray-500 cursor-pointer">Show all {{ race.results.length }} results</summary>
            <div
              v-for="result in race.results.slice(3)"
              :key="`full-result-${result.horse.id}`"
              class="grid grid-cols-3 gap-2 text-xs py-1 border-t border-gray-100"
            >
              <div>{{ result.position }}</div>
              <div class="truncate">{{ result.horse.name }}</div>
              <div>{{ result.time }}s</div>
            </div>
          </details>
        </div>
      </div>
      
      <div v-else class="text-center text-gray-500 py-12">
        <div class="text-4xl mb-4">🏁</div>
        <div>Race results will appear here after completion</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { GameState } from '../types'

const store = useStore<GameState>()

const raceSchedule = computed(() => store.state.raceSchedule)
const completedRaces = computed(() => store.getters.completedRaces)

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function getRaceStatusClass(race: any): string {
  switch (race.status) {
    case 'running':
      return 'border-yellow-400 bg-yellow-50'
    case 'completed':
      return 'border-green-400 bg-green-50'
    default:
      return 'border-gray-300'
  }
}

function getPositionClass(position: number): string {
  switch (position) {
    case 1:
      return 'bg-yellow-100'
    case 2:
      return 'bg-gray-100'
    case 3:
      return 'bg-orange-100'
    default:
      return ''
  }
}
</script>