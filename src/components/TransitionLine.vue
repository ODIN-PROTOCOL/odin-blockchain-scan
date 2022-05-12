<template>
  <div class="app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Transaction hash</span>
      <TitledLink
        :to="`/transactions/${transition.tx_hash}`"
        class="app-table__cell-txt app-table__link"
        :text="transition.tx_hash"
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
        :to="`/blocks/${transition.block}`"
        class="app-table__cell-txt app-table__link"
        :text="transition.block"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Date and time</span>
      <span>{{ $fDate(transition.timestamp * 1000, 'HH:mm dd.MM.yy') }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Sender</span>
      <TitledLink
        v-if="transition.sender !== ''"
        :to="`/account/${transition.sender}`"
        class="app-table__cell-txt app-table__link"
        :text="transition.sender"
      />
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Receiver</span>
      <TitledLink
        v-if="transition.receiver !== ''"
        :to="`/account/${transition.receiver}`"
        class="app-table__cell-txt app-table__link"
        :text="transition.receiver"
      />
      <span class="app-table__cell-txt" v-else> - </span>
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
<script type="ts">
import { defineComponent } from 'vue'
import TitledLink from '@/components/TitledLink.vue'

import { humanizeMessageType } from '@/helpers/decodeMessage'
import { convertLokiToOdin } from '@/helpers/converters'

export default defineComponent({
  name: 'TransitionLine',
  components: { TitledLink },
  props: {
    transition: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const fee = props.transition.fee.split('loki')[0]
    const amount = props.transition.amount.split('loki')[0]

    const odinAmount = amount ? Number(convertLokiToOdin(amount))  + " ODIN" : '-'
    const odinFee = fee ?  Number(convertLokiToOdin(fee)) + " ODIN" : '-'
    const type = humanizeMessageType('/' + props.transition.type)
    return {
      humanizeMessageType,
      odinFee,
      odinAmount,
      type
    }
  },
})
</script>
