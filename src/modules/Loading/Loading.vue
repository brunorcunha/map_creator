<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

import { useAppStore } from '@/store/app';

@Component({})
export default class Loading extends Vue {
  private appStore = useAppStore();

  get loading(): boolean {
    return this.appStore.loading;
  }
}
</script>

<template>
  <v-dialog v-model="loading" max-width="320" persistent>
    <v-card rounded="lg">
      <div class="d-flex px-4 py-3 align-center">
        <img class="pr-4 pl-2" src="/favicon.png" width="50" alt="" />

        <div class="text-grey-lighten-3 text-body-1">Lendo binários...</div>

        <v-spacer />

        <v-progress-circular color="primary" indeterminate="disable-shrink" size="24" />
      </div>
    </v-card>
  </v-dialog>
</template>
