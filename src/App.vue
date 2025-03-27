<script setup lang="ts">
import { RouterView } from 'vue-router'
import tokenTableName from '@/config'
console.log(tokenTableName)
</script>

<template>
  <div id="app">
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
#app {
  /** 字体抗锯齿，让字体看起来更清晰 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
