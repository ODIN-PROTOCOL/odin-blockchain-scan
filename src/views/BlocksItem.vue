<template>
  <div class="app__main-view blocks-item">
    <div class="app__main-view-title-wrapper">
      <BackButton text="Blocks" />
      <h2 class="app__main-view-title blocks-item__title">Block</h2>
      <span v-if="blockInfo" class="app__main-view-subtitle">
        {{ blockHeight }}
      </span>
    </div>
    <template v-if="!isLoading">
      <template v-if="isLoadingError">
        <div class="app-table__empty-stub">
          <ui-loading-error-message message="Not Found" title="404" />
        </div>
      </template>
      <template v-else>
        <template v-if="blockInfo">
          <div class="blocks-item__table">
            <div class="blocks-item__table-row">
              <div class="blocks-item__table-row-info">
                <img src="~@/assets/icons/info.svg" alt="info" />
                <span class="blocks-item__table-row-tooltip">
                  {{ BLOCK_TOOLTIP_INFO.blockHeight }}
                </span>
              </div>
              <span class="blocks-item__table-row-title">Block height</span>
              <span class="blocks-item__table-row-value">{{
                blockHeight
              }}</span>
              <CopyButton class="mg-l8" :text="String(blockHeight)" />
            </div>
            <div class="blocks-item__table-row">
              <div class="blocks-item__table-row-info">
                <img src="~@/assets/icons/info.svg" alt="info" />
                <span class="blocks-item__table-row-tooltip">
                  {{ BLOCK_TOOLTIP_INFO.blockHash }}
                </span>
              </div>
              <span class="blocks-item__table-row-title">Block hash</span>
              <span class="blocks-item__table-row-value">{{ blockHash }}</span>
              <CopyButton class="mg-l8" :text="String(blockHash)" />
            </div>
            <div class="blocks-item__table-row">
              <div class="blocks-item__table-row-info">
                <img src="~@/assets/icons/info.svg" alt="info" />
                <span class="blocks-item__table-row-tooltip">
                  {{ BLOCK_TOOLTIP_INFO.blockParentHash }}
                </span>
              </div>
              <span class="blocks-item__table-row-title"
                >Block parent hash</span
              >
              <span class="blocks-item__table-row-value">
                {{ blockParentHash }}
              </span>
              <CopyButton class="mg-l8" :text="String(blockParentHash)" />
            </div>
            <div class="blocks-item__table-row">
              <div class="blocks-item__table-row-info">
                <img src="~@/assets/icons/info.svg" alt="info" />
                <span class="blocks-item__table-row-tooltip">
                  {{ BLOCK_TOOLTIP_INFO.timestamp }}
                </span>
              </div>
              <span class="blocks-item__table-row-title">Timestamp</span>
              <span class="blocks-item__table-row-value">{{
                blockTimestamp
              }}</span>
            </div>
            <div class="blocks-item__table-row">
              <div class="blocks-item__table-row-info">
                <img src="~@/assets/icons/info.svg" alt="info" />
                <span class="blocks-item__table-row-tooltip">
                  {{ BLOCK_TOOLTIP_INFO.blocksTransactions }}
                </span>
              </div>
              <span class="blocks-item__table-row-title"
                >Block`s transactions</span
              >
              <div class="blocks-item__table-row-values">
                <template v-if="blocksTransactions?.length">
                  <TitledLink
                    v-for="item in blocksTransactions"
                    :key="item.hash"
                    :name="{
                      name: $routes.transactionDetails,
                      params: { hash: item.hash },
                    }"
                    class="blocks-item__table-row-value blocks-item__table-row-link"
                    :text="'0x' + item.hash"
                  />
                </template>
                <template v-else>
                  <span>-</span>
                </template>
              </div>
            </div>
            <div class="blocks-item__table-row">
              <div class="blocks-item__table-row-info">
                <img src="~@/assets/icons/info.svg" alt="info" />
                <span class="blocks-item__table-row-tooltip">
                  {{ BLOCK_TOOLTIP_INFO.blockCreator }}
                </span>
              </div>
              <span class="blocks-item__table-row-title">Block creator</span>
              <TitledLink
                :name="{
                  name: $routes.validatorDetails,
                  params: { address: blockCreator },
                }"
                :text="blockCreator"
                class="blocks-item__table-row-value blocks-item__table-row-link"
              />
              <CopyButton class="mg-l8" :text="String(blockCreator)" />
            </div>
            <div class="blocks-item__table-row">
              <div class="blocks-item__table-row-info">
                <img src="~@/assets/icons/info.svg" alt="info" />
                <span class="blocks-item__table-row-tooltip">
                  {{ BLOCK_TOOLTIP_INFO.blockSize }}
                </span>
              </div>
              <span class="blocks-item__table-row-title">Block size</span>
              <span class="blocks-item__table-row-value"
                >{{ blockSize || 0 }} bytes</span
              >
            </div>
          </div>
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
import { onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { toHex } from '@cosmjs/encoding'
import { formatDate } from '@/helpers/formatters'
import { prepareTransaction } from '@/helpers/helpers'
import { BLOCK_TOOLTIP_INFO } from '@/const'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import {
  UiLoadingErrorMessage,
  UiLoader,
  UiNoDataMessage,
} from '@/components/ui'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import TitledLink from '@/components/TitledLink.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const isLoadingError = ref(false)
const blockInfo = ref()
const blockHeight = ref(route.params.id)
const blockHash = ref('-')
const blockParentHash = ref('-')
const blockTimestamp = ref()
const blocksTransactions = ref()
const blockCreator = ref('-')
const blockSize = ref()
const getBlock = async () => {
  lockLoading()
  try {
    blockInfo.value = await callers.getBlock(Number(route.params.id))
    blockHash.value = '0x' + toHex(blockInfo.value.blockId.hash)
    blockParentHash.value =
      '0x' + toHex(blockInfo.value.block.header.lastBlockId.hash)
    blockTimestamp.value = formatDate(blockInfo.value.block.header.time)
    const res = await callers.getBlockSize(Number(route.params.id))
    blockSize.value = res?.data?.block?.BlockSize
    const validatorData = await callers.getValidatorByConsensusKey(
      toHex(blockInfo.value.block.header.proposerAddress),
    )

    blockCreator.value = validatorData.data.result.result.operator_address
    const { data } = await callers
      .getTxSearchFromTelemetry(0, 30, 'desc', Number(route.params.id))
      .then(resp => resp.json())
    blocksTransactions.value = await prepareTransaction(data)
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

onMounted(async () => {
  await getBlock()
})
</script>

<style lang="scss" scoped>
.blocks-item__title {
  margin: 0 1.6rem 0 2rem;
}

.blocks-item__table-row {
  display: flex;
  align-items: flex-start;
  padding: 1.6rem 0;
  border-bottom: 0.1rem solid var(--clr__input-border);
}

.blocks-item__table-row-info {
  display: flex;
  align-items: center;
  height: 2.3rem;
  position: relative;
  cursor: pointer;
  margin-right: 0.9rem;

  &:hover {
    .blocks-item__table-row-tooltip {
      display: block;
    }
  }
}

.blocks-item__table-row-tooltip {
  display: none;
  position: absolute;
  bottom: 130%;
  left: -50%;
  min-width: 30rem;
  padding: 1.2rem 2.4rem;
  background: var(--clr__tooltip-bg);
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.6rem;
  color: var(--clr__tooltip-text);

  &:before {
    content: '';
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    bottom: -0.3rem;
    left: 1.6rem;
    transform: translateX(-50%) rotate(45deg);
    background: var(--clr__tooltip-bg);
  }
}

.blocks-item__table-row-title {
  min-width: 14.5rem;
  line-height: 2.3rem;
  margin-right: 2.4rem;
}

.blocks-item__table-row-value {
  font-size: 1.4rem;
  @include ellipsis();
}

.blocks-item__table-row-values {
  display: flex;
  flex-direction: column;
  @include ellipsis();

  & > *:not(:last-child) {
    margin-bottom: 0.8rem;
  }
}

.blocks-item__table-row-link {
  text-decoration: none;
  color: var(--clr__action);
}

@include respond-to(tablet) {
  .blocks-item__title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .blocks-item__table-row-info {
    display: none;
  }
}
</style>
