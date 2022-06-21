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
      <span :title="odinBalanceTitle" class="app-table__cell-txt">{{
        odinBalanceValue
      }}</span>
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
        <span v-if="account.tx_count">
          {{ account.tx_count }}
        </span>
        <span v-else>0</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import { convertLokiToOdin } from '@/helpers/converters'

export default defineComponent({
  components: { TitledLink },
  props: {
    account: {
      type: Object,
      required: true,
    },
    rank: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    const odinBalanceTitle = convertLokiToOdin(props.account.odin_balance)
    const odinBalanceValue = convertLokiToOdin(props.account.odin_balance, {
      withDenom: true,
    })
    const accountOdinPercentage = Number(props.account.odin_percent).toFixed(2)

    return {
      accountOdinPercentage,
      odinBalanceTitle,
      odinBalanceValue,
    }
  },
})
</script>
<style scoped lang="scss"></style>
