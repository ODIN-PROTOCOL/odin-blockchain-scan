<template>
  <div class="app__main-view transactions-item">
    <div class="app__main-view-title-wrapper">
      <BackButton text="Transactions" />
      <h2 class="app__main-view-title transactions-item__title">Transaction</h2>
      <div class="transactions-item__subtitle-wrapper" v-if="tx">
        <span class="app__main-view-subtitle transactions-item__subtitle">
          {{ tx.hash }}
        </span>
        <CopyButton class="mg-l8" :text="tx.hash" />
      </div>
    </div>

    <span class="app__main-view-subtitle">Transaction details</span>
    <div class="transactions-item__table mg-b32">
      <div class="transactions-item__table-row">
        <div class="transactions-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="transactions-item__table-row-tooltip">
            {{ TOOLTIP_INFO.time }}
          </span>
        </div>
        <span class="transactions-item__table-row-title">Time</span>
        <span class="transactions-item__table-row-value">
          {{ txTime }}
        </span>
      </div>
      <div class="transactions-item__table-row">
        <div class="transactions-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="transactions-item__table-row-tooltip">
            {{ TOOLTIP_INFO.status }}
          </span>
        </div>
        <span class="transactions-item__table-row-title">Status</span>
        <div class="transactions-item__table-row-value">
          <span
            class="transactions-item__table-row-status"
            :class="
              txStatus === TX_STATUSES.SUCCESS
                ? 'transactions-item__table-row-status_success'
                : 'transactions-item__table-row-status_failed'
            "
          >
            {{ txStatus === TX_STATUSES.SUCCESS ? 'Success' : 'Failed' }}
          </span>
        </div>
      </div>
      <div class="transactions-item__table-row">
        <div class="transactions-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="transactions-item__table-row-tooltip">
            {{ TOOLTIP_INFO.block }}
          </span>
        </div>
        <span class="transactions-item__table-row-title">BLock</span>
        <TitledLink
          v-if="tx?.block"
          :to="`/blocks/${tx?.block}`"
          class="transactions-item__table-row-value transactions-item__table-row-link"
          :text="tx?.block"
        />
        <span v-else class="transactions-item__table-row-value">-</span>
      </div>
      <div class="transactions-item__table-row">
        <div class="transactions-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="transactions-item__table-row-tooltip">
            {{ TOOLTIP_INFO.gas }}
          </span>
        </div>
        <span class="transactions-item__table-row-title">
          Gas (used/wanted)
        </span>
        <span class="transactions-item__table-row-value">
          {{ txUsed }} / {{ txWanted }}
        </span>
      </div>
      <div class="transactions-item__table-row">
        <div class="transactions-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="transactions-item__table-row-tooltip">
            {{ TOOLTIP_INFO.fee }}
          </span>
        </div>
        <span class="transactions-item__table-row-title">Fee</span>
        <span class="transactions-item__table-row-value">{{ tx?.fee }}</span>
      </div>
      <div class="transactions-item__table-row">
        <div class="transactions-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="transactions-item__table-row-tooltip">
            {{ TOOLTIP_INFO.memo }}
          </span>
        </div>
        <span class="transactions-item__table-row-title">Memo</span>
        <span class="transactions-item__table-row-value">{{ txMemo }}</span>
      </div>
      <div class="transactions-item__table-row">
        <div class="transactions-item__table-row-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="transactions-item__table-row-tooltip">
            {{ TOOLTIP_INFO.total }}
          </span>
        </div>
        <span class="transactions-item__table-row-title">Total</span>
        <span class="transactions-item__table-row-value">{{ tx?.amount }}</span>
      </div>
    </div>

    <p class="app__main-view-subtitle mg-b24">Messages</p>
    <div class="transactions-item__message" v-if="tx">
      <span class="transactions-item__message-title">{{ tx.type }}</span>
      <div class="transactions-item__message-row" v-if="tx.sender">
        <span class="transactions-item__message-row-title">From</span>
        <TitledLink
          :to="`/account/${tx.sender}`"
          class="transactions-item__message-row-value transactions-item__message-row-link"
          :text="tx.sender"
        />
        <CopyButton class="mg-l8" :text="tx.sender" />
      </div>
      <div class="transactions-item__message-row" v-if="tx.receiver">
        <span class="transactions-item__message-row-title">To</span>
        <TitledLink
          :to="`/account/${tx.receiver}`"
          class="transactions-item__message-row-value transactions-item__message-row-link"
          :text="tx.receiver"
        />
        <CopyButton class="mg-l8" :text="tx.receiver" />
      </div>
      <div class="transactions-item__message-row">
        <span class="transactions-item__message-row-title">Amount</span>
        <span class="transactions-item__message-row-value">
          {{ tx.amount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { getDecodeTx } from '@/helpers/decodeMessage'
import { handleError } from '@/helpers/errors'
import { adjustedData } from '@/helpers/Types'
import { prepareTransaction } from '@/helpers/helpers'
import { convertToTxTime } from '@/helpers/dates'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import TitledLink from '@/components/TitledLink.vue'
import { fromHex } from '@cosmjs/encoding'

const TOOLTIP_INFO = {
  time: 'The date and time at which a transaction is validated.',
  status:
    'The status of the transaction. A Status code indicating if the top-level call succeeded or failed.',
  block:
    'The number of the block in which the transaction was recorded. Block confirmation indicate how many blocks since the transaction are validated.',
  gas: 'The receiving party of the transaction (could be a contract address).',
  fee: 'Amount paid to the validator for validation of the transaction.',
  memo: 'Amount paid to the validator for validation of the transaction.',
  total: 'The amount being transacted in ODIN and fiat value.',
}

enum TX_STATUSES {
  SUCCESS,
  FAILED,
}

export default defineComponent({
  components: { BackButton, CopyButton, TitledLink },
  setup() {
    const route: RouteLocationNormalizedLoaded = useRoute()

    const tx = ref<adjustedData>()
    const txTime = ref('-')
    const txStatus = ref()
    const txMemo = ref()
    const txUsed = ref()
    const txWanted = ref()

    const getTransactions = async () => {
      try {
        const resp = await callers.getTx({
          hash: fromHex(String(route.params.hash)),
        })

        const preparedTx = await prepareTransaction([resp])
        const decodedTx = getDecodeTx(resp.tx)

        tx.value = preparedTx[0]
        txTime.value = convertToTxTime(String(tx.value.time))
        txStatus.value = resp.result.code
          ? TX_STATUSES.FAILED
          : TX_STATUSES.SUCCESS
        txMemo.value = decodedTx.body?.memo ? decodedTx.body?.memo : '<No Memo>'

        const {
          data: {
            result: {
              tx_result: { gas_wanted, gas_used },
            },
          },
        } = await callers.getTxForTxDetailsPage(String(tx.value.hash))

        txWanted.value = gas_wanted
        txUsed.value = gas_used
      } catch (error) {
        handleError(error as Error)
      }
    }

    onMounted(async () => {
      await getTransactions()
    })
    return {
      TOOLTIP_INFO,
      TX_STATUSES,
      tx,
      txTime,
      txStatus,
      txMemo,
      txUsed,
      txWanted,
    }
  },
})
</script>

<style lang="scss" scoped>
.transactions-item {
  &__title {
    margin: 0 1.6rem 0 2rem;
  }

  &__subtitle-wrapper {
    display: flex;
    max-width: 80%;
  }

  &__subtitle {
    @include ellipsis();
  }

  &__table-row {
    display: flex;
    padding: 1.6rem 0;
    border-bottom: 0.1rem solid var(--clr__input-border);
    align-items: center;
  }

  &__table-row-info {
    position: relative;
    cursor: pointer;
    margin-right: 0.9rem;

    &:hover {
      .transactions-item__table-row-tooltip {
        display: block;
      }
    }
  }

  &__table-row-tooltip {
    display: none;
    position: absolute;
    bottom: 130%;
    left: -50%;
    min-width: 30rem;
    padding: 1.2rem 2.4rem;
    background: var(--clr__tooltip-bg);
    border-radius: 0.8rem;
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 1.6rem;
    color: var(--clr__tooltip-text);

    &:before {
      content: '';
      display: block;
      width: 0.6rem;
      height: 0.6rem;
      position: absolute;
      bottom: -0.3rem;
      left: 1.6rem;
      transform: translateX(-50%) rotate(45deg);
      background: var(--clr__tooltip-bg);
    }
  }

  &__table-row-title {
    min-width: 14.5rem;
    margin-right: 2.4rem;
  }

  &__table-row-value {
    font-size: 1.4rem;
    @include ellipsis();
  }

  &__table-row-link,
  &__message-row-link {
    text-decoration: none;
    color: var(--clr__action);
  }

  &__table-row-status {
    display: block;
    width: 10rem;
    height: 2.4rem;
    background: var(--clr__muted-bg);
    border-radius: 0.4rem;
    color: var(--clr__text-on-action);
    text-align: center;
    line-height: 2.4rem;

    &_success {
      background: var(--clr__status-success);
    }

    &_failed {
      background: var(--clr__status-error);
    }
  }

  &__message {
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.8rem;
    padding: 3.2rem 2.4rem;
  }

  &__message-title {
    display: inline-block;
    font-size: 2rem;
    margin-bottom: 4rem;
  }

  &__message-row {
    @extend .transactions-item__table-row;
    border: none;
  }

  &__message-row-title {
    @extend .transactions-item__table-row-title;
  }

  &__message-row-value {
    @extend .transactions-item__table-row-value;
  }
}

@include respond-to(medium) {
  .transactions-item {
    &__subtitle-wrapper {
      max-width: 75%;
    }
  }
}

@include respond-to(tablet) {
  .transactions-item {
    &__title {
      margin: 0.8rem 0 0.4rem 0;
    }

    &__subtitle-wrapper {
      max-width: 100%;
    }

    &__table-row-info {
      display: none;
    }
  }
}
</style>
