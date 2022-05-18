<template>
  <div class="app__main-view accounts-item">
    <div class="app__main-view-title-wrapper">
      <BackButton text="Top accounts" />
      <h1 class="app__main-view-title accounts-item__title">Account</h1>
      <div
        class="app__main-view-subtitle-wrapper accounts-item__subtitle-wrapper"
      >
        <p class="app__main-view-subtitle fs-cut">
          {{ route.params.hash }}
        </p>
        <CopyButton class="mg-l8" :text="String(route.params.hash)" />
      </div>
    </div>

    <div class="accounts-item__stats mg-b32">
      <div class="accounts-item__stats-row">
        <span class="accounts-item__stats-title">GEO Balance:</span>
        <span class="accounts-item__stats-amount" :title="displayedGeoBalance">
          {{ displayedGeoBalance }}
        </span>
      </div>
      <div class="accounts-item__stats-row">
        <span class="accounts-item__stats-title">ODIN Balance:</span>
        <span class="accounts-item__stats-amount" :title="displayedOdinBalance">
          {{ displayedOdinBalance }}
        </span>
      </div>
    </div>
    <div class="accounts-item__subtitle-line">
      <div class="accounts-item__subtitle app__main-view-subtitle mg-b32">
        <div class="accounts-item__tx-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="accounts-item__tooltip">
            Based on last transactions in system
          </span>
        </div>
        <span class="view-main__subtitle-item">Transaction list</span>
      </div>
      <div class="accounts-item__selection">
        <div class="accounts-item__selection-item">
          <span class="accounts-item__selection-item-title">Filter</span>
          <VuePicker
            class="accounts-item__vue-picker _vue-picker"
            name="filter"
            v-model="sortingValue"
            :isDisabled="isLoading"
          >
            <template #dropdownInner>
              <div class="_vue-picker__dropdown-custom">
                <VuePickerOption
                  v-for="{ text, value } in sortingTypeTx"
                  :key="text"
                  :value="value"
                  :text="text"
                >
                  {{ text }}
                </VuePickerOption>
              </div>
            </template>
          </VuePicker>
        </div>
      </div>
    </div>

    <div v-if="transactions" class="app-table">
      <div class="app-table__head">
        <span> Transaction hash </span>
        <span> Type </span>
        <span> Block </span>
        <span> Date and time </span>
        <span> Sender </span>
        <span> Receiver </span>
        <span> Amount </span>
        <span> Transaction Fee </span>
      </div>
      <div class="app-table__body">
        <template v-if="transactions?.length">
          <AccountTxLine
            v-for="(item, index) in transactions"
            :key="index"
            :tx="item.attributes"
          />
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <p v-if="isLoading">Loading…</p>
            <p v-else>No items yet</p>
          </div>
        </template>
      </div>
    </div>
    <AppPagination
      v-if="totalTxCount > ITEMS_PER_PAGE"
      class="mg-t32"
      v-model="currentPage"
      :pages="totalPages"
      @update:modelValue="updateHandler"
    />
    <template v-else>
      <div class="app-table__row">
        <p class="app-table__empty-stub">No items yet</p>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, defineComponent, computed, watch } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { routerBack } from '@/router'
import { callers } from '@/api/callers'
import { convertToTxTime } from '@/helpers/dates'
import { copyValue } from '@/helpers/helpers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'

import { Bech32 } from '@cosmjs/encoding'
import { bigMath } from '@/helpers/bigMath'
import { handleError } from '@/helpers/errors'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import AccountTxLine from '@/components/AccountTxLine.vue'
import { sortingTypeTx, TYPE_TX_SORT } from '@/helpers/helpers'

