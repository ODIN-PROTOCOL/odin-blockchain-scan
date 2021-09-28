<template>
  <div class="container">
    <div>
      <div class="mg-b16 mg-t32 validators-nav">
        <h2
          class="view-title"
          @click="changeTab(true)"
          :class="showValidators ? 'active' : ''"
        >
          Validators
        </h2>
        <h2
          class="view-title"
          @click="changeTab(false)"
          :class="!showValidators ? 'active' : ''"
        >
          Delegates
        </h2>
      </div>
      <div class="mg-b16 mg-t16" v-if="showValidators && validators?.length">
        <p>{{ validators?.length }} validators found</p>
      </div>
      <div class="mg-b16 mg-t16" v-if="!showValidators && delegators?.length">
        <p>{{ delegators?.length }} delegates found</p>
      </div>
    </div>
    <div class="app-table" v-if="showValidators">
      <div class="data-sources__table-head app-table__head validators-head">
        <div class="app-table__cell" data-tooltip="">
          <span class="app-table__cell-txt"> Validator </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Balance </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Stake </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Delegation share </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Amount of created blocks </span>
        </div>
      </div>
      <template v-if="filteredValidators?.length">
        <div
          v-for="item in filteredValidators"
          :key="item.id"
          class="data-sources__table-row app-table__row validators-row"
        >
          <div class="app-table__cell">
            <span class="app-table__header">Validator</span>
            <router-link :to="`/validators/${item.operatorAddress}`">
              <TitledLink
                class="app-table__cell-txt"
                :text="item.operatorAddress.toUpperCase()"
              />
            </router-link>
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">Balance</span>
            <span class="app-table__cell-txt">{{ 'test' }}</span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">Stake</span>
            <span class="app-table__cell-txt">{{ item.tokens }}</span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">Delegation share</span>
            <span class="app-table__cell-txt">{{ item.delegatorShares }}</span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">Amount of created blocks</span>
            <div>
              <span class="app-table__cell-txt">{{}}</span>
              <span class="currency">{{}}</span>
            </div>
          </div>
        </div>
        <div class="pagination-wrapper mg-t32">
          <v-pagination
            v-model="pageValidator"
            :pages="totalValidatorPages"
            :range-size="1"
            active-color="#007bff"
            @update:modelValue="updateValidatorHandler"
            :hideFirstButton="true"
            :hideLastButton="true"
          >
          </v-pagination>
        </div>
      </template>
      <template v-else>
        <div class="app-table__row">
          <p class="app-table__empty-stub">No items yet</p>
        </div>
      </template>
    </div>
    <div class="app-table" v-if="!showValidators">
      <div class="data-sources__table-head app-table__head delegators-head">
        <div class="app-table__cell" data-tooltip="">
          <span class="app-table__cell-txt"> Delegate </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Balance </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Stake </span>
        </div>
      </div>
      <template v-if="filteredDelegators?.length">
        <div
          v-for="item in filteredDelegators"
          :key="item.id"
          class="data-sources__table-row app-table__row delegators-row"
        >
          <div class="app-table__cell">
            <span class="app-table__header">Delegate</span>
            <span
              class="delegate-status"
              :class="
                item.delegation.validatorAddress ? 'validate' : 'delegate'
              "
            >
              {{ item.delegation.validatorAddress ? 'V' : 'D' }}
            </span>
            <router-link
              :to="`/delegators/${item.delegation.delegatorAddress}`"
            >
              <TitledLink
                class="app-table__cell-txt"
                :text="
                  item.delegation.validatorAddress
                    ? item.delegation.validatorAddress
                    : item.delegation.delegatorAddress
                "
              />
            </router-link>
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">Balance</span>
            <span>{{ 'test' }}</span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__header">Stake</span>
            <div>
              <span class="app-table__cell-txt">{{ item.balance.amount }}</span>
              <span class="app-table__cell-txt currency">{{
                item.balance.denom
              }}</span>
            </div>
          </div>
        </div>
        <div class="pagination-wrapper mg-t32">
          <v-pagination
            v-model="pageDelegator"
            :pages="totalDelegatorPages"
            :range-size="1"
            active-color="#007bff"
            @update:modelValue="updateDelegatorHandler"
            :hideFirstButton="true"
            :hideLastButton="true"
          >
          </v-pagination>
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
import { callers } from '@/api/callers'
import { toHex } from '@cosmjs/encoding'
import TitledLink from '@/components/TitledLink.vue'
import { defineComponent, ref, onMounted, watch } from 'vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
// import { Bech32, fromBase64 } from '@cosmjs/encoding'
// import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'

