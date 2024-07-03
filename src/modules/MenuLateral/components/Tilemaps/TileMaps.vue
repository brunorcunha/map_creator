<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

import { useAppStore } from '@/store/app';

import { TileMapGrid } from './components/TileMapGrid';

import type { OpenedTilemap } from '@/store/types';

@Component({
  components: { TileMapGrid }
})
export default class TileMaps extends Vue {
  private appStore = useAppStore();

  get tilemaps(): OpenedTilemap[] {
    return this.appStore.tilemaps;
  }

  get currentTilemap(): number | null {
    return this.appStore.currentTilemap;
  }
  set currentTilemap(tilemap: number | null) {
    this.appStore.currentTilemap = tilemap;
  }

  get tilemap(): OpenedTilemap | null {
    if (this.currentTilemap == null) return null;
    return this.tilemaps[this.currentTilemap];
  }
}
</script>

<template>
  <div>
    <v-tabs v-model="currentTilemap" density="compact">
      <template v-for="(tilemap, index) in tilemaps" :key="`t${index}`">
        <v-tab>{{ tilemap.name }}</v-tab>
      </template>
    </v-tabs>
  </div>

  <v-divider />

  <div class="flex-grow-1 overflow-y-scroll">
    <v-tabs-window v-model="currentTilemap">
      <template v-for="(tilemap, index) in tilemaps" :key="`c${index}`">
        <v-tabs-window-item>
          <div class="position-relative">
            <img :src="tilemap.image?.src" width="320" alt="" />
            <TileMapGrid />
          </div>
        </v-tabs-window-item>
      </template>
    </v-tabs-window>
  </div>
</template>