export default defineComponent({
  components: { BackButton, CopyButton, AppPagination, AccountTxLine },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const geoBalance = ref<string>()
    const odinBalance = ref<string>()
    const transactions = ref()
    const totalTxCount = ref<number>(0)

    const currentPage = ref<number>(1)
    const totalPages = ref<number>()
    const ITEMS_PER_PAGE = 50
    const sortingValue = ref(TYPE_TX_SORT.all)

    const displayedGeoBalance = computed(() =>
      geoBalance.value ? `${geoBalance.value} GEO` : '0 GEO'
    )
    const displayedOdinBalance = computed(() =>
      odinBalance.value ? `${odinBalance.value} ODIN` : '0 ODIN'
    )

    const getTotalAmount = async (
      validatorAddress: string,
      denom: string
    ): Promise<string> =>
      callers
        .getUnverifiedBalances(validatorAddress, denom)
        .then((res) => bigMath.bigConvectOdinAndGeo(res.amount).toString())

    const getAccountInfo = async () => {
      lockLoading()
      try {
        const validatorAddress = Bech32.encode(
          'odin',
          Bech32.decode(route.params.hash as string).data
        )
        const tx = await callers
          .getAccountTx(
            currentPage.value - 1,
            50,
            validatorAddress,
            'desc',
            sortingValue.value
          )
          .then((resp) => resp.json())

        geoBalance.value = await getTotalAmount(validatorAddress, 'minigeo')
        odinBalance.value = await getTotalAmount(validatorAddress, 'loki')
        transactions.value = tx.data
        totalTxCount.value = tx.total_count
        totalPages.value = Math.ceil(tx.total_count / ITEMS_PER_PAGE)
      } catch (e) {
        handleError(e as Error)
      }
      releaseLoading()
    }

    onMounted(() => {
      getAccountInfo()
    })
    const updateHandler = async () => {
      await getAccountInfo()
    }
    watch([sortingValue], async () => {
      currentPage.value = 1
      await getAccountInfo()
    })

    return {
      route,
      displayedGeoBalance,
      displayedOdinBalance,
      routerBack,
      router,
      copyValue,
      convertToTxTime,
      transactions,
      totalTxCount,
      currentPage,
      totalPages,
      ITEMS_PER_PAGE,
      updateHandler,
      sortingTypeTx,
      sortingValue,
      isLoading,
    }
  },
})
</script>

<style lang="scss" scoped>
.accounts-item__title {
  margin: 0 1.6rem 0 2rem;
}

.accounts-item__subtitle-wrapper {
  display: flex;
}

.accounts-item__stats {
  border: 0.1rem solid var(--clr__action);
  border-radius: 0.8rem;
  padding: 3.2rem 2.4rem;
  display: inline-block;
}

.accounts-item__stats-row {
  display: grid;
  grid-template-columns: 10rem 1fr;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 2.4rem;
  }
}

.accounts-item__stats-title {
  font-size: 1.6rem;
  width: 10rem;
  display: inline-block;
}

.accounts-item__stats-amount {
  font-weight: 600;
  font-size: 1.6rem;
  margin-left: 2.4rem;
  @include ellipsis();
}
.accounts-item__subtitle-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.accounts-item__selection {
  display: flex;
}
.accounts-item__selection-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.accounts-item__selection-item-title {
  font-size: 1.4rem;
  font-weight: 300;
  margin-right: 0.4rem;
}
.accounts-item__subtitle {
  display: flex;
  align-items: center;
}
.accounts-item__tx-info {
  display: flex;
  align-items: center;
  height: 2.3rem;
  position: relative;
  cursor: pointer;
  margin-right: 0.9rem;
  &:hover {
    .accounts-item__tooltip {
      display: block;
    }
  }
}
.accounts-item__tooltip {
  display: none;
  position: absolute;
  bottom: 130%;
  left: -0.7rem;
  width: 20rem;
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
    left: 8%;
    transform: translateX(-50%) rotate(45deg);
    background: var(--clr__tooltip-bg);
  }
}
@include respond-to(tablet) {
  .accounts-item__title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .accounts-item__subtitle-wrapper {
    width: 100%;
  }

  .accounts-item__stats {
    width: 100%;
  }
  .accounts-item__selection {
    width: 100%;
    flex-direction: column;
    margin-bottom: 0rem;
  }
  .accounts-item__subtitle-line {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  .accounts-item__selection-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .accounts-item__vue-picker {
    width: 100%;
  }
  .accounts-item__selection-item-title {
    margin: 0 0 0.4rem;
  }
}
</style>
