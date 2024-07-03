<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator';

import { useAppStore } from '@/store/app';

import type { OpenedMap } from '@/store/types';

@Component({})
export default class MiniMapa extends Vue {
  private appStore = useAppStore();
  private divCanvas: HTMLDivElement | null = null;
  private divViewport: HTMLDivElement | null = null;

  mapSize = 331;

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

  get showViewport() {
    return this.file != null && this.divCanvas != null;
  }

  get pos() {
    return this.appStore.pos;
  }
  set pos(pos: number[]) {
    this.appStore.pos = pos;
  }

  @Watch('pos')
  onPosChange(val: number[]) {
    if (!this.divViewport) return;
    const viewportSize = [this.divViewport!.clientWidth + 4, this.divViewport!.clientHeight + 4];
    let offsetX = val[0] / 12.374;
    let offsetY = val[1] / 12.374;
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX + viewportSize[0] > this.mapSize) offsetX = this.mapSize - viewportSize[0];
    if (offsetY + viewportSize[1] > this.mapSize) offsetY = this.mapSize - viewportSize[1];
    this.divViewport.style.left = `${offsetX}px`;
    this.divViewport.style.top = `${offsetY}px`;
  }

  @Watch('file')
  onMapChange() {
    const divMap = document.getElementById('mapSize');
    if (!divMap || !this.file) return;
    divMap.style.width = `${(this.file.content.width * 32) / 12.374}px`;
    divMap.style.height = `${(this.file.content.height * 32) / 12.374}px`;
    this.onResize();
  }

  mounted() {
    this.divCanvas = document.getElementById('canvas') as HTMLDivElement;
    this.divViewport = document.getElementById('viewport') as HTMLDivElement;

    const divMap = document.getElementById('map');

    let mouseDown = false;
    divMap?.addEventListener('mousedown', (ev) => {
      mouseDown = true;
      const rect = divMap.getBoundingClientRect();
      this.onMove(
        ev,
        this.divViewport!.clientWidth,
        this.divViewport!.clientHeight,
        ev.clientX - rect.left,
        ev.clientY - rect.top
      );
    });

    document.addEventListener('mouseup', () => (mouseDown = false));
    document.addEventListener('mousemove', (ev) => {
      if (!mouseDown || !divMap) return;
      const rect = divMap.getBoundingClientRect();
      this.onMove(
        ev,
        this.divViewport!.clientWidth,
        this.divViewport!.clientHeight,
        ev.clientX - rect.left,
        ev.clientY - rect.top
      );
    });

    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  unmounted() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.divViewport!.style.width = `${(this.divCanvas?.clientWidth || 0) / 12.374}px`;
    this.divViewport!.style.height = `${(this.divCanvas?.clientHeight || 0) / 12.374}px`;
  }

  onMove(ev: any, w: number, h: number, x: number, y: number) {
    const viewportSize = [w + 4, h + 4];
    let offsetX = x - viewportSize[0] / 2;
    let offsetY = y - viewportSize[1] / 2;
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX + viewportSize[0] > this.mapSize) offsetX = this.mapSize - viewportSize[0];
    if (offsetY + viewportSize[1] > this.mapSize) offsetY = this.mapSize - viewportSize[1];
    this.divViewport!.style.left = `${offsetX}px`;
    this.divViewport!.style.top = `${offsetY}px`;
    offsetX = offsetX * 12.374;
    offsetY = offsetY * 12.374;
    this.pos = [offsetX, offsetY];
  }
}
</script>

<template>
  <div id="map" class="position-relative" style="line-height: 0">
    <div v-show="showViewport" id="viewport"></div>
    <div v-show="showViewport" id="mapSize"></div>
    <img v-if="file?.image" :src="file?.image?.src" alt="Mini mapa" :width="mapSize" :height="mapSize" />
    <v-responsive v-else :min-height="mapSize" :min-width="mapSize" />
  </div>
</template>

<style scoped>
#viewport {
  position: absolute;
  border: 2px solid rgba(255, 0, 0, 0.7);
  box-sizing: border-box;
}
#mapSize {
  position: absolute;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-top: 0;
  border-left: 0;
  top: 0;
  left: 0;
}
#map > * {
  pointer-events: none;
}
</style>
