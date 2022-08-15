import { getDateFromMessage } from '@/helpers/decodeMessage copy'
import { DecodedTxData } from '@/helpers/Types'
import { convertLokiToOdin } from '@/helpers/converters'
// import { TxTelemetry } from '@/helpers/Types'

export const prepareAccountTransaction = (txs: any[]): DecodedTxData[] => {
  let tempArr: DecodedTxData[] = []
  for (const tx of txs) {
    const {
      receiver,
      block,
      sender,
      type,
      amount,
      denom,
      time,
      fee,
      feeDenom,
      memo,
      status,
      gasUsed,
      gasWanted,
    } = getDateFromMessage(tx.transaction)
    tempArr = [
      ...tempArr,
      {
        type: type ? type : '-',
        hash: tx.transaction.hash ? tx.transaction.hash.toLowerCase() : '-',
        block: block ? block : '-',
        time: time ? new Date(time).valueOf() : '-',
        sender: sender ? sender : '',
        receiver: receiver ? receiver : '',
        amount: convertLokiToOdin(amount, {}, denom),
        fee: convertLokiToOdin(fee, {}, feeDenom),
        memo: memo ? memo : '-',
        status: Number(status) > -1 ? 'Success' : 'Failed',
        gasUsed: gasUsed ? gasUsed : '-',
        gasWanted: gasWanted ? gasWanted : '-',
      },
    ]
  }
  return tempArr
}

export enum TYPE_TX_SORT {
  all = 'null',
  delegate = 'delegate',
  send = 'send',
  withdraw = 'withdraw',
}

export const decodeTypeTxSort = (value: string) => {
  if (value !== TYPE_TX_SORT.all) {
    if (value === TYPE_TX_SORT.delegate) {
      return { _similar: 'cosmos.staking.v1beta1.MsgDelegate' }
    } else if (value === TYPE_TX_SORT.send) {
      return { _similar: 'cosmos.bank.v1beta1.MsgSend' }
    } else {
      return {
        _similar: 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      }
    }
  } else {
    return {}
  }
}

export const sortingTypeTx = [
  {
    text: 'All',
    value: TYPE_TX_SORT.all,
  },
  {
    text: 'Delegated',
    value: TYPE_TX_SORT.delegate,
  },
  {
    text: 'Send',
    value: TYPE_TX_SORT.send,
  },
  {
    text: 'Withdraw',
    value: TYPE_TX_SORT.withdraw,
  },
]
