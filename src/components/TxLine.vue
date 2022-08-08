<template>
  <div class="app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Transaction hash</span>
      <TitledLink
        :name="{
          name: $routes.transactionDetails,
          params: { hash: transition.hash },
        }"
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
        :name="{
          name: $routes.blockDetails,
          params: { id: transition.block },
        }"
        :text="transition.block"
        class="app-table__cell-txt app-table__link"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Date and time</span>
      <span> {{ $fDate(transition.time, 'HH:mm dd.MM.yy') }} </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Sender</span>
      <TitledLink
        v-if="transition.sender !== ''"
        :name="{
          name: $routes.accountDetails,
          params: { hash: transition.sender },
        }"
        class="app-table__cell-txt app-table__link"
        :text="transition.sender"
      />
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Receiver</span>
      <TitledLink
        v-if="transition.receiver !== ''"
        :name="{
          name: $routes.accountDetails,
          params: { hash: transition.receiver },
        }"
        :text="transition.receiver"
        class="app-table__cell-txt app-table__link"
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
<script setup lang="ts">
import { DecodedTxData } from '@/helpers/Types'
import TitledLink from '@/components/TitledLink.vue'

defineProps<{
  transition: DecodedTxData
}>()
</script>
