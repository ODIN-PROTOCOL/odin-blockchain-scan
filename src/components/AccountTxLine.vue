<template>
  <div class="app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Transaction hash</span>
      <TitledLink
        :name="{
          name: $routes.transactionDetails,
          params: { hash: getRequestItemTxHash },
        }"
        :text="tx.tx_hash"
        class="app-table__cell-txt app-table__link"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Type</span>
      <span class="app-table__cell-txt" :title="type">
        {{ type }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Block</span>
      <TitledLink
        :name="{
          name: $routes.blockDetails,
          params: { id: tx.block },
        }"
        class="app-table__cell-txt app-table__link"
        :text="tx.block"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Date and time</span>
      <span>{{ $fDate(tx.timestamp * 1000, 'HH:mm dd.MM.yy') }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Sender</span>
      <TitledLink
        v-if="tx.sender"
        :to="tx.sender"
        class="app-table__cell-txt app-table__link"
        :text="tx.sender"
      />
      <span class="app-table__cell-txt" v-else>-</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Receiver</span>
      <TitledLink
        v-if="tx.receiver"
        :to="tx.receiver"
        class="app-table__cell-txt app-table__link"
        :text="tx.receiver"
      />
      <span class="app-table__cell-txt" v-else>-</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Amount</span>
      <span class="app-table__cell-txt" :title="odinAmount">{{
        odinAmount
      }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Transaction Fee</span>
      <span class="app-table__cell-txt" :title="odinFee">
        {{ odinFee }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import TitledLink from '@/components/TitledLink.vue'
import { humanizeMessageType } from '@/helpers/decodeMessage'
import { convertLokiToOdin } from '@/helpers/converters'
import { AccountTx } from '@/helpers/Types'

const props = defineProps<{
  tx: AccountTx
}>()

const odinAmount = convertLokiToOdin(
  props.tx.amount[0]?.amount,
  {},
  props.tx.amount[0]?.denom,
)
const odinFee = convertLokiToOdin(
  props.tx.fee[0]?.amount,
  {},
  props.tx.fee[0]?.denom,
)
const type = humanizeMessageType('/' + props.tx.type)
const getRequestItemTxHash = props.tx?.tx_hash.split('0x')[1]
</script>
