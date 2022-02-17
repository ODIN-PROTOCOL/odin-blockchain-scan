<template>
  <div class="app__main-view odin-geo">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">ODIN&GEO</h2>
    </div>

    <div class="odin-geo__info-section">
      <span class="app__main-view-subtitle">ODIN</span>
      <InfoCard :infoData="infoCardData" />

      <span class="odin-geo__info-table-title">Amount of ODIN tokens</span>
      <div class="app-table odin-geo__table">
        <div class="app-table__head">
          <span>Balances</span>
          <span>Community pool</span>
          <span>Treasury pool</span>
          <span>Data providers pool</span>
        </div>
        <div class="app-table__row odin-geo__table-row">
          <div class="app-table__cell">
            <span class="app-table__title">Balances</span>
            <span class="app-table__cell-txt" :title="odinBalances">
              {{ odinBalances }}
            </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Community pool</span>
            <span class="app-table__cell-txt" :title="odinCommunityPool">
              {{ odinCommunityPool }}
            </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Treasury pool</span>
            <span class="app-table__cell-txt" :title="odinTreasuryPool">
              {{ odinTreasuryPool }}
            </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Data providers pool</span>
            <span class="app-table__cell-txt" :title="odinDataProvidersPool">
              {{ odinDataProvidersPool }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { handleError } from '@/helpers/errors'
import { convertLokiToOdin } from '@/helpers/converters'
import { preparePoolsData } from '@/helpers/poolsHelpers'
import InfoCard from '@/components/Cards/InfoCard.vue'

export default defineComponent({
  components: { InfoCard },
  setup() {
    const odinTotalSupply = ref('-')
    const odinPrecision = ref('10^6')
    const odinBalances = ref('-')
    const odinCommunityPool = ref('-')
    const odinTreasuryPool = ref('-')
    const odinDataProvidersPool = ref('-')
    const infoCardData = computed(() => [
      {
        title: 'Total Supply',
        values: [odinTotalSupply.value],
      },
      {
        title: 'Precision',
        values: [odinPrecision.value],
      },
    ])

    const getData = async () => {
      try {
        const { data } = await callers.getInfoPools()
        const totalSupply = await callers.getUnverifiedTotalSupply()

        const { balances, community, treasury, data_provider, total_supply } =
          preparePoolsData(data.data, totalSupply)

        odinTotalSupply.value = convertLokiToOdin(total_supply, {
          withDenom: true,
        }).toString()
        odinBalances.value = convertLokiToOdin(balances, {
          withDenom: true,
        }).toString()
        odinCommunityPool.value = convertLokiToOdin(community, {
          withDenom: true,
        }).toString()
        odinTreasuryPool.value = convertLokiToOdin(treasury, {
          withDenom: true,
        }).toString()
        odinDataProvidersPool.value = convertLokiToOdin(data_provider, {
          withDenom: true,
        }).toString()
      } catch (error) {
        handleError(error as Error)
      }
    }

    onMounted(async () => {
      await getData()
    })
    return {
      odinTotalSupply,
      odinPrecision,
      odinBalances,
      odinCommunityPool,
      odinTreasuryPool,
      odinDataProvidersPool,
      infoCardData,
    }
  },
})
</script>

<style lang="scss" scoped>
.odin-geo {
  &__info-table-title {
    display: inline-block;
    margin-bottom: 1.6rem;
    font-size: 2rem;
    line-height: 2.4rem;
    font-weight: 600;
  }
}

@include respond-to(tablet) {
  .odin-geo {
    &__table-row {
      padding: 0 0 1.6rem;
    }
  }
}
</style>
