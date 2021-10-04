<template>
  <div class="data-sources__table-row app-table__row">
    <div class="app-table__cell">
      <span class="app-table__header">Transaction hash</span>
      <TitledLink
        class="app-table__cell-txt"
        :text="transHash ? 'Ox' + transHash : ''"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Type</span>
      <span class="app-table__cell-txt">{{ transType }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Gas Limit</span>
      <span class="app-table__cell-txt">{{
        transGasLimit ? transGasLimit : ''
      }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__header">Gas Price</span>
      <span class="app-table__cell-txt">{{
        transGasPrice ? transGasPrice : ''
      }}</span>
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
import { toHex } from '@cosmjs/encoding'
import { MsgSend } from '@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx'

export default defineComponent({
  name: 'PendingTransactionLine',
  components: { TitledLink },
  props: {
    transition: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const toHexFunc = toHex
    const transSender = ref()
    const transFeeList = ref([])
    const transHash = ref()
    const transType = ref()
    const transAmount = ref()
    const transReceiver = ref()
    const transGasLimit = ref()
    const transGasPrice = ref()

    const transitionT = toRef(props, 'transition')

    const getTransitionLineInfo = async () => {
      // reset old value
      transSender.value = ''
      transFeeList.value = []
      transHash.value = ''
      transType.value = ''
      transAmount.value = ''
      transReceiver.value = ''

      transGasLimit.value = props.transition.authInfo.fee.gasLimit.low
      transFeeList.value = props.transition.authInfo.fee.amount
      transSender.value = toHex(
        props.transition.authInfo.signerInfos[0].publicKey.value
      ).toUpperCase()

      transAmount.value = await getTotalTx(props.transition)
    }

    const getTotalTx = async (transition) => {
      let totalTx = 0

      const tempDecodedMsgs = await transition.body.messages.filter(
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

    onMounted(() => {
      getTransitionLineInfo()
    })

    watch(transitionT, getTransitionLineInfo)

    return {
      toHexFunc,
      transitionT,
      transHash,
      transType,
      transFeeList,
      transSender,
      transAmount,
      transReceiver,
      transGasLimit,
      transGasPrice,
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

  @media screen and (max-width: 76.8rem) {
    display: inline-block;
    width: 20rem;
  }
}
</style>
