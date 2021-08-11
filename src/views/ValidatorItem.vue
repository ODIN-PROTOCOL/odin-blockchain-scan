<template>
  <div class="container">
    <div class="block-item">
      <div class="block-item__title">
        <button class="block-back" @click.prevent="back">
          <img src="~@/assets/icons/back-arrow.svg" alt="info" />
          <span>Validators</span>
        </button>
        <h1 class="block-name">Validator</h1>
        <div class="hash-wrapper">
          <span class="block-id">{{ route.params.hash }}</span>
          <div class="copy-button__wrapper">
            <button
              class="copy-button"
              @click.prevent="copyValue(String(route.params.hash))"
            >
              <img src="~@/assets/icons/copy.svg" alt="info" />
            </button>
            <div class="tooltip">Copy From Validator Hash to clipboard.</div>
          </div>
        </div>
      </div>
      <div class="charts-wrapper mg-b32">
        <div class="charts-info">
          <div class="charts-row">
            <span class="title">Balance:</span>
            <span class="amount">12,523,093 ODIN </span>
          </div>
          <div class="charts-row">
            <span class="title">Stake</span>
            <span class="amount">210.0000 ODIN </span>
          </div>
          <div class="charts-row">
            <span class="title">Amount of created blocks</span>
            <span class="amount">546</span>
          </div>
        </div>
        <div class="charts">
          <div class="charts-item">
            <span class="charts-title">RAM</span>
            <div class="charts-inner">
              <div class="charts-full"></div>
              <div class="charts-ready ram" style="width: 50%">
                <span class="charts-percent">{{ '50' }}%</span>
              </div>
            </div>
            <span class="charts-size">7.15 KB / 14.3 KB</span>
          </div>

          <div class="charts-item">
            <span class="charts-title">NET</span>
            <div class="charts-inner">
              <div class="charts-full"></div>
              <div class="charts-ready net" style="width: 50%">
                <span class="charts-percent">{{ '50' }}%</span>
              </div>
            </div>
            <span class="charts-size">7.15 KB / 14.3 KB</span>
          </div>
          <div class="charts-item">
            <span class="charts-title">CPU</span>
            <div class="charts-inner">
              <div class="charts-full"></div>
              <div class="charts-ready cpu" style="width: 50%">
                <span class="charts-percent">{{ '50' }}%</span>
              </div>
            </div>
            <span class="charts-size">7.15 KB / 14.3 KB</span>
          </div>
        </div>
      </div>
      <h1 class="mg-b32">Created blocks</h1>
      <div class="app-table">
        <div class="data-sources__table-head app-table__head validators-head">
          <div class="app-table__cell" data-tooltip="">
            <span class="app-table__cell-txt"> Block </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Date and time </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Transactions </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Reward </span>
          </div>
        </div>
        <template v-if="blocks?.length">
          <div
            v-for="item in blocks"
            :key="item.id"
            class="data-sources__table-row app-table__row validators-row"
          >
            <div class="app-table__cell">
              <span class="app-table__header">Block</span>
              <router-link :to="`/blocks/block height`">
                <TitledLink
                  class="app-table__cell-txt"
                  :text="'block height'"
                />
              </router-link>
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Date and time</span>
              <div>
                <div class="info-value">
                  {{ convertToTime(item.time) }}
                </div>
                <div class="info-value">
                  {{ convertToDate(item.time) }}
                </div>
              </div>
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Reward</span>
              <span class="app-table__cell-txt">{{ 'reward' }}</span>
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
// import { callers } from '@/api/callers'
// import { Bech32 } from '@cosmjs/encoding'

import TitledLink from '@/components/TitledLink.vue'

import {
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupDistributionExtension,
  setupStakingExtension,
  setupIbcExtension,
} from '@cosmjs/stargate'

import { Tendermint34Client } from '@cosmjs/tendermint-rpc'

import { API_CONFIG } from '@/api/api-config'
import { convertDate, copyValue } from '@/helpers/helpers'
import { convertToTime, convertToDate } from '@/helpers/dates'

