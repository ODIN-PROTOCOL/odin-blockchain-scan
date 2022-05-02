<template>
  <div class="accounts-line app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Rank</span>
      <span>{{ rank }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Address</span>
      <TitledLink
        :to="`/account/${account.address}`"
        class="app-table__cell-txt app-table__link"
        :text="account.address"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">ODIN balance</span>
      <span>{{ odinBalance }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">ODIN token percentage</span>
      <div>
        <span v-if="accountOdinPercentage">{{ accountOdinPercentage }}%</span>
        <span v-else>-</span>
      </div>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Transaction count</span>
      <div>
        <span v-if="account.total_tx">
          {{ account.total_tx }}
        </span>
        <span v-else>0</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import { bigMath } from '@/helpers/bigMath'

export default defineComponent({
  components: { TitledLink },
  props: {
    account: {
      type: Object,
      required: true,
    },
    totalOdin: {
      type: Number,
      required: true,
    },
    rank: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    const odinBalance = computed(() =>
      bigMath.bigConvectOdinAndGeo(props.account.odinBalance)
    )
    const accountOdinPercentage = computed(() => {
      return bigMath
        .multiply(
          bigMath.divide(props.account.odinBalance, props.totalOdin, {
            decimals: 3,
          }),
          100
        )
        .toString()
    })

    return {
      accountOdinPercentage,
      odinBalance,
    }
  },
})
</script>
<style scoped lang="scss">
.accounts-line {
  grid:
    auto /
    minmax(2rem, 0.5fr)
    minmax(8rem, 5fr)
    minmax(8rem, 2fr)
    minmax(8rem, 2fr)
    minmax(8rem, 1.5fr);
}
@include respond-to(tablet) {
  .accounts-line {
    grid: none;
  }
}
</style>
