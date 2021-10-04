import { Tx } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx'
import { toHex } from '@cosmjs/encoding'
import { callers } from '@/api/callers'
import { MsgSend } from '@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx'
import { TxResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { ReadonlyDateWithNanoseconds } from '@cosmjs/tendermint-rpc'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'

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
  readonly transSender: string
  readonly transTime: string | Date | ReadonlyDateWithNanoseconds
  readonly transFeeList: Coin[] | undefined
  readonly transHash: Uint8Array | string
  readonly transStatus: string
  readonly transMessagesList: string
  readonly transAmount: number | undefined
  readonly transReceiver: string | undefined
  readonly transitionT: number
}

export async function makeTransactionListFormatted(
  arr: Array<TxResponse>
): Promise<Array<TransactionListFormatted>> {
  const tempArr: Array<TransactionListFormatted> = []

  for (const el of arr) {
    const decodedTx = Tx.decode(el.tx)
    const ttx: { transReceiver: string; totalTx: number } | undefined =
      getTotalTx(decodedTx)
    tempArr.push({
      transHeight: el.height,
      transSender: toHex(
        <Uint8Array>decodedTx?.authInfo?.signerInfos[0]?.publicKey?.value
      ).toUpperCase(),
      transTime: await callers
        .getBlockchain(+el.height, +el.height)
        .then((res) => {
          return res.blockMetas[0].header.time
        }),
      transFeeList: decodedTx.authInfo?.fee?.amount,
      transHash: toHex(el.hash).toUpperCase(),
      transStatus: el.result.code === 0 ? 'Success' : 'Failed',
      transMessagesList: '',
      transAmount: ttx?.totalTx,
      transReceiver: ttx?.transReceiver,
      transitionT: el.height,
    })
  }

  return tempArr
}
