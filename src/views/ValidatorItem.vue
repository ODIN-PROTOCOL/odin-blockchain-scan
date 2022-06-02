<template>
  <div class="app__main-view validator-item">
    <div class="app__main-view-title-wrapper validators-item__title-wrapper">
      <BackButton class="validators-item__back-btn" text="Oracle validators" />
      <h2 class="app__main-view-title validators-item__title">Validator</h2>
      <div class="validators-item__validator-address">
        <p
          :title="validator?.operatorAddress"
          class="view-main__subtitle validators-item__subtitle"
        >
          {{ validator?.operatorAddress }}
        </p>
        <CopyButton class="mg-l8" :text="String(validator?.operatorAddress)" />
      </div>
      <div class="validators-item__oracle-status">
        <StatusIcon
          :width="14"
          :height="14"
          class="validators-item__oracle-status-icon"
          :status="validator?.isActive ? 'success' : 'error'"
        />

        <span
          class="validators-item__oracle-status-text"
          :class="
            validator?.isActive
              ? 'validators-item__oracle-status-text--success'
              : 'validators-item__oracle-status-text--error'
          "
          >Oracle</span
        >
      </div>
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
      <p>Validator not found!</p>
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
import { handleError } from '@/helpers/errors'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import StatusIcon from '@/components/StatusIcon.vue'
import { isActiveValidator } from '@/helpers/validatorDecoders'

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
    StatusIcon,
  },
  setup: function () {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const validator = ref()
    const delegators = ref<DelegationResponse[]>([])
    const delegatorsTitle = computed(() =>
      delegators.value?.length
        ? `Delegators (${delegators.value?.length})`
        : 'Delegators'
    )

    const getValidator = async () => {
      const response = await callers.getValidator(String(route.params.address))
      validator.value = {
        ...response.validator,
        isActive: await isActiveValidator(String(route.params.address)),
      }
    }

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
        handleError(error as Error)
      }
    })

    return {
      validator,
      delegators,
      delegatorsTitle,
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
.validators-item__oracle-status {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--clr__modal-field-bg);
  border-radius: 3.2rem;
  width: 7.8rem;
  height: 2.8rem;
  padding: 0.4rem 1.2rem 0.4rem 0.8rem;
  gap: 0.4rem;
  margin-right: 2rem;
}
.validators-item__oracle-status-text {
  font-weight: 400;
  font-size: 1.4rem;
  line-height: 2rem;
  &--success {
    color: var(--clr__oracle-status-success);
  }
  &--error {
    color: var(--clr__oracle-status-error);
  }
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
  .validators-item__oracle-status {
    margin-top: 1.2rem;
  }
}

@include respond-to(small) {
  .validators-item__activities-btn {
    font-size: 1.6rem;
  }
}
</style>
