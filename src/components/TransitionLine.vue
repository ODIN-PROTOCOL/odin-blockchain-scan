<template>
  <div class="data-sources__table-row app-table__row">
    <div class="app-table__cell">
      <span class="app-table__header">Transaction hash</span>
      <router-link
        :to="`/transactions/${transHeight}/${transHash}`"
      >
        <TitledLink
            class="app-table__cell-txt"
            :text="'Ox' + transHash"
        />
      </router-link>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Type</span>
      <TitledSpan class="app-table__cell-txt" :text="transStatus" />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Block</span>
      <router-link :to="`/blocks/${transitionT.height}`"> 
        <TitledLink class="app-table__cell-txt" :text="transitionT.height" />
      </router-link>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Date and time</span>
      <TitledSpan class="app-table__cell-txt" :text="convertToTime(transTime)" />&nbsp;
      <TitledSpan class="app-table__cell-txt" :text="convertToDate(transTime)" />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Sender</span>
      <TitledLink class="app-table__cell-txt" :text="transSender ? `0x${transSender}` : ''" />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Receiver</span>
      <TitledLink class="app-table__cell-txt" :text="transReceiver ? `0x${transReceiver}` : ''" />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Amount</span>
      <TitledSpan class="app-table__cell-txt" :text="transAmount ? transAmount : ''" />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Transaction Fee</span>
      <TitledSpan class="app-table__cell-txt" :text="transFeeList[0]?.amount" />&nbsp;
      <TitledSpan class="app-table__cell-txt" :text="transFeeList[0]?.denom.toUpperCase()" />
    </div>
  </div>
</template>
<script>
import { ref, onMounted, defineComponent, toRef, watch } from 'vue'
import TitledSpan from '@/components/TitledSpan.vue'
import TitledLink from '@/components/TitledLink.vue'
import { toHex } from '@cosmjs/encoding'
import { callers } from '@/api/callers'
import { Tx } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx'
import { MsgSend } from '@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx'

export default defineComponent({
  components: { TitledSpan, TitledLink },
  props: {
      transition: {
          type: Object,
          required: true
      }
  },
  setup(props) {
    const toHexFunc = toHex
    const transHeight = ref()
    const transSender = ref()
    const transTime = ref()
    const transFeeList = ref([])
    const transHash = ref()
    const transStatus = ref()
    const transMessagesList = ref()
    const transAmount = ref()
    const transReceiver = ref()

    const transitionT = toRef(props, 'transition')

    transHeight.value = transitionT.value.height

    const getTransitionLineInfo = async () => {
      const client = await callers.getClient()
      const txs = await client.txSearch({
        query: `tx.height = ${transitionT.value.height}`,
      })

      // reset old value
      transSender.value = ''
      transTime.value = ''
      transFeeList.value = []
      transHash.value = ''
      transStatus.value = ''
      transMessagesList.value = ''
      transAmount.value = ''
      transReceiver.value = ''


      const decodedTx = Tx.decode(txs.txs[0].tx)
      

      transAmount.value = await getTotalTx(decodedTx)

      await client.blockchain(+transitionT.value.height, +transitionT.value.height)
        .then((res) => {
          transTime.value = res.blockMetas[0].header.time
        })

      transHash.value = toHex(txs.txs[0].hash).toUpperCase() ? toHex(txs.txs[0].hash).toUpperCase() :  toHexFunc(transitionT.value.hash).toUpperCase()
      transFeeList.value = decodedTx.authInfo.fee.amount
      transSender.value = toHex(decodedTx.authInfo.signerInfos[0].publicKey.value).toUpperCase()
    }

    const getTotalTx = async (decodedTx) => {
      let totalTx = 0
      
      const tempDecodedMsgs = decodedTx.body.messages.filter(item => item.typeUrl === "/cosmos.bank.v1beta1.MsgSend")

      tempDecodedMsgs.forEach(m => {
        const msgValue = MsgSend.decode(m.value)
        transReceiver.value = msgValue.toAddress.toUpperCase()
        transStatus.value = 'Send'

        if(!msgValue) return
        totalTx += +msgValue.amount[0].amount
      })

      return totalTx
    }

    const convertToTime = (time) => {
      if(!time) return ''
      const someTime = new Date(time)

      const minutes =
        someTime.getMinutes() > 9
          ? someTime.getMinutes()
          : '0' + someTime.getMinutes()
      const hours =
        someTime.getHours() > 9
          ? someTime.getHours()
          : '0' + someTime.getHours()

      return `${hours}:${minutes}`
    }

    const convertToDate = (time) => {
      if(!time) return ''
      const someTime = new Date(time)

      const day =
        someTime.getDay() > 9 ? someTime.getDay() : '0' + someTime.getDay()
      const month =
        1 + someTime.getMonth() > 9
          ? 1 + someTime.getMonth()
          : '0' + (1 + someTime.getMonth())
      const year =
        someTime.getFullYear() > 9
          ? someTime.getFullYear()
          : '0' + someTime.getFullYear()

      return `${day}:${month}:${year}`
    }

    onMounted(() => {

      getTransitionLineInfo()
    })

    watch(transitionT, getTransitionLineInfo)

    return {
      toHexFunc,
      transitionT,
      transHeight,
      transHash,
      transStatus,
      transFeeList,
      convertToTime,
      convertToDate,
      transTime,
      transSender,
      transMessagesList,
      transAmount,
      transReceiver
    }
  },
})
</script>

<style scoped lang="scss">
* {
  font-family: 'SF Display';
}

.app-table__cell-txt {
  max-width: 150px;
}

.app-table__header {
  display: none;

  @media screen and (max-width: 992px) {
    display: inline-block;
    width: 200px;
  }
}
</style>
