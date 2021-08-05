import { Tx } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx'
import { toHex } from '@cosmjs/encoding'
import { callers } from '@/api/callers'
import { MsgSend } from '@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx'
// TODO: need refactor!
let transStatus = ''
let transReceiver = ''
const getTotalTx = async (decodedTx: any) => {
  let totalTx = 0
  const tempDecodedMsgs = decodedTx.body.messages.filter(
    (item: any) => item.typeUrl === '/cosmos.bank.v1beta1.MsgSend'
  )
  tempDecodedMsgs.forEach((m: any) => {
    const msgValue = MsgSend.decode(m.value)
    transReceiver = msgValue.toAddress.toUpperCase()
    transStatus = 'Send'
    if (!msgValue) return
    totalTx += +msgValue.amount[0].amount
  })
  return totalTx
}

export async function makeTransactionListFormatted(
  arr: any
): Promise<Array<any>> {
  const tempArr: Array<any> = []

  for (const el of arr) {
    const decodedTx = Tx.decode(el.tx)
    console.log(el.height)
    tempArr.push({
      transHeight: el.height,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line prettier/prettier
      transSender: toHex(decodedTx.authInfo.signerInfos[0].publicKey.value).toUpperCase(),
      transTime: await callers
        .getBlockchain(+el.height, +el.height)
        .then((res) => {
          return res.blockMetas[0].header.time
        }),
      transFeeList: decodedTx.authInfo?.fee?.amount ?? null,
      transHash: toHex(el.hash || el.value.hash).toUpperCase(),
      transStatus,
      transMessagesList: '',
      transAmount: await getTotalTx(decodedTx),
      transReceiver,
      transitionT: el.height,
    })
  }

  return tempArr
}
