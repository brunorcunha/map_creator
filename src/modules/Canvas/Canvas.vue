<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator';
import { useAppStore } from '@/store/app';

import { CanvasWebGL } from '@/helpers/canvas';

import type { AppLayer, OpenedMap } from '@/store/types';

@Component({})
export default class Canvas extends Vue {
  private appStore = useAppStore();

  get files(): OpenedMap[] {
    return this.appStore.files;
  }
  get currentFile(): number | null {
    return this.appStore.currentFile;
  }
  get file(): OpenedMap | null {
    if (this.currentFile == null) return null;
    return this.files[this.currentFile];
  }

  get tilemaps() {
    return this.appStore.tilemaps;
  }

  get currentTilemap(): number | null {
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

  get loading(): boolean {
    return this.appStore.loading;
  }
  set loading(loading: boolean) {
    this.appStore.loading = loading;
  }

  get pos(): number[] {
    return this.appStore.pos;
  }
  set pos(pos: number[]) {
    this.appStore.pos = pos;
  }

  get layers(): AppLayer[] {
    return this.appStore.currentLayers;
  }

  get tileInfo(): string {
    return this.appStore.tileInfo;
  }
  set tileInfo(value: string) {
    this.appStore.tileInfo = value;
  }

  @Watch('layers')
  onLayersChange() {
    this.draw();
  }

  @Watch('file')
  onFileChange(val: number) {
    if (!val) CanvasWebGL.clear();
    else this.draw();
  }

  @Watch('currentTilemap')
  onCurrentTilemapChange() {
    this.draw();
  }

  @Watch('pos')
  onPosChange() {
    this.moveDraw();
  }

  mounted() {
    const canvas = this.$refs.canvas as HTMLDivElement;
    //@ts-ignore
    CanvasWebGL.init(canvas);

    let offsetX = 0,
      offsetY = 0;
    let isDragging = false;
    let startX: number, startY: number;
    let tileX: number, tileY: number;

    canvas?.addEventListener('mousedown', (ev) => {
      isDragging = true;
      startX = this.pos[0] + ev.clientX;
      startY = this.pos[1] + ev.clientY;
    });

    canvas?.addEventListener('mouseup', () => (isDragging = false));
    canvas?.addEventListener('mouseleave', () => {
      isDragging = false;
      if (this.file?.image) {
        CanvasWebGL.drawImage(this.file.image, this.pos);
      }
    });
    canvas?.addEventListener('mousemove', (ev) => {
      if (isDragging && canvas) {
        offsetX = startX - ev.clientX;
        offsetY = startY - ev.clientY;
        this.pos = [offsetX, offsetY];
      }

      const mouse = [ev.offsetX, ev.offsetY];
      const offset = [-this.pos[0], -this.pos[1]];
      if (
        mouse[0] >= offset[0] &&
        mouse[0] <= offset[0] + 4096 &&
        mouse[1] >= offset[1] &&
        mouse[1] <= offset[1] + 4096
      ) {
        const tile = [Math.floor((ev.offsetX + offsetX) / 32), Math.floor((ev.offsetY + offsetY) / 32)];
        if (tile[0] !== tileX || tile[1] !== tileY) {
          if (!this.file?.content.tiles[tile[0]]) return;
          const [id1, id2] = this.file?.content.tiles[tile[0]][tile[1]] || [null, null];
          const index = tile[1] * 128 + tile[0];
          let str = `${index} • [${tile[0]}, ${tile[1]}]`;
          if (id1) {
            const astar = this.astar?.[id1[2] + 1];
            const astar1 = astar === 1 ? 'Bloqueado' : astar === 2 ? 'Semi-Bloqueado' : 'Desbloqueado';
            str += ` • ID1 ${id1[2]} (${astar1})`;
          }
          if (id2) {
            const astar = this.astar?.[id2[2] + 1];
            const astar2 = astar === 1 ? 'Bloqueado' : astar === 2 ? 'Semi-Bloqueado' : 'Desbloqueado';
            str += ` • ID2 ${id2[2]} (${astar2})`;
          }
          this.tileInfo = str;
        }
        tileX = tile[0];
        tileY = tile[1];

        if (this.file?.image) {
          CanvasWebGL.drawImage(this.file.image, this.pos, mouse);
        }
      }
    });

    window.addEventListener('resize', this.draw);
  }

  unmounted() {
    window.removeEventListener('resize', this.draw);
  }

  moveDraw() {
    if (this.file == null || !this.file.image) return;

    CanvasWebGL.drawImage(this.file.image, this.pos);
  }

  async draw() {
    if (this.file == null) {
      CanvasWebGL.clear();
      return;
    }

    this.loading = true;

    // Se existe um tilemap selecionado
    if (this.appStore.currentTilemap != null) {
      // Se a imagem do mapa não foi gerada ou o tilemap foi alterado
      if (
        !this.file.image ||
        this.file.currentTilemap !== this.appStore.currentTilemap ||
        this.file.currentLayers !== this.layers.join('')
      ) {
        // Atualiza o tilemap do mapa para o timemap atual
        this.file.currentTilemap = this.appStore.currentTilemap;
        // Verifica se o tilemap possui uma imagem
        const tilemap = this.appStore.tilemaps[this.file.currentTilemap]?.image;
        const astar = this.appStore.tilemaps[this.file.currentTilemap]?.content.astar;
        if (tilemap) {
          // Desenha o mapa e salva a imagem no store
          this.file.image = await CanvasWebGL.drawMap(this.file.content.tiles, tilemap, this.layers, astar);
          this.file.currentLayers = this.layers.join('');
        }
      }

      // Se a imagem do mapa foi gerada
      if (this.file.image) {
        // Mostra na view principal
        CanvasWebGL.drawImage(this.file.image, this.pos);
      }
    }

    this.loading = false;
  }
}
</script>

<template>
  <div id="canvas" ref="canvas" />
</template>

<style>
#canvas {
  width: 100%;
  height: 100%;
  background-color: #1e1e1e;
  border-right: 3px solid black;
  background-image: url(/blank_space.png);
  background-position: 70px 15px;
}
</style>
