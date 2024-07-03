<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

import { useAppStore } from '@/store/app';

import type { AppAction, AppLayer } from '@/store/types';

@Component({})
export default class Toolbar extends Vue {
  private appStore = useAppStore();

  get action(): AppAction {
    return this.appStore.currentAction;
  }
  set action(action: AppAction) {
    this.appStore.currentAction = action;
  }

  get layers(): AppLayer[] {
    return this.appStore.currentLayers;
  }
  set layers(action: AppLayer[]) {
    this.appStore.currentLayers = action;
  }

  mounted() {
    // @ts-ignore
    this.$refs.file?.addEventListener('change', async (event) => {
      await this.appStore.resolveFiles(event.target.files);
      event.target.value = '';
    });
  }

  openFile() {
    // @ts-ignore
    this.$refs.file?.click();
  }
}
</script>

<template>
  <input ref="file" type="file" style="display: none" multiple />
  <v-app-bar flat class="px-3">
    <v-btn-group rounded="lg">
      <v-tooltip text="New Map">
        <template #activator="{ props }">
          <v-btn class="px-0" v-bind="props" disabled>
            <v-icon size="x-large">mdi-file-star-four-points</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Open Map">
        <template #activator="{ props }">
          <v-btn class="px-0" v-bind="props" @click="openFile">
            <v-icon size="x-large">mdi-folder-open</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Save Map">
        <template #activator="{ props }">
          <v-btn class="px-0" v-bind="props" disabled>
            <v-icon size="x-large">mdi-content-save</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-btn-group>

    <v-divider vertical inset class="mx-2" />

    <v-btn-group rounded="lg">
      <v-tooltip text="Undo">
        <template #activator="{ props }">
          <v-btn class="px-0" v-bind="props" disabled>
            <v-icon size="x-large">mdi-undo</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Redo">
        <template #activator="{ props }">
          <v-btn class="px-0" v-bind="props" disabled>
            <v-icon size="x-large">mdi-redo</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-btn-group>

    <v-divider vertical inset class="mx-2" />

    <v-btn-toggle rounded="lg" mandatory disabled>
      <v-tooltip text="Draw">
        <template #activator="{ props }">
          <v-btn class="px-0" v-bind="props">
            <v-icon size="x-large">mdi-lead-pencil</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Erase">
        <template #activator="{ props }">
          <v-btn class="px-0" v-bind="props">
            <v-icon size="x-large">mdi-eraser</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-btn-toggle>

    <v-divider vertical inset class="mx-2" />

    <v-btn-toggle v-model="layers" rounded="lg" multiple>
      <v-tooltip text="Layer Tile Background">
        <template #activator="{ props }">
          <v-btn class="px-0" v-bind="props">
            <v-icon size="x-large">mdi-numeric-1-box</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Layer Tile Sprite">
        <template #activator="{ props }">
          <v-btn class="px-0" v-bind="props">
            <v-icon size="x-large">mdi-numeric-2-box</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Layer Tile A*">
        <template #activator="{ props }">
          <v-btn class="px-0" v-bind="props">
            <v-icon size="x-large">mdi-star-box</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-btn-toggle>
  </v-app-bar>
</template>

<style scoped>
.v-app-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
