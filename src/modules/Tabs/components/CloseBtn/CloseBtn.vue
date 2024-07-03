<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

@Component({})
export default class CloseBtn extends Vue {}
</script>

<template>
  <v-btn size="x-small" variant="text" icon="mdi-close" class="ml-2"></v-btn>
</template>
