<template>
  <div class="home">
    <div class="home__wrapper">
      <div class="info-panel">info-panel</div>
      <div class="latest">
        <div class="latest__wrapper">
          <LatestList :header="latestBlocksHeader">
            <template v-if="latestBlocks">
              <LatestListItem
                v-for="item in latestBlocks"
                :key="item.blockId.hash"
                :item="item"
              />
            </template>
          </LatestList>
          <LatestList :header="{}" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import LatestList from '@/components/LatestList/LatestList.vue'
import LatestListItem from '@/components/LatestList/LatestListItem.vue'

export default defineComponent({
  components: { LatestList, LatestListItem },
  setup() {
    let latestBlocks = ref({})
    onMounted(
      async (): Promise<void> => {
        await getLatestBlocks()
      }
    )

    const getLatestBlocks = async (): Promise<void> => {
      const response = await callers.getClient()
      const { lastHeight, blockMetas } = await response.blockchain(100, 500)
      console.log('lastHeight', lastHeight)
      console.log('blockMetas', blockMetas)
      latestBlocks.value = [...blockMetas].slice(0, 5)
    }

    let latestBlocksHeader = {
      name: 'Blocks',
      to: 'Blocks',
    }

    return { latestBlocksHeader, latestBlocks }
  },
})
</script>

<style scoped lang="scss">
.home {
  &__wrapper {
    padding: 0 1rem;
    margin: 0 10.3rem;
  }
}
.info-panel {
  //  TODO: temp this
  padding: 3.2rem 2.4rem;
  border-radius: 0.8rem;
  border: 0.1rem solid #007bff;
  width: 100%;
  margin-bottom: 3.2rem;
}
.latest {
  &__wrapper {
    display: grid;
    align-items: flex-start;
    gap: 2.4rem;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
