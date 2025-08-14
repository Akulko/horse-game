import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { GameState } from './types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<GameState>
  }
}