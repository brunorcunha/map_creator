import { defineStore } from 'pinia';

import { AppAction, AppLayer } from '@/store/types';
import { CanvasWebGL } from '@/helpers/canvas';
import { ReadFile } from '@/helpers/readFile';

import type { AppState } from '@/store/types';

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    currentAction: AppAction.EDIT,
    currentLayers: [AppLayer.LAYER1, AppLayer.LAYER2],

    files: [],
    currentFile: null,

    tilemaps: [],
    currentTilemap: null,

    loading: false,

    pos: [0, 0],
    zoom: 1,

    gridInfo: '',
    tileInfo: ''
  }),
  actions: {
    async resolveFiles(files: File[]) {
      let lastFile = this.currentFile;
      let lastTilemap = this.currentTilemap;

      for await (const file of files) {
        const fileName = file.name.toLowerCase();

        // MAP
        if (fileName.endsWith('.map')) {
          // Se já foi carregado, não carrega novamente
          if (this.files.some((f) => f.name === fileName)) {
            lastFile = this.files.findIndex((f) => f.name === fileName);
            continue;
          }

          try {
            const content = await ReadFile.readMap(file);
            this.files.push({
              name: fileName,
              content,
              image: null,
              currentTilemap: null,
              currentLayers: this.currentLayers.join('')
            });
            lastFile = this.files.length - 1;
          } catch (error) {
            console.error(error);
          }
          // CIL
        } else if (fileName.endsWith('.cil')) {
          // Se já foi carregado, não carrega novamente
          if (this.tilemaps.some((t) => t.name === fileName)) {
            lastTilemap = this.tilemaps.findIndex((f) => f.name === fileName);
            continue;
          }

          try {
            const content = await ReadFile.readCil(file);
            const image = await CanvasWebGL.drawTilemap(content.pixels);
            this.tilemaps.push({ name: fileName, content, image });
            lastTilemap = this.tilemaps.length - 1;
          } catch (error) {
            console.error(error);
          }
        }
      }
      this.currentFile = lastFile;
      this.currentTilemap = lastTilemap;
    }
  }
});
