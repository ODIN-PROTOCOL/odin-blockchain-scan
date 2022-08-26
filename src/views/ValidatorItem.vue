<template>
  <div class="app__main-view validator-item">
    <div class="app__main-view-title-wrapper validators-item__title-wrapper">
      <BackButton class="validators-item__back-btn" text="Oracle validators" />
      <h2 class="app__main-view-title validators-item__title">Validator</h2>
      <template v-if="validator">
        <div class="validators-item__validator-address">
          <p
            :title="operatorAddress"
            class="view-main__subtitle validators-item__subtitle"
          >
            {{ operatorAddress }}
          </p>
          <CopyButton :text="String(operatorAddress)" class="mg-l8" />
        </div>
        <ValidatorStatus
          :width="14"
          :height="14"
          :status="
            getValidatorStatus(validator.statuses[0].status, validator.isActive)
          "
          class="validators-item__validator-status"
        />
      </template>
    </div>
    <template v-if="isFinishLoading">
      <template v-if="isLoadingError || !isValidatorResponseLoadingError">
        <div class="app-table__empty-stub">
          <ui-loading-error-message message="Not Found" title="404" />
        </div>
      </template>
      <template v-else>
        <template v-if="validator">
          <ValidatorInfo :validator="validator" />
          <AppTabs>
            <AppTab title="Oracle Reports">
              <OracleReportsTable :proposer-address="operatorAddress" />
            </AppTab>
            <AppTab :title="delegatorsTitle">
              <DelegatorsTable
                :delegators="delegators"
                :is-loading="isLoading"
              />
            </AppTab>
            <AppTab title="Proposed Blocks">
              <ProposedBlocksTable :proposer-address="operatorAddress" />
            </AppTab>
          </AppTabs>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <ui-no-data-message />
          </div>
        </template>
      </template>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <ui-loader positionCenter message="Loading" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { isActiveValidator } from '@/helpers/validatorsHelpers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { useQuery } from '@vue/apollo-composable'
import { ValidatorQuery } from '@/graphql/queries'
import { ValidatorResponse } from '@/graphql/types'
import {
  ValidatorInfoModify,
  getValidatorStatus,
} from '@/helpers/validatorsHelpers'
import {
  UiLoadingErrorMessage,
  UiLoader,
  UiNoDataMessage,
} from '@/components/ui'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import ValidatorInfo from '@/components/ValidatorInfo.vue'
import OracleReportsTable from '@/components/tables/OracleReportsTable.vue'
import DelegatorsTable from '@/components/tables/DelegatorsTable.vue'
import ProposedBlocksTable from '@/components/tables/ProposedBlocksTable.vue'
import ValidatorStatus from '@/components/ValidatorStatus.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const isLoadingError = ref(false)
const route: RouteLocationNormalizedLoaded = useRoute()
const validator = ref<ValidatorInfoModify>()
const delegators = ref<DelegationResponse[]>([])
const delegatorsTitle = computed(() =>
  delegators.value?.length
    ? `Delegators (${delegators.value?.length})`
    : 'Delegators',
)
const operatorAddress = ref('')

const { result, loading: isValidatorResponseLoading } =
  useQuery<ValidatorResponse>(ValidatorQuery, {
    address: String(route.params.address),
  })

const isValidatorResponseLoadingError = computed(
  () => result.value?.validator.length,
)

const isFinishLoading = computed(
  () =>
    !(
      isLoading.value ||
      isValidatorResponseLoading.value ||
      !result.value?.validator
    ),
)

const getValidator = async () => {
  lockLoading()
  try {
    if (result.value?.validator) {
      validator.value = {
        ...result.value.validator[0],
        isActive: await isActiveValidator(String(route.params.address)),
      }
      operatorAddress.value = validator.value.info.operatorAddress
    }
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const getDelegators = async () => {
  lockLoading()
  try {
    const response = await callers.getValidatorDelegations(
      String(route.params.address),
    )
    if (response.delegationResponses) {
      delegators.value = response.delegationResponses
    }
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

watch([isValidatorResponseLoading], async () => {
  await getValidator()
})

onMounted(async () => {
  await getValidator()
  await getDelegators()
})
</script>

<style lang="scss" scoped>
.validators-item__title-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-right: 2rem;
  font-size: 2.4rem;
}
.validators-item__title {
  margin: 0 1.6rem 0 2rem;
}
.validators-item__validator-address {
  display: flex;
  min-width: 10%;
  margin-right: 1rem;
}
.validators-item__back-btn {
  height: 4.6rem;
  font-size: 1.6rem;
  line-height: 2.4rem;
}
.validators-item__subtitle {
  @include ellipsis();
  line-height: 4.6rem;
}

@include respond-to(tablet) {
  .validators-item__title-wrapper {
    align-items: flex-start;
  }
  .validators-item {
    padding-bottom: 10rem;
  }
  .validators-item__title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .validators-item__subtitle {
    line-height: 3rem;
  }

  .validators-item__back-btn {
    height: 2.4rem;
  }

  .validators-item__validator-address {
    width: 100%;
    margin: 0;
  }
  .validators-item__activities--top {
    display: none;
  }

  .validators-item--large-padding {
    padding-bottom: 17rem;
  }
  .validators-item__title-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 0;
    margin-bottom: 3.2rem;
  }
  .validators-item__validator-status {
    margin-top: 1.2rem;
  }
}

@include respond-to(small) {
  .validators-item__activities-btn {
    font-size: 1.6rem;
  }
}
</style>
