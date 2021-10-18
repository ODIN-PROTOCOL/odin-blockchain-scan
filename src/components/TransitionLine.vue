<template>
  <div class="data-sources__table-row app-table__row">
    <div class="app-table__cell">
      <span class="app-table__header">Transaction hash</span>
      <TitledLink
        :to="`/transactions/${transition.block}/${transition.hash}`"
        class="app-table__cell-txt"
        :text="'Ox' + transition.hash"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Type</span>
      <span class="app-table__cell-txt">{{ transition.type }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Block</span>
      <TitledLink
        :to="`/blocks/${transition.block}`"
        class="app-table__cell-txt"
        :text="transition.block"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Date and time</span>
      <span class="app-table__cell-txt">
        {{ convertToTxTime(transition.time) }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Sender</span>
      <TitledLink
        v-if="transition.sender !== ''"
        :to="`/account/${transition.sender}`"
        class="app-table__cell-txt"
        :text="`0x${transition.sender}`"
      />
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Receiver</span>
      <TitledLink
        v-if="transition.receiver !== ''"
        :to="`/account/${transition.receiver}`"
        class="app-table__cell-txt"
        :text="`0x${transition.receiver}`"
      />
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Amount</span>
      <span class="app-table__cell-txt">{{ transition.amount }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Transaction Fee</span>
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

<style scoped lang="scss">
.app-table__cell-txt {
  max-width: 150px;
}

.app-table__header {
  display: none;

  @media screen and (max-width: 76.8rem) {
    display: inline-block;
    width: 20rem;
  }
}
</style>
