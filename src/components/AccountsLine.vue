<template>
  <div class="accounts-line app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Rank</span>
      <span>{{ rank }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Address</span>
      <TitledLink
        :name="{
          name: $routes.accountDetails,
          params: { hash: account.address },
        }"
        :text="account.address"
        class="app-table__cell-txt app-table__link"
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
          {{ account.tx_count.toLocaleString() }}
        </span>
        <span v-else>0</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TitledLink from '@/components/TitledLink.vue'
import { convertLokiToOdin } from '@/helpers/converters'
import { trimLeadingZeros } from '@/helpers/formatters'
import { TempBalanceType } from '@/helpers/Types'

const props = defineProps<{
  account: TempBalanceType
  rank: number
}>()

const odinBalanceTitle = convertLokiToOdin(String(props.account.odin_balance))
const odinBalanceValue = convertLokiToOdin(String(props.account.odin_balance), {
  withDenom: true,
})
const accountOdinPercentage = trimLeadingZeros(
  Number(props.account.odin_percent),
)
</script>
<style scoped lang="scss"></style>
