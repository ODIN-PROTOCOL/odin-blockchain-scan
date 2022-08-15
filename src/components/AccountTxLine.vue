<template>
  <div class="app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Transaction hash</span>
      <TitledLink
        :name="{
          name: $routes.transactionDetails,
          params: { hash: tx.hash },
        }"
        :text="tx.hash"
        class="app-table__cell-txt app-table__link"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Type</span>
      <span class="app-table__cell-txt" :title="tx.type">
        {{ tx.type }}
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
      <span>{{ $fDate(tx.time, 'HH:mm dd.MM.yy') }}</span>
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
      <span class="app-table__cell-txt" :title="tx.amount">
        {{ tx.amount }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Transaction Fee</span>
      <span class="app-table__cell-txt" :title="tx.fee">
        {{ tx.fee }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { AccountTx } from '@/helpers/Types'
import TitledLink from '@/components/TitledLink.vue'

defineProps<{
  tx: AccountTx
}>()
</script>
