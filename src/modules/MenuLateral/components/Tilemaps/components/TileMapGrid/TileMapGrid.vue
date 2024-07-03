<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

import { useAppStore } from '@/store/app';

import { AppLayer } from '@/store/types';

@Component({})
export default class TileMapGrid extends Vue {
  private appStore = useAppStore();

  get tilemaps() {
    return this.appStore.tilemaps;
  }

  get currentTilemap() {
    return this.appStore.currentTilemap;
  }

  get tilemap() {
    if (this.currentTilemap == null) return null;
    return this.tilemaps[this.currentTilemap];
  }

  get astar() {
    if (!this.tilemap) return null;
    return this.tilemap.content.astar;
  }

  get layers() {
    return this.appStore.currentLayers;
  }

  get AStarEnabled() {
    return this.layers.includes(AppLayer.ASTAR);
  }

  get gridInfo(): string {
    return this.appStore.gridInfo;
  }
  set gridInfo(value: string) {
    this.appStore.gridInfo = value;
  }

  mounted() {
    const table = document.getElementById('grid');

    table?.addEventListener('mouseover', (event) => {
      const cell = event.target;
      //@ts-ignore
      if (cell?.tagName.toLowerCase() === 'td') {
        //@ts-ignore
        const row = cell.parentElement;
        const y = Array.from(row.parentElement.children).indexOf(row);
        const x = Array.from(row.children).indexOf(cell);
        const id = y * 20 + x + 1;
        const astar = this.astar?.[id] === 1 ? 'Bloqueado' : this.astar?.[id] === 2 ? 'Semi-Bloqueado' : 'Desbloqueado';
        this.gridInfo = `[${x}, ${y}] • ${id} • ${astar}`;
      }
    });
  }
}
</script>

<template>
  <table id="grid">
    <tbody>
      <tr v-for="row in 135" :key="row">
        <template v-if="AStarEnabled && astar">
          <td
            v-for="col in 20"
            :key="`${row}-${col}-${AStarEnabled}`"
            :class="`astar${astar[(row - 1) * 20 + col]}`"
          ></td>
        </template>
        <template v-else>
          <td v-for="col in 20" :key="`${row}-${col}`"></td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
#grid {
  position: absolute;
  border-collapse: collapse;
  table-layout: fixed;
  width: 320px;
  top: 0;
  left: 0;
}
#grid td {
  border: 1px dashed rgba(255, 255, 255, 0.1);
  height: 16px;
  width: 16px;
  font-size: 8px;
}
#grid td:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.2);
}
#grid td:active {
  background-color: rgba(255, 255, 255, 0.4);
}
#grid td.astar1 {
  background-color: rgba(255, 0, 0, 0.3);
}
#grid td.astar1:hover {
  background-color: rgba(255, 0, 0, 0.6);
}
#grid td.astar1:active {
  background-color: rgba(255, 0, 0, 0.8);
}
#grid td.astar2 {
  background-color: rgba(255, 255, 0, 0.3);
}
#grid td.astar2:hover {
  background-color: rgba(255, 255, 0, 0.6);
}
#grid td.astar2:active {
  background-color: rgba(255, 255, 0, 0.8);
}
</style>
