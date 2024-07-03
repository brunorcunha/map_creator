<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

import { Canvas, Loading, Menu, MenuLateral, StatusBar, Tabs, Toolbar } from '@/modules';

@Component({
  components: { Loading, StatusBar, MenuLateral, Tabs, Toolbar, Menu, Canvas }
})
export default class App extends Vue {}
</script>

<template>
  <v-app>
    <Menu />
    <Toolbar />
    <MenuLateral />

    <v-main>
      <div class="d-flex flex-column h-100">
        <Tabs />
        <Canvas />
      </div>
    </v-main>

    <StatusBar />
    <Loading />
  </v-app>
</template>

<style>
* {
  user-select: none;
}
html {
  overflow-y: hidden;
}
/** SCROLL DARK **/
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #202225;
  border-left: 1px solid #2c2c2c;
}
::-webkit-scrollbar-thumb {
  background: #2f3136;
  border: solid 3px #202020;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #36393f;
}
::-webkit-scrollbar-corner {
  background: #161616;
}
</style>
