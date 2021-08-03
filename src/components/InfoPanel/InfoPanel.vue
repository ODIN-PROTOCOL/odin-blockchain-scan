<template>
  <div class="info-panel">
    <InfoPanelCol :infoPanelRows="priceData" />
    <InfoPanelCol :infoPanelRows="transactionData" />
    <InfoPanelChart :chartData="chartData" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import InfoPanelChart from '@/components/InfoPanel/InfoPanelChart.vue'
import InfoPanelCol from '@/components/InfoPanel/InfoPanelCol.vue'

export default defineComponent({
  name: 'InfoPanel',
  components: { InfoPanelChart, InfoPanelCol },
  setup() {
    // TODO: Get real data:{} for chart
    const chartData = ref({
      labels: ['May 18', 'May 25', 'Jun 1'],
      datasets: [
        {
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          borderWidth: 2,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          tension: 0.5,
          borderSkipped: false,
          data: [1080, 1220, 1540],
        },
      ],
    })
    // TODO: Get real transactionData for chart
    const transactionData = ref([
      {
        title: 'Total number of transactions',
        text: '2,521',
      },
      {
        title: 'Performance (TPS)',
        text: '2,521',
      },
      {
        title: 'Market CAP',
        text: '$2,515',
      },
    ])
    // TODO: Get real priceData for chart
    const priceData = ref([
      {
        title: 'ODIN price',
        text: '$2,515',
      },
      {
        title: 'GEO price',
        text: '$2,515',
      },
    ])

    return { chartData, transactionData, priceData }
  },
})
</script>

<style lang="scss">
.info-panel {
  display: grid;
  grid: auto/ repeat(2, 1fr) 2fr;
  padding: 3.2rem 2.4rem;
  border-radius: 0.8rem;
  border: 0.1rem solid var(--clr__action);
  width: 100%;
  margin-bottom: 3.2rem;
  &__title {
    margin-bottom: 1.53rem;
    font-size: 1.4rem;
    font-weight: 300;
  }
  &__text {
    font-weight: 600;
    font-size: 1.6rem;
    line-height: 2.4rem;
  }
  &__row {
    &:not(&:last-child) {
      margin-bottom: 3.2rem;
    }
  }
  &__chart {
    height: 26.9rem
  }
  @media (max-width: 768px) {
    grid: auto / repeat(2, 1fr);
    gap: 2.4rem;
    &__title {
      margin-bottom: 0.8rem;
    }
    &__chart {
      grid-column: 1/-1;
    }
  }
}
</style>
