<template>
  <div class="view-main">
    <div class="view-main__title-wrapper">
      <BackButton text="Top accounts" />
      <h2 class="view-main__title">Account</h2>
      <CopyText
        :text="route.params.hash"
        :title="route.params.hash"
        :displayText="route.params.hash"
        :class-name="'block-id'"
      />
    </div>

    <div class="view-main__stats-wrapper mg-b32">
      <div class="view-main__stats">
        <div class="view-main__stats-row">
          <span class="view-main__stats-title">GEO Balance:</span>
          <span class="view-main__stats-amount">{{ geoBalance }} GEO</span>
        </div>
        <div class="view-main__stats-row">
          <span class="view-main__stats-title">ODIN Balance:</span>
          <span class="view-main__stats-amount">{{ odinBalance }} ODIN</span>
        </div>
      </div>
    </div>

    <h1 class="view-main__subtitle mg-b32">
      <span>Transactions</span>
      <small v-if="totalTxCount">{{ totalTxCount }}</small>
    </h1>

    <div class="app-table">
      <div class="app-table__head">
        <span> Transaction hash </span>
        <span> Type </span>
        <span> Block </span>
        <span> Date and time </span>
        <span> Sender </span>
        <span> Receiver </span>
        <span> Amount </span>
        <span> Transaction fee </span>
      </div>
      <template v-if="transactions?.length">
        <div
          v-for="(item, index) in transactions"
          :key="index"
          class="app-table__row"
        >
          <div class="app-table__cell">
            <span class="app-table__title">Transaction hash</span>
            <TitledLink
              v-if="item.hash && item.block"
              :to="`/transactions/${item.block}/${item.hash}`"
              class="app-table__cell-txt"
              :text="`0x${item.hash}`"
            />
            <span class="app-table__cell-txt" v-else> - </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Type</span>
            <span v-if="item.type" :title="item.type">
              {{ item.type }}
            </span>
            <span class="app-table__cell-txt" v-else> - </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Block</span>
            <span v-if="item.block" class="app-table__cell-txt">
              <TitledLink
                :to="`/blocks/${item.block}`"
                class="app-table__cell-txt"
                :text="item.block"
              />
            </span>
            <span class="app-table__cell-txt" v-else> - </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Date and time</span>
            <div v-if="item.time">
              <div class="info-value">
                {{ convertToTxTime(item.time) }}
              </div>
            </div>
            <span class="app-table__cell-txt" v-else> - </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Sender</span>
            <TitledLink
              v-if="item.sender"
              :to="item.sender"
              class="app-table__cell-txt"
              :text="`0x${item.sender}`"
            />
            <span class="app-table__cell-txt" v-else> - </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Reciever</span>
            <TitledLink
              v-if="item.receiver !== ''"
              :to="item.receiver"
              class="app-table__cell-txt"
              :text="`0x${item.receiver}`"
            />
            <span class="app-table__cell-txt" v-else> - </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Amount</span>
            <span v-if="item.amount">
              {{ item.amount }}
            </span>
            <span class="app-table__cell-txt" v-else> - </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Transaction fee</span>
            <span class="app-table__cell-txt" v-if="item.fee">
              {{ item.fee }}
            </span>
            <span class="app-table__cell-txt" v-else>-</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="app-table__row">
          <p class="app-table__empty-stub">No items yet</p>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { routerBack } from '@/router'
import { callers } from '@/api/callers'
import { convertToTxTime } from '@/helpers/dates'
import { copyValue, prepareTransaction } from '@/helpers/helpers'

import { Bech32 } from '@cosmjs/encoding'
import { bigMath } from '@/helpers/bigMath'
import { handleError } from '@/helpers/errors'
import BackButton from '@/components/BackButton.vue'
import CopyText from '@/components/CopyText.vue'
import TitledLink from '@/components/TitledLink.vue'

export default defineComponent({
  components: { BackButton, TitledLink, CopyText },
  setup() {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()

    const geoBalance = ref<string>()
    const odinBalance = ref<string>()
    const transactions = ref()
    const totalTxCount = ref<number>()

    const getTotalAmount = async (
      validatorAddress: string,
      denom: string
    ): Promise<string> =>
      callers
        .getUnverifiedBalances(validatorAddress, denom)
        .then((res) => bigMath.bigConvectOdinAndGeo(res.amount).toString())

    const getValidator = async () => {
      try {
        const validatorAddress = Bech32.encode(
          'odin',
          Bech32.decode(route.params.hash as string).data
        )

        const { txs } = await callers.getTxSearch({
          query: `message.sender='${validatorAddress}'`,
        })

        geoBalance.value = await getTotalAmount(validatorAddress, 'minigeo')
        odinBalance.value = await getTotalAmount(validatorAddress, 'loki')
        transactions.value = await prepareTransaction(txs)
        totalTxCount.value = transactions.value.length
      } catch (e) {
        handleError(e as Error)
      }
    }

    onMounted(() => {
      getValidator()
    })

    return {
      route,
      geoBalance,
      odinBalance,
      routerBack,
      router,
      copyValue,
      convertToTxTime,
      transactions,
      totalTxCount,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-main {
  &__title {
    margin: 0 1.6rem 0 2rem;
  }

  &__stats-wrapper {
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.8rem;
    padding: 3.2rem 2.4rem;
    display: inline-block;
  }

  &__stats-row {
    display: grid;
    grid-template-columns: 10rem 1fr;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 2.4rem;
    }
  }

  &__stats-title {
    font-size: 1.6rem;
    width: 10rem;
    display: inline-block;
  }

  &__stats-amount {
    font-weight: 600;
    font-size: 1.6rem;
    margin-left: 2.4rem;
  }
}

@include respond-to(768px) {
  .view-main {
    &__title {
      margin: 0.8rem 0 0.4rem 0;
    }
  }
}
</style>
