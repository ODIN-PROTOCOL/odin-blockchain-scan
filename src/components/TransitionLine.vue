<template>
  <div class="app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Transaction hash</span>
      <TitledLink
        :to="`/transactions/${transition.block}/${transition.hash}`"
        class="app-table__cell-txt app-table__link"
        :text="'0x' + transition.hash"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Type</span>
      <span class="app-table__cell-txt" :title="transition.type">
        {{ transition.type }}
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
      <div>
        <div>
          {{ convertToTime(transition.time) }}
        </div>
        <div>
          {{ convertToDate(transition.time) }}
        </div>
      </div>
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
import { convertToTime, convertToDate } from '@/helpers/dates'

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
      convertToTime,
      convertToDate,
    }
  },
})
</script>
