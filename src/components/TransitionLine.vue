<template>
  <div class="app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Transaction hash</span>
      <TitledLink
        :to="`/transactions/${transition.block}/${transition.hash}`"
        class="app-table__cell-txt"
        :text="'Ox' + transition.hash"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Type</span>
      <span class="app-table__cell-txt">{{ transition.type }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Block</span>
      <TitledLink
        :to="`/blocks/${transition.block}`"
        class="app-table__cell-txt"
        :text="transition.block"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Date and time</span>
      <span class="app-table__cell-txt">
        {{ convertToTxTime(transition.time) }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Sender</span>
      <TitledLink
        v-if="transition.sender !== ''"
        :to="`/account/${transition.sender}`"
        class="app-table__cell-txt"
        :text="transition.sender"
      />
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Receiver</span>
      <TitledLink
        v-if="transition.receiver !== ''"
        :to="`/account/${transition.receiver}`"
        class="app-table__cell-txt"
        :text="transition.receiver"
      />
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Amount</span>
      <span class="app-table__cell-txt">{{ transition.amount }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Transaction Fee</span>
      <span class="app-table__cell-txt">
        {{ transition.fee }}
      </span>
    </div>
  </div>
</template>
<script type="ts">
import { defineComponent } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import { convertToTxTime } from '@/helpers/dates'

export default defineComponent({
  name: 'TransitionLine',
  components: { TitledLink },
  props: {
    transition: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      convertToTxTime,
    }
  },
})
</script>
