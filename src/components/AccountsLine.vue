<template>
  <div class="data-sources__table-row app-table__row">
    <div class="app-table__cell">
      <span class="app-table__header">Rank</span>
      <span>{{ rank }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Address</span>
      <router-link :to="`/top_accounts/${accountInfo.address}`">
        <TitledLink class="app-table__cell-txt" :text="`0x${accountInfo.address}`" />
      </router-link>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">GEO balance</span>
      <span>{{ accountGeoBalance }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">GEO token percentage</span>
      <span v-if="accountOdinPercentage">{{ accountOdinPercentage }}%</span>
      <span></span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">ODIN balance</span>
      <span>{{ accountOdinBalance }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">ODIN token percentage</span>
      <div>
        <span v-if="accountGeoPercentage">{{ accountGeoPercentage }}%</span>
        <span></span>
      </div>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Transaction count</span>
      <div>
        <span>{{ accountInfo.transactionCount }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, defineComponent, toRef, watch } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import { toHex } from '@cosmjs/encoding'
import { MsgSend } from '@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx'

export default defineComponent({
  components: { TitledLink },
  props: {
    account: {
      type: Object,
      required: true,
    },
    odin: {
      type: Number,
      required: false,
    },
    geo: {
      type: Number,
      required: false,
    },
    rank: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    const toHexFunc = toHex
    const accountRank = ref()
    const accountHash = ref()
    const accountGeoBalance = ref()
    const accountGeoPercentage = ref()
    const accountOdinBalance = ref()
    const accountOdinPercentage = ref()
    const accountTransactionCount = ref()

    const accountInfo = toRef(props, 'account')


    const getAccountLineInfo = () => {
      // reset old value
      accountRank.value = ''
      accountHash.value = []
      accountGeoBalance.value = ''
      accountGeoPercentage.value = ''
      accountOdinBalance.value = ''
      accountOdinPercentage.value = ''
      accountTransactionCount.value = ''

      accountOdinPercentage.value = Number.parseFloat((+props.account.odinBalance / props.odin).toFixed(8))
      accountOdinBalance.value = +props.account.odinBalance
          
      accountGeoPercentage.value = Number.parseFloat(( +props.account.geoBalance / props.geo).toFixed(8))
      accountGeoBalance.value = +props.account.geoBalance
    }

    onMounted(() => {
      getAccountLineInfo()
    })

    watch(accountInfo, getAccountLineInfo)

    return {
      toHexFunc,
      accountRank,
      accountHash,
      accountGeoBalance,
      accountGeoPercentage,
      accountOdinBalance,
      accountOdinPercentage,
      accountTransactionCount,
      accountInfo,
    }
  },
})
</script>

<style scoped lang="scss">
* {
  font-family: 'SF Display';
}

.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    50px repeat(6, minmax(4rem, 1fr));

  @media screen and (max-width: 992px) {
    grid: repeat(7, minmax(4rem, 1fr)) / auto;
  }
}

.app-table__cell-txt {
  max-width: 150px;
  padding-right: 10px;
}

.app-table__header {
  display: none;

  @media screen and (max-width: 992px) {
    display: inline-block;
    width: 200px;
  }

  @media screen and (max-width: 600px) {
    width: 170px;
  }
}
</style>
