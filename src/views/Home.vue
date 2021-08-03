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
              >
                <!-- TODO: what is Bk  -->
                <template #label> Bk </template>
                <template #name>
                  <TitledLink
                    :link="`/blocks/${item.header.height}`"
                    class="app-table__cell-txt"
                    :text="item.header.height"
                  />
                </template>
                <template #time>
                  <div class="info-value">
                    {{ convertToTime(item.header.time) }}
                  </div>
                  <div class="info-value">
                    {{ convertToDate(item.header.time) }}
                  </div>
                </template>
                <template #validator>
                  <span>Validator:</span>
                  <TitledLink
                    :link="`/transactions/${item.header.height}`"
                    class="app-table__cell-txt"
                    :text="
                      '0x' + toHexFunc(item.header.validatorsHash).toUpperCase()
                    "
                  />
                </template>
                <template #transactions>
                  <!-- TODO: transactions count -->
                  <span>548 transactions</span>
                </template>
                <template #currency>
                  <span>
                    {{ item.block_size }}
                  </span>
                  <!-- TODO: currency-->
                  <span class="currency">
                    454,565 {{ item.header.chainId.toUpperCase() }}
                  </span>
                </template>
              </LatestListItem>
            </template>
          </LatestList>
          <LatestList :header="latestTransactionsHeader">
            <LatestListItem
              v-for="(i, index) in [1,2,3,4,5]"
              :key="index"
            >
              <!-- TODO: what is Tx  -->
              <template #label> Tx </template>
              <template #name>
                <TitledLink
                  :link="String(i)"
                  class="app-table__cell-txt"
                  :text="'0x8b5a0393b5b...'"
                />
              </template>
              <template #time> 24 secs ago </template>
              <template #from>
                <span>From:</span>
                <TitledLink
                  :link="String(i)"
                  class="app-table__cell-txt"
                  :text="'0x8b5a0393b5b...'"
                />
              </template>
              <template #to>
                <span> To: </span>
                <TitledLink
                  :link="String(i)"
                  class="app-table__cell-txt"
                  :text="'0x8b5a0393b5b...'"
                />
              </template>
              <template #currency> 454,565 ODIN </template>
            </LatestListItem>
          </LatestList>
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
import { convertToTime, convertToDate } from '@/helpers/dates'
import TitledLink from '@/components/TitledLink.vue'
import { toHex } from '@cosmjs/encoding'

export default defineComponent({
  components: { LatestList, LatestListItem, TitledLink },
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
    let latestTransactionsHeader = {
      name: 'Transactions',
      to: 'Transactions',
    }

    const toHexFunc = toHex
    return {
      latestBlocksHeader,
      latestBlocks,
      latestTransactionsHeader,
      convertToTime,
      convertToDate,
      toHexFunc,
    }
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
