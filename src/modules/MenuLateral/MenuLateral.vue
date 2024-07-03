<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import { MiniMapa } from './components/MiniMapa';
import { TileMaps } from './components/Tilemaps';

@Component({
  components: { TileMaps, MiniMapa }
})
export default class MenuLateral extends Vue {}
</script>

<template>
  <v-navigation-drawer id="menuLat" permanent location="right" width="331" style="border: 0">
    <div class="d-flex flex-column h-100">
      <MiniMapa />

      <v-divider />

      <TileMaps />
    </div>
  </v-navigation-drawer>
</template>
