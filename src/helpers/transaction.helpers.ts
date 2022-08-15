import { getDateFromMessage } from '@/helpers/decodeMessage copy'
import { DecodedTxData } from '@/helpers/Types'
import { convertLokiToOdin } from '@/helpers/converters'
// import { TxTelemetry } from '@/helpers/Types'

export const prepareTransaction = (txs: any[]): DecodedTxData[] => {
  let tempArr: DecodedTxData[] = []
  for (const tx of txs) {
    const {
      receiver,
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
    } = getDateFromMessage(tx)
    tempArr = [
      ...tempArr,
      {
        type: type ? type : '-',
        hash: tx.hash ? tx.hash.toLowerCase() : '-',
        block: tx.height ? tx.height : '-',
        time: time ? new Date(time).valueOf().toString() : '-',
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
