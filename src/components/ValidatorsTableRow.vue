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
        :text="validator?.validatorDescriptions[0]?.moniker || '???'"
        :to="`/validators/${validator?.validatorInfo.operatorAddress}`"
      />
    </div>
    <div class="app-table__cell app-table__cell-txt">
      <span class="app-table__title">Delegated</span>
      <span
        :title="
          $convertLokiToOdin(
            Number(validator.validatorInfo.delegatorShares).toFixed(6),
            {
              onlyNumber: true,
            }
          )
        "
      >
        {{
          $convertLokiToOdin(
            Number(validator.validatorInfo.delegatorShares).toFixed(6),
            { withDenom: true }
          )
        }}
      </span>
    </div>
    <div class="app-table__cell validators-view-table-row__cell--center">
      <span class="app-table__title">Commission</span>
      <span>
        {{
          +(validator?.validatorCommissions[0]?.commission * 100).toFixed(2)
        }}%
      </span>
    </div>
    <div v-if="tabStatus !== inactiveValidatorsTitle" class="app-table__cell">
      <span class="app-table__title">Uptime</span>
      <ProgressbarTool
        :min="0"
        :max="100"
        :current="Number(validator?.uptime?.toFixed(2)) || 0"
        is-for-validators
      />
    </div>
    <div class="app-table__cell validators-view-table-row__cell--center">
      <span class="app-table__title">Status</span>
      <ValidatorStatus
        :width="14"
        :height="14"
        :status="validatorStatus()"
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
import { VALIDATOR_STATUS } from '@/helpers/validatorsHelpers'
import { ValidatorInfoModify } from '@/helpers/validatorsHelpers'

export default defineComponent({
  components: {
    TitledLink,
    ProgressbarTool,
    ValidatorStatus,
  },
  props: {
    validator: {
      type: Object as PropType<ValidatorInfoModify>,
      required: true,
    },
    tabStatus: { type: String, required: true },
    inactiveValidatorsTitle: { type: String, required: true },
  },
  setup(props) {
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref(0)

    const validatorStatus = () => {
      if (
        props.validator?.validatorStatuses[0]?.status ===
        VALIDATOR_STATUS.active
      ) {
        return props.validator?.isActive ? 'success' : 'error'
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
