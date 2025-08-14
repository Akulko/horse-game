<template>
  <div class="bg-yellow-200 p-4 rounded-lg shadow-md">
    <h2 class="text-lg font-bold mb-4 text-center">Horse List (1 - 20)</h2>
    <div class="bg-white rounded p-2">
      <div class="grid grid-cols-3 gap-2 text-sm font-semibold border-b pb-1">
        <div>Name</div>
        <div class="text-center">Condition</div>
        <div class="text-center">Color</div>
      </div>
      <div class="max-h-64 overflow-y-auto">
        <div
          v-for="horse in horses"
          :key="horse.id"
          class="grid grid-cols-3 gap-2 text-sm py-1 border-b border-gray-100 last:border-b-0"
        >
          <div class="truncate">{{ horse.name }}</div>
          <div class="text-center">{{ horse.condition }}</div>
          <div class="text-center">
            <div
              class="w-4 h-4 rounded-full inline-block border border-gray-300"
              :style="{ backgroundColor: horse.color }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { GameState } from '../types'

const store = useStore<GameState>()

const horses = computed(() => store.state.horses)
</script>