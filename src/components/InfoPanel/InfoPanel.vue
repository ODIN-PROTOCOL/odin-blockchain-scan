<template>
  <div class="info-panel">
    <div class="info-panel__prices">prices</div>
    <div class="info-panel__transactions">transactions</div>
    <Chart />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Chart from '@/components/InfoPanel/InfoPanelChart.vue'

export default defineComponent({
  name: 'InfoPanel',
  components: { Chart },
})
</script>

<style scoped lang="scss">
.info-panel {
  display: grid;
  grid: auto/ repeat(3, 1fr);
  padding: 3.2rem 2.4rem;
  border-radius: 0.8rem;
  border: 0.1rem solid var(--clr__action);
  width: 100%;
  margin-bottom: 3.2rem;
}
</style>
