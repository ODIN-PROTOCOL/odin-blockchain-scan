<template>
  <div class="data-sources__table-row app-table__row">
    <div class="app-table__cell">
      <span class="app-table__header">Rank</span>
      <span>{{ rank }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Address</span>
      <router-link :to="account.address">
        <TitledLink
          class="app-table__cell-txt"
          :text="`0x${account.address}`"
        />
      </router-link>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">GEO balance</span>
      <span>{{ account.geoBalance }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">GEO token percentage</span>
      <span v-if="accountOdinPercentage">{{ accountOdinPercentage }}%</span>
      <span v-else>No info</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">ODIN balance</span>
      <span>{{ account.odinBalance }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">ODIN token percentage</span>
      <div>
        <span v-if="accountGeoPercentage">{{ accountGeoPercentage }}%</span>
        <span v-else>No info</span>
      </div>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Transaction count</span>
      <div>
        <span v-if="account.transactionCount">
          {{ account.transactionCount }}
        </span>
        <span v-else>No info</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import TitledLink from '@/components/TitledLink.vue'

export default defineComponent({
  components: { TitledLink },
  props: {
    account: {
      type: Object,
      required: true,
    },
    odin: {
      type: Number,
      required: true,
    },
    geo: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    const accountOdinPercentage = computed(() => {
      return Number.parseFloat(
        (+props.account.odinBalance / props.odin).toFixed(8)
      )
    })
    const accountGeoPercentage = computed(() => {
      return Number.parseFloat(
        (+props.account.geoBalance / props.geo).toFixed(8)
      )
    })
    return {
      accountGeoPercentage,
      accountOdinPercentage,
    }
  },
})
</script>

<style scoped lang="scss">
.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    50px repeat(6, minmax(4rem, 1fr));

  @media screen and (max-width: 992px) {
    grid: repeat(7, minmax(4rem, 1fr)) / auto;
  }
}

.app-table__cell-txt {
  max-width: 150px;
  padding-right: 10px;
}

.app-table__header {
  display: none;

  @media screen and (max-width: 992px) {
    display: inline-block;
    width: 200px;
  }

  @media screen and (max-width: 600px) {
    width: 170px;
  }
}
</style>
