<template>
  <div class="app-table__row validators-table-row-mobile">
    <div class="app-table__cell validators-table-row-mobile__cell">
      <div class="validators-table-row-mobile__info">
        <span class="validators-table-row-mobile__rank">
          {{ validator.rank }}
        </span>
        <TitledLink
          v-if="validator.descriptions.length"
          class="app-table__cell-txt app-table__link"
          :text="validator.descriptions[0]?.moniker"
          :name="{
            name: $routes.validatorDetails,
            params: { address: validator.info.operatorAddress },
          }"
        />
        <p v-else class="app-table__cell-txt">-</p>
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
          $convertLokiToOdin($trimZeros(validator.info.delegatedAmount), {
            onlyNumber: true,
          })
        "
      >
        {{
          $convertLokiToOdin($trimZeros(validator.info.delegatedAmount), {
            withDenom: true,
          })
        }}
      </span>
    </div>
    <template v-if="isShowValidatorDetails">
      <div class="app-table__cell">
        <span class="app-table__title">Commission</span>
        <span v-if="validator.commissions.length">
          {{ $trimZeros(validator?.commissions[0]?.commission * 100, 2) }}%
        </span>
        <span v-else>0%</span>
      </div>
      <div v-if="tabStatus !== inactiveValidatorsTitle" class="app-table__cell">
        <span class="app-table__title">Uptime</span>
        <ProgressbarTool
          :min="0"
          :max="100"
          :current="$trimZeros(validator?.uptime, 2) || 0"
          is-for-validators
        />
      </div>
      <div class="app-table__cell">
        <span class="app-table__title">Status</span>
        <ValidatorStatus
          :width="14"
          :height="14"
          :status="
            getValidatorStatus(validator.statuses[0].status, validator.isActive)
          "
          class="validators-item__validator-status"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  getValidatorStatus,
  ValidatorInfoModify,
} from '@/helpers/validatorsHelpers'
import { ArrowIcon } from '@/components/icons'
import TitledLink from '@/components/TitledLink.vue'
import ProgressbarTool from '@/components/ProgressbarTool.vue'
import ValidatorStatus from '@/components/ValidatorStatus.vue'

defineProps<{
  validator: ValidatorInfoModify
  tabStatus: string
  inactiveValidatorsTitle: string
}>()

const isShowValidatorDetails = ref(false)
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
