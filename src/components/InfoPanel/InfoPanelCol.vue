<template>
  <div class="info-panel__col">
    <div
      class="info-panel__row"
      v-for="({ title, text }, index) in infoPanelRows"
      :key="index"
    >
      <div class="info-panel__title">{{ title }}</div>
      <span class="info-panel__text">{{ text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'InfoPanelTransaction',
  props: {
    infoPanelRows: {
      type: Array,
      required: true,
    },
  },
})
</script>

<style scoped></style>
