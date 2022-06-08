<template>
  <div class="app__main-view validator-item">
    <div class="app__main-view-title-wrapper validators-item__title-wrapper">
      <BackButton class="validators-item__back-btn" text="Oracle validators" />
      <h2 class="app__main-view-title validators-item__title">Validator</h2>
      <div
        v-if="!isLoading && validator"
        class="validators-item__validator-address"
      >
        <p
          :title="validator?.operatorAddress"
          class="view-main__subtitle validators-item__subtitle"
        >
          {{ validator?.operatorAddress }}
        </p>
        <CopyButton class="mg-l8" :text="String(validator?.operatorAddress)" />
      </div>
      <ValidatorStatus
        v-if="!isLoading && validator"
        :width="14"
        :height="14"
        :status="validatorStatus"
        class="validators-item__validator-status"
      />
    </div>

    <template v-if="validator">
      <ValidatorInfo :validator="validator" />
      <AppTabs>
        <AppTab title="Oracle Reports">
          <OracleReportsTable :proposerAddress="validator.operatorAddress" />
        </AppTab>
        <AppTab :title="delegatorsTitle">
          <DelegatorsTable :delegators="delegators" />
        </AppTab>
        <AppTab title="Proposed Blocks">
          <ProposedBlocksTable :proposerAddress="validator.operatorAddress" />
        </AppTab>
      </AppTabs>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <p v-if="isLoading" class="empty mg-t32">Loading…</p>
        <p v-else class="empty mg-t32">Validator not found!</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import ValidatorInfo from '@/components/ValidatorInfo.vue'
import OracleReportsTable from '@/components/tables/OracleReportsTable.vue'
import DelegatorsTable from '@/components/tables/DelegatorsTable.vue'
import ProposedBlocksTable from '@/components/tables/ProposedBlocksTable.vue'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import ValidatorStatus from '@/components/ValidatorStatus.vue'
import { isActiveValidator } from '@/helpers/validatorDecoders'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { VALIDATOR_STATUS_TYPE } from '@/helpers/helpers'

export default defineComponent({
  components: {
    BackButton,
    CopyButton,
    AppTabs,
    AppTab,
    ValidatorInfo,
    OracleReportsTable,
    DelegatorsTable,
    ProposedBlocksTable,
    ValidatorStatus,
  },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const validator = ref()
    const delegators = ref<DelegationResponse[]>([])
    const delegatorsTitle = computed(() =>
      delegators.value?.length
        ? `Delegators (${delegators.value?.length})`
        : 'Delegators'
    )

    const getValidator = async () => {
      lockLoading()
      try {
        const response = await callers.getValidator(
          String(route.params.address)
        )
        validator.value = {
          ...response.validator,
          isActive: await isActiveValidator(String(route.params.address)),
        }
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const validatorStatus = computed(() => {
      if (validator.value?.status === 3) {
        return validator.value.isActive
          ? VALIDATOR_STATUS_TYPE.success
          : VALIDATOR_STATUS_TYPE.error
      } else {
        return VALIDATOR_STATUS_TYPE.inactive
      }
    })
    const getDelegators = async () => {
      const response = await callers.getValidatorDelegations(
        String(route.params.address)
      )
      if (response.delegationResponses) {
        delegators.value = response.delegationResponses
      }
    }

    onMounted(async () => {
      try {
        await getValidator()
        await getDelegators()
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
    })

    return {
      validator,
      delegators,
      delegatorsTitle,
      validatorStatus,
      isLoading,
    }
  },
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
  font-size: 16px;
  line-height: 24px;
}
.validators-item__subtitle {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
