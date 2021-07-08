<template>
  <!-- <span :title="title || text"> -->
  <span>
    {{ text }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: [String, Number],
      required: false,
    },
  },
})
</script>

<style scoped></style>
