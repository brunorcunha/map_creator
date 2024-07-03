<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

import { useAppStore } from '@/store/app';

import { CloseBtn } from './components/CloseBtn';
import type { OpenedMap } from '@/store/types';

@Component({
  components: { CloseBtn }
})
export default class Tabs extends Vue {
  private appStore = useAppStore();

  showMenu = false;
  x = 0;
  y = 0;
  tabIndex: number | null = null;

  get currentFile(): number | null {
    return this.appStore.currentFile;
  }
  set currentFile(file: number | null) {
    this.appStore.currentFile = file;
  }

  get files(): OpenedMap[] {
    return this.appStore.files;
  }

  closeFile(tabIndex: number) {
    this.appStore.files.splice(tabIndex, 1);
    if (this.currentFile === tabIndex) {
      this.currentFile = this.files.length ? this.files.length - 1 : null;
    } else if (this.currentFile && this.currentFile > tabIndex) {
      this.currentFile--;
    }
  }

  closeOtherFiles() {
    if (this.tabIndex == null || this.files.length <= 1) return;
    this.appStore.files = [this.files[this.tabIndex]];
    this.currentFile = 0;
  }

  async show(ev: any, tabIndex: number) {
    if (this.files.length <= 1) return;
    ev.preventDefault();
    this.showMenu = false;
    this.tabIndex = tabIndex;
    this.x = ev.clientX;
    this.y = ev.clientY;

    await this.$nextTick();
    this.showMenu = true;
  }
}
</script>

<template>
  <v-tabs v-model="currentFile" style="min-height: 48px" show-arrows>
    <template v-for="(file, index) in files" :key="index">
      <v-tab v-if="!file.name.toLowerCase().includes('.cil')" :value="index" @contextmenu="show($event, index)">
        {{ file.name?.toLowerCase() }}
        <CloseBtn @click.stop="closeFile(index)" />
      </v-tab>
    </template>
  </v-tabs>
  <v-menu v-model="showMenu" absolute offset-y :style="{ top: `${y}px`, left: `${x}px` }">
    <v-list density="compact">
      <v-list-item @click="closeOtherFiles">
        <v-list-item-title>Close other tabs</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
.v-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
