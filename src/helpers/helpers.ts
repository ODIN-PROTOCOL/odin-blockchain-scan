import { toHex } from '@cosmjs/encoding'
import { getDateFromMessage } from '@/helpers/decodeMessage'
import { DecodedTxData, ChartLabelsType } from '@/helpers/Types'
import { bigMath } from '@/helpers/bigMath'
import { AnyFn, Unpacked } from '@/shared-types'
import { Pagination } from '@/api/query-ext/telemetryExtension'
import { convertLokiToOdin } from '@/helpers/converters'
import { TxTelemetry } from '@/helpers/Types'
import { detect } from 'detect-browser'

export function isIos() {
  const res = detect()
  return res && res.os === 'iOS'
}

export function isAndroid() {
  const res = detect()
  return res && res.os === 'Android OS'
}

export function isMobile() {
  return isAndroid() || isIos()
}

export const sortingDaysForChart = {
  lastDay: {
    text: 'Last day',
    value: '1',
  },
  lastWeek: {
    text: 'Last week',
    value: '7',
  },
  lastTwoWeek: {
    text: 'Last 14 days',
    value: '14',
  },
  lastMoth: {
    text: 'Last month',
    value: '31',
  },
  lastYear: {
    text: 'Last year',
    value: '365',
  },
}

export const _allowedTypes = [
  'Send',
  'Receive',
  'Report',
  'Request',
  'Delegate',
  'Undelegate',
  'Redelegate',
  'Withdraw',
]

export const toHexFunc: (data: Uint8Array) => string = toHex

export const convertDate = (time: string): string => {
  const nowTime: Date = new Date()
  const newTime: Date = new Date(time)

  const diff: string | number = (nowTime.getTime() - newTime.getTime()) / 1000
  let diffMinutes: string
  let diffSeconds: string
  let totalDiff = ''
  if (diff < 900) {
    if (diff / 60 > 0) {
      diffMinutes =
        parseInt(`${diff / 60}`) > 9
          ? parseInt(`${diff / 60}`) + ':'
          : '0' + parseInt(`${diff / 60}`) + ':'
      diffSeconds =
        parseInt(`${diff}`) - Number(diffMinutes) * 60 > 9
          ? String(parseInt(`${diff}`))
          : '0' + parseInt(`${diff}`)
    } else {
      diffMinutes = ''
      diffSeconds =
        parseInt(`${diff}`) > 9
          ? String(parseInt(`${diff}`))
          : '0' + parseInt(`${diff}`)
    }

    totalDiff = `${diffMinutes}${diffSeconds} ago`
  }

  const timezone: string =
    newTime.getTimezoneOffset() / 60 !== 0
      ? `${newTime.getTimezoneOffset() / 60}:00`
      : ''

  const seconds: string =
    newTime.getSeconds() > 9
      ? String(newTime.getSeconds())
      : '0' + newTime.getSeconds()
  const minutes: string =
    newTime.getMinutes() > 9
      ? String(newTime.getMinutes())
      : '0' + newTime.getMinutes()
  const hours: string =
    newTime.getHours() > 9
      ? String(newTime.getHours())
      : '0' + newTime.getHours()
  const day: string =
    newTime.getDay() > 9 ? String(newTime.getDay()) : '0' + newTime.getDay()
  const month: string =
    1 + newTime.getMonth() > 9
      ? `${1 + newTime.getMonth()}`
      : '0' + (1 + newTime.getMonth())
  const year: string | number = newTime.getFullYear()
  const midday: string = Number(hours) > 12 ? 'PM' : 'AM'

  if (totalDiff) {
    return `${totalDiff} (${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${midday} ${timezone} UTC)`
  } else {
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${midday} ${timezone} UTC`
  }
}

export const copyValue = (text: string): void => {
  window.navigator.clipboard.writeText(text)
}

export const getHash = (str: Uint8Array): string => {
  return toHexFunc(str).toUpperCase()
}

export const prepareTransaction = async (
  txs: readonly TxTelemetry[]
): Promise<Array<DecodedTxData>> => {
  let tempArr: Array<DecodedTxData> = []
  for (const tx of txs) {
    const {
      receiver,
      sender,
      type,
      amount,
      time,
      fee,
      memo,
      status,
      gasUsed,
      gasWanted,
    } = await getDateFromMessage(tx)
    tempArr = [
      ...tempArr,
      {
        type: type ? type : '-',
        hash: tx.hash ? tx.hash.toLowerCase() : '-',
        block: tx.height ? tx.height : '-',
        time: time ? time : '-',
        sender: sender ? sender : '',
        receiver: receiver ? receiver : '',
        amount: convertLokiToOdin(amount),
        fee: convertLokiToOdin(fee),
        memo: memo ? memo : '-',
        status: Number(status) > -1 ? 'Success' : 'Failed',
        gasUsed: gasUsed ? gasUsed : '-',
        gasWanted: gasWanted ? gasWanted : '-',
      },
    ]
  }
  return tempArr
}
export const addedRankBy = <T extends ChartLabelsType>(
  arr: Array<T>,
  by: string
): Array<T> => {
  arr
    .sort(function (a, b) {
      return bigMath.toNum(a[by]) - bigMath.toNum(b[by])
    })
    .forEach(function (d, i) {
      d.rank = i + 1
    })
  return arr
}

// TODO: Come back to this later
export const withoutDuplicates = <T>(arr: Array<T>): Array<T> => {
  arr = arr.filter((el) => el[Object.keys(el)[0]].length !== 0)
  arr = arr.filter(
    (el, index, self) =>
      index ===
      self.findIndex((t) => {
        return JSON.stringify(t) === JSON.stringify(el)
      })
  )
  console.debug('withoutDuplicates', arr)
  return arr
}

// TODO: Come back to this later
export const requestByDays = async <T extends AnyFn>(
  {
    startDate,
    endDate,
    pagination,
  }: { startDate: Date; endDate: Date; pagination?: Pagination },
  fn: T,
  days: number
): Promise<Array<Unpacked<ReturnType<T>>>> => {
  const tempArr: Array<Unpacked<ReturnType<T>>> = []
  for (let i = 0; i <= days * 24; ++i) {
    startDate?.setHours(startDate.getHours() - 1)
    const res = (await fn({
      startDate,
      endDate,
      pagination,
    })) as T extends Unpacked<ReturnType<T>> ? T : never
    if (res[Object.keys(res)[0]].length) {
      tempArr.push(...res[Object.keys(res)[0]])
    }
  }
  return tempArr
}

export enum TYPE_TX_SORT {
  all = 'null',
  delegate = 'delegate',
  send = 'send',
  withdraw = 'withdraw',
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
export enum VALIDATOR_STATUS_TYPE {
  inactive = 'inactive',
  success = 'success',
  error = 'error',
}
