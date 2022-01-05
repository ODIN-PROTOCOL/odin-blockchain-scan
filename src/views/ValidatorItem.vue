<template>
  <div class="validator container">
    <div class="view-main__title-wrapper">
      <BackButton :text="'Validators'" />
      <h2 class="view-main__title">Validator</h2>
      <div class="view-main__subtitle-wrapper">
        <p class="view-main__subtitle fs-cut">
          {{ validator?.operatorAddress }}
        </p>
        <CopyButton class="mg-l8" :text="String(validator?.operatorAddress)" />
      </div>
    </div>

    <template v-if="validator">
      <ValidatorInfoCard :validator="validator" />

      <Tabs>
        <Tab title="Oracle Reports">
          <template v-if="reports">
            <OracleReportsTable :reports="reports" />
          </template>
        </Tab>
        <Tab title="Delegators">
          <template v-if="delegators">
            <DelegatorsTable :delegators="delegators" />
          </template>
        </Tab>
        <Tab title="Proposed Blocks">
          <template v-if="blocks">
            <ProposedBlocksTable :blocks="blocks" />
          </template>
        </Tab>
      </Tabs>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { Bech32 } from '@cosmjs/encoding'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import ValidatorInfoCard from '@/components/ValidatorInfoCard.vue'
import OracleReportsTable from '@/components/tables/OracleReportsTable.vue'
import DelegatorsTable from '@/components/tables/DelegatorsTable.vue'
import ProposedBlocksTable from '@/components/tables/ProposedBlocksTable.vue'
import { BlockResponse } from '@cosmjs/tendermint-rpc'
import { blocksWithTotalTxInterface } from '@/helpers/Types'

export default defineComponent({
  components: {
    BackButton,
    CopyButton,
    Tabs,
    Tab,
    ValidatorInfoCard,
    OracleReportsTable,
    DelegatorsTable,
    ProposedBlocksTable,
  },
  setup: function () {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const validator = ref()
    const delegators = ref()
    const blocks = ref()
    const reports = ref()

    const getValidator = async () => {
      const response = await callers.getValidator(String(route.params.address))
      validator.value = { ...response.validator }
    }

    const getDelegators = async () => {
      const response = await callers.getValidatorDelegations(
        String(route.params.address)
      )
      delegators.value = [...response.delegationResponses]
    }

    const getBlocks = async () => {
      const response = await callers.getBlockchain()
      blocks.value = response.blockMetas.filter((item) => {
        const encodedAddress = Bech32.encode(
          'odinvaloper',
          item.header.proposerAddress
        )

        if (encodedAddress === String(route.params.address)) return true
        return false
      })

      let tempA: Array<blocksWithTotalTxInterface> = []
      for (let b of blocks.value) {
        tempA = [
          ...tempA,
          {
            ...b,
            total_tx: await callers
              .getBlock(b?.header?.height as number)
              .then((res: BlockResponse): number => res?.block?.txs?.length),
          },
        ]
      }

      blocks.value = tempA
    }

    const getReports = async () => {
      const response = await callers.getTxSearch({
        query: `tx.height>=0 AND report.validator='${validator.value.operatorAddress}'`,
      })
      // TODO get the necessary reports from transactions
      reports.value = response.txs
    }

    onMounted(async () => {
      await getValidator()
      await getDelegators()
      await getBlocks()
      await getReports()
    })

    return {
      validator,
      delegators,
      blocks,
      reports,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-main {
  &__title {
    margin: 0 1.6rem 0 2rem;
  }

  &__subtitle-wrapper {
    display: flex;
  }
}

@include respond-to(768px) {
  .view-main {
    &__title {
      margin: 0.8rem 0 0.4rem 0;
    }

    &__subtitle-wrapper {
      width: 100%;
    }
  }
}
</style>
