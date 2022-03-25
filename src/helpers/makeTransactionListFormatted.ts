import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { toHex } from '@cosmjs/encoding'
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx'
import { TxResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'
import { getDateFromMessage } from '@/helpers/decodeMessage'

const getTotalTx = (
  decodedTx: Tx
): { transReceiver: string; totalTx: number } | undefined => {
  let totalTx = 0
  let transReceiver = ''
  const tempDecodedMsgs = decodedTx?.body?.messages.filter(
    (item) => item.typeUrl === '/cosmos.bank.v1beta1.MsgSend'
  )
  if (!tempDecodedMsgs) return
  tempDecodedMsgs.forEach((m): void => {
    const msgValue: MsgSend = MsgSend.decode(m.value)
    transReceiver = msgValue.toAddress.toUpperCase()
    if (!msgValue) return
    totalTx += +msgValue.amount[0].amount
  })

  return { totalTx, transReceiver }
}

export interface TransactionListFormatted {
  readonly transHeight: number
  readonly transSender: string | undefined
  readonly transTime: string | Date | null | undefined
  readonly transFeeList: Coin[] | undefined
  readonly transHash: Uint8Array | string
  readonly transStatus: string
  readonly transMessagesList: string
  readonly transAmount: string | undefined
  readonly transReceiver: string | undefined
  readonly transitionT: number
}

export async function makeTransactionListFormatted(
  arr: Array<TxResponse>
): Promise<Array<TransactionListFormatted>> {
  const tempArr: Array<TransactionListFormatted> = []

  for (const el of arr) {
    const decodedTx = Tx.decode(el.tx)
    const { receiver, sender, amount, time } = await getDateFromMessage(el)
    tempArr.push({
      transHeight: el.height,
      transSender: sender,
      transTime: time,
      transFeeList: decodedTx.authInfo?.fee?.amount,
      transHash: toHex(el.hash).toUpperCase(),
      transStatus: el.result.code === 0 ? 'Success' : 'Failed',
      transMessagesList: '',
      transAmount: amount,
      transReceiver: receiver,
      transitionT: el.height,
    })
  }

  return tempArr
}