export default defineComponent({
  name: 'ValidatorItem',
  components: { TitledLink },
  setup() {
    const router: Router = useRouter()
    const back = (): void => {
      router.back()
    }
    const route: RouteLocationNormalizedLoaded = useRoute()

    const blocks = ref()

    // const validatorHash = ref()
    // validatorHash.value = +route.params.hash

    const validatorRamPercent = ref()
    const validatorNetPercent = ref()
    const validatorCpuPercent = ref()
    const validatorRamSize = ref()
    const validatorNetSize = ref()
    const validatorCpuSize = ref()
    const validatorSize = ref()

    const getValidator = async (): void => {
      // const response = await callers.getClient()
      // console.log(response)

      // const validatorAddress = Bech32.encode('odin', Bech32.decode(route.params.hash).data)
      // console.log(route.params.hash)
      // console.log(API_CONFIG.rpc)

      const client = QueryClient.withExtensions(
        await Tendermint34Client.connect(API_CONFIG.rpc),
        setupAuthExtension,
        setupBankExtension,
        setupDistributionExtension,
        setupStakingExtension,
        setupIbcExtension
      )

      console.log(client.staking.unverified.validator(route.params.hash))

      // response.validator(+route.params.id).then((res) => {
      //   validatorInfo.value = res
      //   validatorHash.value = getHash(validatorInfo.value.validatorId.hash)
      //   validatorParentHash.value = getHash(
      //     validatorInfo.value.validator.header.lastValidatorId.hash
      //   )
      // })
    }

    onMounted(async (): void => {
      await getValidator()
    })

    return {
      route,
      validatorSize,
      // validatorHash,
      back,
      copyValue,
      convertDate,
      blocks,
      validatorRamPercent,
      validatorNetPercent,
      validatorCpuPercent,
      validatorRamSize,
      validatorNetSize,
      validatorCpuSize,
      convertToTime,
      convertToDate,
    }
  },
})
</script>
<style lang="scss" scoped>
* {
  font-family: 'SF Display';
}
.block {
  &-item {
    padding: 2.6rem 3.3rem;

    &__title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-weight: 400;
      margin-bottom: 3.2rem;

      & > * {
        margin-right: 20px;
      }

      @media screen and (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media screen and (max-width: 600px) {
      padding: 1.6rem;
    }
  }

  &-name {
    font-weight: 400;
    font-size: 32px;

    @media screen and (max-width: 600px) {
      font-size: 28px;
    }
  }

  &-row {
    display: flex;
    padding-bottom: 1.6rem;
    padding-top: 1.6rem;
    border-bottom: 1px solid #cce4ff;

    &__title {
      max-width: 209px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      img {
        display: block;
        margin-right: 9px;
      }
    }
  }

  &-id {
    font-size: 24px;
    font-weight: 400;
    text-transform: uppercase;

    @media screen and (max-width: 1000px) {
      text-overflow: ellipsis;
      max-width: 50vw;
      overflow: hidden;
    }

    @media screen and (max-width: 600px) {
      max-width: 80vw;
    }
  }

  &-chars {
    padding-top: 1.9rem;

    .app-table__row {
      display: grid;
      grid-template-columns: 207px 1fr;
      padding: 1.6rem 0 1.6rem;

      @media screen and (max-width: 600px) {
        grid-template-columns: 150px 1fr;
      }
    }
  }

  &-back {
    min-width: 16px;

    span {
      display: none;
    }

    @media screen and (max-width: 600px) {
      display: flex;
      align-items: center;

      span {
        display: inline-block;
        font-size: 16px;
        color: var(--clr__action);
        margin-left: 10px;
      }
    }
  }
}

.info {
  &-value {
    display: flex;
    align-items: center;

    @media screen and (max-width: 992px) {
      span {
        max-width: 250px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    @media screen and (max-width: 500px) {
      span {
        max-width: 150px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  &-key {
    display: flex;
    width: 207px;
    align-items: center;

    img {
      display: block;
      margin-right: 9px;
      cursor: pointer;
    }

    div {
      position: relative;
      display: flex;
    }

    @media screen and (max-width: 600px) {
      width: 150px;

      img {
        display: none;
      }
    }
  }
}

.text-blue {
  color: var(--clr__action);
}

.copy-button {
  display: block;
  margin-left: 10px;
  width: 13px;
  height: 15px;

  &__wrapper {
    position: relative;

    @media screen and (max-width: 1800px) {
      .tooltip {
        left: auto;
        right: -10px;
        bottom: 25px;

        &:before {
          right: 9px;
          left: auto;
          top: 50px;
        }
      }
    }
  }
}

.info-key__inner img:hover + .tooltip,
.copy-button:hover + .tooltip {
  opacity: 1;
}

.tooltip {
  opacity: 0;
  position: absolute;
  left: -29px;
  bottom: 25px;
  transition: all 0.15s ease;
  border-radius: 10px;
  white-space: nowrap;
  background: var(--clr__tooltip-new);
  padding: 12px 24px;
  color: #fff;
  pointer-events: none;
  z-index: 1;

  &:before {
    content: '';
    border-top: 10px solid var(--clr__tooltip-new);
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    position: absolute;
    left: 35px;
    top: 51px;
    transform: translateY(-50%);
  }

  @media screen and (max-width: 1300px) {
    left: auto;
    right: 0;
    top: -300%;

    &:before {
      left: 90%;
      top: 108%;
      border-top: 10px solid var(--clr__tooltip-new);
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: none;
    }
  }

  @media screen and (max-width: 600px) {
    display: none;
  }
}

.info-key__inner .tooltip {
  &:before {
    left: 27px;
  }
}

.charts {
  &-wrapper {
    border: 1px solid var(--clr__action);
    border-radius: 8px;
    padding: 3.2rem 2.4rem;
    display: grid;
    grid-template-columns: 4fr 6fr;

    .cpu {
      background: #fdc748;
    }

    .ram {
      background: #007bff;
    }

    .net {
      background: #00d097;
    }

    @media screen and (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  &-item {
    // Kappa :fire: :fire: :fire: sorry
    display: flex;
    margin-bottom: 24px;
    display: grid;
    grid-template-columns: 50px 500px 1fr;
    grid-column-gap: 10px;

    @media screen and (max-width: 1100px) {
      grid-template-columns: 50px 300px 1fr;
    }

    @media screen and (max-width: 900px) {
      grid-template-columns: 40px 6fr 1fr;
    }

    @media screen and (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  &-inner {
    position: relative;
    max-height: 24px;

    @media screen and (max-width: 600px) {
      height: 24px;
      margin-bottom: 5px;
    }
  }

  &-full {
    position: relative;
    z-index: 1;
    width: 100%;
    background: #edf5ff;
    border-radius: 4px;
    max-width: 500px;
    height: 100%;

    @media screen and (max-width: 1100px) {
      max-width: 300px;
    }

    @media screen and (max-width: 900px) {
      max-width: 100%;
    }
  }

  &-ready {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 4px;
    z-index: 2;
  }

  &-percent {
    position: absolute;
    top: 50%;
    right: 11px;
    transform: translateY(-50%);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
  }

  &-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    margin-bottom: 24px;
    align-items: center;
    font-size: 16px;

    span + span {
      margin-left: 10px;
      display: inline-block;
    }

    .amount {
      font-weight: 600;
    }
  }

  &-title {
    font-weight: 600;
    font-size: 16px;
  }

  &-size {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
  }
}

.hash-wrapper {
  display: flex;
  align-items: center;
}

.data-sources__table-head {
  // @media screen and (max-width: 992px) {
  //   grid: repeat(8, minmax(4rem, 1fr)) / auto;
  // }
  @media screen and (max-width: 992px) {
    display: none;
  }
}

.app-table__header {
  display: none;

  @media screen and (max-width: 992px) {
    display: inline-block;
    width: 200px;
  }
}
</style>
