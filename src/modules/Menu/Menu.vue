<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

import { useAppStore } from '@/store/app';

import { MapName } from '@/helpers/mapName';

import type { OpenedMap } from '@/store/types';

@Component({})
export default class Menu extends Vue {
  private appStore = useAppStore();

  get mapName(): string {
    if (!this.file) return '';
    const mapName = MapName.getMapName(this.file.name);
    if (!mapName) return '';
    return `[${mapName[3].toUpperCase()}] • ${mapName[2]} • ID ${mapName[1]}`;
  }

  get files(): OpenedMap[] {
    return this.appStore.files;
  }

  get currentFile(): number | null {
    return this.appStore.currentFile;
  }

  get file(): OpenedMap | null {
    return this.currentFile != null ? this.files[this.currentFile] : null;
  }
}
</script>

<template>
  <v-system-bar>
    <v-icon class="me-2" icon="mdi-map-marker"></v-icon>

    <span>{{ mapName }}</span>

    <v-spacer />

    <v-icon>mdi-square</v-icon>

    <v-icon>mdi-circle</v-icon>

    <v-icon>mdi-triangle</v-icon>
  </v-system-bar>
</template>
