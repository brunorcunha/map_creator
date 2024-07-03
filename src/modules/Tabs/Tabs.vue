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

  get currentFile(): number | null {
    return this.appStore.currentFile;
  }
  set currentFile(file: number | null) {
    this.appStore.currentFile = file;
  }

  get files(): OpenedMap[] {
    return this.appStore.files;
  }

  closeFile(index: number) {
    this.appStore.files.splice(index, 1);
    if (this.currentFile === index) {
      this.currentFile = this.files.length ? this.files.length - 1 : null;
    } else if (this.currentFile && this.currentFile > index) {
      this.currentFile--;
    }
  }
}
</script>

<template>
  <v-tabs v-model="currentFile" style="min-height: 48px">
    <template v-for="(file, index) in files" :key="index">
      <v-tab v-if="!file.name.toLowerCase().includes('.cil')" :value="index">
        {{ file.name?.toLowerCase() }}
        <CloseBtn @click.stop="closeFile(index)" />
      </v-tab>
    </template>
  </v-tabs>
</template>

<style scoped>
.v-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
