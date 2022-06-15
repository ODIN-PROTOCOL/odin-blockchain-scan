<template>
  <div class="validator-info">
    <div class="validator-info__top-line">
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Moniker</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span class="validator-info__top-line-item-value">
            {{ validator.description.moniker }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Status</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span class="validator-info__top-line-item-value">
            {{ $tBondStatus(validator.status) }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Jailed?</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span class="validator-info__top-line-item-value">
            {{ validator.jailed ? 'Yes' : 'No' }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Stake</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span class="validator-info__top-line-item-value">
            {{ $convertLokiToOdin(validator.tokens, { withDenom: true }) }}
          </span>
        </div>
      </div>
      <div class="validator-info__top-line-item card-frame">
        <span class="validator-info__top-line-item-title">Rate</span>
        <div class="validator-info__card-balance-row-value-wrapper">
          <span class="validator-info__top-line-item-value">
            {{ $getPrecisePercents(validator.commission.commissionRates.rate) }}
          </span>
        </div>
      </div>
    </div>
    <div class="validator-info__table">
      <div class="validator-info__description card-frame">
        <div class="validator-info__description-title">Information</div>
        <div class="validator-info__description-item">
          <span class="validator-info__description-item-title"
            >Delegator shares</span
          >
          <span class="validator-info__description-item-value">
            {{
              $getPercentOutOfNumber(
                validator.delegatorShares,
                validator.tokens
              )
            }}
          </span>
        </div>
        <div class="validator-info__description-item">
          <span class="validator-info__description-item-title">
            {{ isMobile() ? 'Proposed blocks' : 'Amount of proposed blocks' }}
          </span>
          <span
            :title="proposedBlocksCount"
            class="validator-info__description-item-value"
          >
            {{ proposedBlocksCount }}
          </span>
        </div>
        <div class="validator-info__description-item">
          <span class="validator-info__description-item-title">Max rate</span>
          <span class="validator-info__description-item-value">
            {{
              $getPrecisePercents(validator.commission.commissionRates.maxRate)
            }}
          </span>
        </div>
        <div class="validator-info__description-item">
          <span class="validator-info__description-item-title"
            >Max change rate</span
          >
          <span class="validator-info__description-item-value">
            {{
              $getPrecisePercents(
                validator.commission.commissionRates.maxChangeRate
              )
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from 'vue'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { isMobile } from '@/helpers/helpers'
import { callers } from '@/api/callers'

export default defineComponent({
  components: {},
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
  },
  setup(props) {
    const proposedBlocksCount = ref(0)

    const getProposedBlocks = async () => {
      const response = await callers
        .getProposedBlocks(props.validator.operatorAddress, 0, 1)
        .then((req) => req.json())
      proposedBlocksCount.value = response?.total_count || 0
    }
    onMounted(async () => {
      await getProposedBlocks()
    })
    return {
      isMobile,
      proposedBlocksCount,
    }
  },
})
</script>

<style lang="scss" scoped>
.validator-info {
  display: flex;
  flex-direction: column;
  margin-bottom: 4rem;
  gap: 4rem;
}
.validator-info__table {
  display: flex;
  gap: 2rem;
}
.validator-info__delegetion,
.validator-info__description {
  width: 100%;
}
.validator-info__top-line {
  display: grid;
  gap: 2.4rem;
  grid:
    auto /
    minmax(4rem, 1fr)
    minmax(4rem, 1fr)
    minmax(4rem, 1fr)
    minmax(8rem, 1fr)
    minmax(8rem, 1fr);
}
.validator-info__top-line-item {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
}

.validator-info__row,
.validator-info__delegetion-btn-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.validator-info__top-line-item-title {
  font-size: 1.6rem;
  line-height: 2.4rem;
  margin-bottom: 0.4rem;
}
.validator-info__top-line-item-value {
  font-weight: 600;
  font-size: 2.4rem;
  line-height: 3.2rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.validator-info__delegetion-title,
.validator-info__description-title {
  font-weight: 400;
  font-size: 2.4rem;
  line-height: 3.2rem;
  margin-bottom: 3.2rem;
}
.validator-info__description-item {
  display: flex;
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
}
.validator-info__description-item-title {
  font-size: 1.6rem;
  line-height: 2.4rem;
  min-width: 17rem;
  max-width: 20rem;
  width: 100%;
}
.validator-info__description-item-value {
  font-size: 1.4rem;
  line-height: 2rem;
}

.validator-info__delegetion-balance {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3.2rem;
}
.validator-info__delegetion-balance-row {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.6rem 0;
  min-width: 10rem;
  &:not(:last-child) {
    border-right: 0.1rem solid var(--clr__input-border);
    margin-right: 2rem;
    padding-right: 1.6rem;
  }
}
.validator-info__card-balance-row-value-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  position: relative;
}
.validator-info__card-balance-row-value {
  font-size: 2.4rem;
  line-height: 3.2rem;
  width: 100%;
  font-weight: 600;
  color: var(--clr__text);
}
.validator-info__delegetion-btn {
  min-width: 9.9rem;
  max-width: 10.8rem;
  width: 100%;
}
@media screen and (max-width: 768px) {
  .validator-info {
    gap: 2.4rem;
  }

  .validator-info__top-line {
    grid-template-columns: 1fr 1fr;
    gap: 1.6rem;
  }
  .validator-info__table {
    flex-direction: column;
    gap: 2rem;
  }
  .validator-info__delegetion-btn-wrapper {
    gap: 0.8rem;
  }
  .validator-info__top-line-item-value {
    font-size: 2rem;
    line-height: 2.4rem;
  }
}
@media screen and (max-width: 393px) {
  .validator-info__delegetion-btn-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }
  .validator-info__delegetion-btn {
    max-width: none;
  }
}
</style>
