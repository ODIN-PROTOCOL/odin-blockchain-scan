<template>
  <div class="app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Transaction hash</span>
      <TitledLink
        :to="`/transactions/${getRequestItemTxHash}`"
        class="app-table__cell-txt app-table__link"
        :text="tx.tx_hash"
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
        :to="`/blocks/${tx.block}`"
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
        :to="`/account/${tx.sender}`"
        class="app-table__cell-txt app-table__link"
        :text="tx.sender"
      />
      <span class="app-table__cell-txt" v-else>-</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Receiver</span>
      <TitledLink
        v-if="tx.receiver"
        :to="`/account/${tx.receiver}`"
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
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import { humanizeMessageType } from '@/helpers/decodeMessage'
import { convertLokiToOdin } from '@/helpers/converters'
import { API_CONFIG } from '@/api/api-config'
import { txFromTelemetry } from '@/helpers/Types'

export default defineComponent({
  name: 'AccountTxLine',
  components: { TitledLink },
  props: {
    tx: {
      type: Object as PropType<txFromTelemetry>,
      required: true,
    },
  },
  setup(props) {
    const odinAmount = convertLokiToOdin(
      props.tx.amount[0]?.amount,
      {},
      props.tx.amount[0]?.denom
    )
    const odinFee = convertLokiToOdin(
      props.tx.fee[0]?.amount,
      {},
      props.tx.fee[0]?.denom
    )
    const type = humanizeMessageType('/' + props.tx.type)
    const getRequestItemTxHash = props.tx?.tx_hash.split('0x')[1]
    const validatorPrefix = 'odinvaloper'
    const generateAddrLink = (addr: string) => {
      if (addr.includes(validatorPrefix)) {
        return `validators/${addr}`
      } else {
        return `account/${addr}`
      }
    }
    return {
      generateAddrLink,
      odinFee,
      odinAmount,
      type,
      API_CONFIG,
      getRequestItemTxHash,
    }
  },
})
</script>
