<template>
  <div class="app__container">
    <InfoPanel />
    <Latest />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Latest from '@/components/LatestList/Latest.vue'
import InfoPanel from '@/components/InfoPanel/InfoPanel.vue'

export default defineComponent({
  name: 'Home',
  components: { Latest, InfoPanel },
})
</script>
