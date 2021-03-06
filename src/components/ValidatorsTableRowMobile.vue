<template>
  <div class="app-table__row validators-table-row-mobile">
    <div class="app-table__cell validators-table-row-mobile__cell">
      <div class="validators-table-row-mobile__info">
        <span class="validators-table-row-mobile__rank">{{
          validator.rank
        }}</span>
        <TitledLink
          class="app-table__cell-txt app-table__link"
          :text="validator.description.moniker"
          :to="`/validators/${validator.operatorAddress}`"
        />
      </div>
      <div class="validators-table-row-mobile__show">
        <button
          @click="isShowValidatorDetails = !isShowValidatorDetails"
          type="button"
          class="validators-table-row-mobile__show-button"
        >
          {{ isShowValidatorDetails ? 'Hidden' : 'Show more' }}
          <ArrowIcon
            class="validators-table-row-mobile__arrow-icon"
            :class="{
              ['validators-table-row-mobile__arrow-icon--active']:
                isShowValidatorDetails,
            }"
          />
        </button>
      </div>
    </div>
    <div class="app-table__cell app-table__cell-txt">
      <span class="app-table__title">Delegated</span>
      <span
        :title="
          $convertLokiToOdin(validator.delegatorShares, {
            withPrecise: true,
          })
        "
      >
        {{
          $convertLokiToOdin(validator.delegatorShares, {
            withDenom: true,
            withPrecise: true,
          })
        }}
      </span>
    </div>
    <template v-if="isShowValidatorDetails">
      <div class="app-table__cell">
        <span class="app-table__title">Commission</span>
        <span>
          {{ $getPrecisePercents(validator.commission.commissionRates.rate) }}
        </span>
      </div>
      <div v-if="tabStatus !== inactiveValidatorsTitle" class="app-table__cell">
        <span class="app-table__title">Uptime</span>
        <ProgressbarTool
          :min="0"
          :max="100"
          :current="Number(validator.uptimeInfo?.uptime) || 0"
          :isForValidators="true"
        />
      </div>
      <div class="app-table__cell">
        <span class="app-table__title">Status</span>
        <ValidatorStatus
          :width="14"
          :height="14"
          :status="validatorStatus(validator)"
          class="validators-item__validator-status"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import ProgressbarTool from '@/components/ProgressbarTool.vue'
import ValidatorStatus from '@/components/ValidatorStatus.vue'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'

export default defineComponent({
  components: {
    TitledLink,
    ProgressbarTool,
    ValidatorStatus,
    ArrowIcon,
  },
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
    tabStatus: { type: String, required: true },
    inactiveValidatorsTitle: { type: String, required: true },
  },
  setup(props, { emit }) {
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref(0)
    const isShowValidatorDetails = ref(false)

    const validatorStatus = (validator: {
      status: number
      isActive: boolean
    }) => {
      if (validator.status === 3) {
        return validator.isActive ? 'success' : 'error'
      } else {
        return 'inactive'
      }
    }
    const selectedBtn = (typeBtn: string) => {
      emit('selectedBtn', { typeBtn, validator: props.validator })
    }

    return {
      validatorStatus,
      selectedBtn,
      ITEMS_PER_PAGE,
      totalPages,
      currentPage,
      isShowValidatorDetails,
    }
  },
})
</script>

<style lang="scss" scoped>
.validators-table-row-mobile__info {
  display: flex;
  align-items: center;
  max-width: 16.5rem;
  min-width: 12rem;
  &:first-child {
    margin-right: 1.6rem;
  }
}
.validators-table-row-mobile {
  grid: none;
}
.validators-table-row-mobile__rank {
  margin-right: 1.6rem;
}
.validators-table-row-mobile {
  padding: 3.2rem 0 2rem;
  align-items: center;
}
.validators-table-row-mobile__activities {
  width: 100%;

  & > *:not(:last-child) {
    margin-bottom: 1.6rem;
  }
}
.validators-table-row-mobile__activities-item {
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
  & > * {
    flex: 1;
  }
}
.validators-table-row-mobile__show {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
}
.validators-table-row-mobile__show-button {
  color: var(--clr__btn-normal);
  text-align: center;
}
.validators-table-row-mobile__arrow-icon {
  fill: var(--clr__btn-normal);
  transform: translate(0.3rem, 0.7rem);
}
.validators-table-row-mobile__arrow-icon--active {
  transform: translate(0rem, 0.7rem) rotate(180deg);
  fill: var(--clr__action);
}
.validators-table-row-mobile__cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
