<template>
  <div class="app__container">
    <InfoPanel />
    <LatestStats />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LatestStats from '@/components/LatestList/LatestStats.vue'
import InfoPanel from '@/components/InfoPanel/InfoPanel.vue'

export default defineComponent({
  name: 'HomeView',
  components: { LatestStats, InfoPanel },
})
</script>
