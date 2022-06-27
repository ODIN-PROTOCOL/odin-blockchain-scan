<template>
  <div class="app-table__row validators-view-table-row">
    <div class="app-table__cell">
      <span class="app-table__title">Rank</span>
      <span>{{ validator.rank }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Validator</span>
      <TitledLink
        class="app-table__cell-txt app-table__link"
        :text="validator.description.moniker"
        :to="`/validators/${validator.operatorAddress}`"
      />
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
    <div class="app-table__cell validators-view-table-row__cell--center">
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
    <div class="app-table__cell validators-view-table-row__cell--center">
      <span class="app-table__title">Status</span>
      <ValidatorStatus
        :width="14"
        :height="14"
        :status="validatorStatus(validator)"
        class="validators-item__validator-status"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import ProgressbarTool from '@/components/ProgressbarTool.vue'
import ValidatorStatus from '@/components/ValidatorStatus.vue'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'

export default defineComponent({
  components: {
    TitledLink,
    ProgressbarTool,
    ValidatorStatus,
  },
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
    tabStatus: { type: String, required: true },
    inactiveValidatorsTitle: { type: String, required: true },
  },
  setup() {
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref(0)

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

    return {
      ITEMS_PER_PAGE,
      totalPages,
      currentPage,
      validatorStatus,
    }
  },
})
</script>

<style lang="scss" scoped>
.validators-view-table-row {
  padding: 3.2rem 0 2rem;
  align-items: center;
}
.validators-view-table-row__cell--center {
  justify-content: center;
}
@include respond-to(tablet) {
  .validators-view-table-row__cell--center {
    justify-content: flex-start;
  }
}
</style>
