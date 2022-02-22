<template>
  <div class="data-sources__table-row app-table__row">
    <div class="app-table__cell">
      <span class="app-table__header">Transaction hash</span>
      <TitledLink
        :to="`/transactions/${transHeight}/${transHash}`"
        class="app-table__cell-txt"
        :text="'Ox' + transHash"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Type</span>
      <span class="app-table__cell-txt">{{ transType }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Block</span>
      <TitledLink
        :to="`/blocks/${transitionT.height}`"
        class="app-table__cell-txt"
        :text="transitionT.height"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Date and time</span>
      <span class="app-table__cell-txt"
        >{{ convertToTime(transTime) }}&nbsp;</span
      >
      <span class="app-table__cell-txt">{{ convertToDate(transTime) }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Sender</span>
      <TitledLink
        class="app-table__cell-txt"
        :text="transSender ? `0x${transSender}` : ''"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Receiver</span>
      <TitledLink
        class="app-table__cell-txt"
        :text="transReceiver ? `0x${transReceiver}` : ''"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Amount</span>
      <span class="app-table__cell-txt">{{
        transAmount ? transAmount : ''
      }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Transaction Fee</span>
      <span class="app-table__cell-txt"
        >{{ transFeeList[0]?.amount }}&nbsp;</span
      >
      <span class="app-table__cell-txt">{{
        transFeeList[0]?.denom.toUpperCase()
      }}</span>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, defineComponent, toRef, watch } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import { toHexFunc } from '@/helpers/helpers'
import { callers } from '@/api/callers'
import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx'

export default defineComponent({
  name: 'TransactionLine',
  components: { TitledLink },
  props: {
    transition: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const transHeight = ref()
    const transSender = ref()
    const transTime = ref()
    const transFeeList = ref([])
    const transHash = ref()
    const transType = ref()
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
      transType.value = ''
      transMessagesList.value = ''
      transAmount.value = ''
      transReceiver.value = ''

      const decodedTx = Tx.decode(txs.txs[0].tx)

      transAmount.value = await getTotalTx(decodedTx)

      await client
        .blockchain(+transitionT.value.height, +transitionT.value.height)
        .then((res) => {
          transTime.value = res.blockMetas[0].header.time
        })

      transHash.value = toHexFunc(
        txs.txs[0].hash || transitionT.value.hash
      ).toUpperCase()
      transFeeList.value = decodedTx.authInfo.fee.amount
      transSender.value = toHexFunc(
        decodedTx.authInfo.signerInfos[0].publicKey.value
      ).toUpperCase()
    }

    const getTotalTx = async (decodedTx) => {
      let totalTx = 0

      const tempDecodedMsgs = decodedTx.body.messages.filter(
        (item) => item.typeUrl === '/cosmos.bank.v1beta1.MsgSend'
      )

      tempDecodedMsgs.forEach((m) => {
        const msgValue = MsgSend.decode(m.value)
        transReceiver.value = msgValue.toAddress.toUpperCase()
        transType.value = 'Send'

        if (!msgValue) return
        totalTx += +msgValue.amount[0].amount
      })

      return totalTx
    }

    const convertToTime = (time) => {
      if (!time) return ''
      const someTime = new Date(time)

      const minutes = String(someTime.getMinutes()).padStart(2, '0')
      const hours = String(someTime.getHours()).padStart(2, '0')

      return `${hours}:${minutes}`
    }

    const convertToDate = (time) => {
      if (!time) return ''
      const someTime = new Date(time)

      const day = String(someTime.getDay()).padStart(2, '0')
      const month = String(someTime.getMonth() + 1).padStart(2, '0')
      const year = String(someTime.getFullYear()).padStart(2, '0')
      return `${day}/${month}/${year}`
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
      transType,
      transFeeList,
      convertToTime,
      convertToDate,
      transTime,
      transSender,
      transMessagesList,
      transAmount,
      transReceiver,
    }
  },
})
</script>

<style scoped lang="scss">
.app-table__cell-txt {
  max-width: 150px;
  padding-right: 10px;
}

.app-table__header {
  display: none;

  @media screen and (max-width: 768px) {
    display: inline-block;
    width: 20rem;
  }
}
</style>
