<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

@Component({})
export default class Menu extends Vue {}
</script>

<template>
  <v-system-bar>
    <v-spacer />

    <v-icon>mdi-square</v-icon>

    <v-icon>mdi-circle</v-icon>

    <v-icon>mdi-triangle</v-icon>
  </v-system-bar>
</template>
