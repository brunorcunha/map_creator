<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

import { useAppStore } from '@/store/app';

@Component({})
export default class StatusBar extends Vue {
  private appStore = useAppStore();

  get gridInfo(): string {
    return this.appStore.gridInfo;
  }

  get tileInfo(): string {
    return this.appStore.tileInfo;
  }
}
</script>

<template>
  <v-footer app>
    <div class="text-body-2 text-grey">{{ tileInfo }}</div>
    <v-spacer />
    <div class="text-body-2 text-grey">{{ gridInfo }}</div>
  </v-footer>
</template>