export default defineComponent({
  components: { TitledLink, VPagination },
  setup() {
    const validators = ref()
    const delegators = ref()
    const filteredValidators = ref()
    const filteredDelegators = ref()
    const itemsPerPage = 5
    const pageValidator = ref(1)
    const pageDelegator = ref()
    const totalValidatorPages = ref()
    const totalDelegatorPages = ref()
    const toHexFunc = toHex
    const showValidators = ref(true)

    const getValidators = async () => {
      const response = await callers.getValidators('BOND_STATUS_BONDED')

      if (response && response.pagination) {
        validators.value = response.validators

        totalValidatorPages.value = Math.ceil(
          validators.value.length / itemsPerPage
        )

        await filterValidators(pageValidator.value).then(
          async () => await getDelegators()
        )
      }
    }

    const getDelegators = async () => {
      for (let item of validators.value) {
        await callers.getDelegations(item.operatorAddress).then((res) => {
          if (res.delegationResponses.length > 0) {
            if (Array.isArray(delegators.value)) {
              delegators.value = [...res.delegationResponses].concat(
                delegators.value
              )
            } else {
              delegators.value = [...res.delegationResponses]
            }
          }
        })
      }
    }

    const filterValidators = async (newPage: number) => {
      let tempArr = validators.value

      if (newPage === 1) {
        filteredValidators.value = tempArr.slice(0, newPage * itemsPerPage)
      } else {
        filteredValidators.value = tempArr.slice(
          (newPage - 1) * itemsPerPage,
          (newPage - 1) * itemsPerPage + itemsPerPage
        )
      }
      pageValidator.value = newPage
    }

    const filterDelegators = async (num?: number) => {
      const page = num || 1
      let tempArr = delegators.value ? delegators.value : []

      totalDelegatorPages.value = Math.ceil(
        delegators.value.length / itemsPerPage
      )

      if (page === 1) {
        filteredDelegators.value = tempArr.slice(0, page * itemsPerPage)
      } else {
        filteredDelegators.value = tempArr.slice(
          (page - 1) * itemsPerPage,
          (page - 1) * itemsPerPage + itemsPerPage
        )
      }

      pageDelegator.value = page
    }

    const changeTab = (state: boolean) => (showValidators.value = state)

    const updateValidatorHandler = (num: number) => {
      filterValidators(num)
    }

    const updateDelegatorHandler = (num: number) => {
      filterDelegators(num)
    }

    watch(delegators, () => filterDelegators())

    onMounted(() => {
      getValidators()
      pageDelegator.value = 1
    })

    return {
      validators,
      delegators,
      pageValidator,
      pageDelegator,
      totalValidatorPages,
      totalDelegatorPages,
      filteredValidators,
      filteredDelegators,
      showValidators,
      updateValidatorHandler,
      updateDelegatorHandler,
      toHexFunc,
      changeTab,
    }
  },
})
</script>

<style scoped lang="scss">
.validators-head,
.validators-row {
  grid:
    auto /
    repeat(5, minmax(4rem, 1fr));

  @media screen and (max-width: 992px) {
    grid: repeat(5, minmax(4rem, 1fr)) / auto;
  }
}

.delegators-head,
.delegators-row {
  grid:
    auto /
    repeat(3, minmax(4rem, 1fr));

  @media screen and (max-width: 992px) {
    grid: repeat(3, minmax(4rem, 1fr)) / auto;
  }
}

.blocks-container {
  border-top: 1px solid var(--clr__table-border);
}

.app-table__row {
  padding: 3.2rem 0 2rem;

  @media screen and (max-width: 992px) {
    padding: 1.6rem 0 0 0;
  }
}

.app-table__cell {
  position: relative;
}

.app-table__cell-txt {
  max-width: 200px;
  padding-right: 20px;

  @media screen and (max-width: 600px) {
    max-width: 150px;
  }
}

.view-title {
  font-weight: 400;
  font-size: 32px;

  @media screen and (max-width: 600px) {
    font-size: 28px;
  }
}

.app-table__cell-txt:hover + .tooltip {
  opacity: 1;
}

.tooltip {
  opacity: 0;
  position: absolute;
  left: 0;
  bottom: 100%;
  transform: translateY(-50%);
  transition: all 0.15s ease;
  border-radius: 10px;
  white-space: nowrap;
  background: var(--clr__tooltip-new);
  padding: 12px 24px;
  color: #fff;
  z-index: 1;
  pointer-events: none;

  &:before {
    content: '';
    border-top: 10px solid var(--clr__tooltip-new);
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    position: absolute;
    left: 20px;
    top: 100%;
    transform: translateY(-50%);
  }

  @media screen and (max-width: 600px) {
    display: none;
  }
}

.currency {
  text-transform: uppercase;
}

.app-table__head {
  @media screen and (max-width: 992px) {
    display: none;
  }
}

.app-table__header {
  display: none;

  @media screen and (max-width: 76.8rem) {
    display: inline-block;
    width: 20rem;
  }

  @media screen and (max-width: 600px) {
    width: 170px;
  }
}

.validators-nav {
  display: flex;

  h2 {
    width: 137px;
    color: var(--clr__text);
    border-bottom: 2px solid rgba(0, 123, 255, 0.16);
    font-size: 2rem;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      border-bottom: 2px solid var(--clr__action);
      font-weight: 600;
    }
  }
}
.delegate-status {
  min-width: 26px;
  min-height: 24px;
  width: 26px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  color: #fff;
  border-radius: 4px;
  margin-right: 11px;

  &.delegate {
    background: #00c4d0;
  }

  &.validate {
    background: #00d097;
  }
}
</style>
<style lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;

  li {
    background: #fff;
    border: 1px solid var(--clr__action);
    border-radius: 4px;
    margin: 0 4px;
    min-width: 26px;
    height: 36px;
  }

  button {
    height: 100%;
    width: 100%;
    border: none;
    margin: 0;
    padding: 10px;
  }

  .Page {
    color: var(--clr__action);

    &:hover {
      border: none;
    }
  }
  .Page-active {
    color: #fff;
  }

  .PaginationControl .Control.Control-active {
    fill: var(--clr__action);
  }
  .PaginationControl .Control {
    fill: #cce4ff;
  }

  .DotsHolder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    svg,
    path {
      color: var(--clr__action);
    }
  }
}
</style>
