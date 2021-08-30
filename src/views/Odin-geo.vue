<template>
  <div class="container">
    <h1>ODIN&GEO</h1>
    <BlockView :blockData="OdinBlockData">
      <template #title> ODIN </template>
    </BlockView>
    <BlockView :blockData="OdinBlockData">
      <template #title> GEO </template>
    </BlockView>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BlockView from '@/components/Odin-Geo/BlockView.vue'

export default defineComponent({
  name: 'Odin-geo',
  components: {
    BlockView,
  },
  setup() {
    // TODO: get read data, create type for data
    const OdinBlockData = ref({
      info: {
        supply: '12,523,093',
        precision: '100',
      },
      amount: {
        balances: '4,684',
        community_pool: '4,684',
        treasury_pool: '4,684',
        providers_pool: '4,684',
      },
    })

    return { OdinBlockData }
  },
})
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 3.1rem;
}
</style>
