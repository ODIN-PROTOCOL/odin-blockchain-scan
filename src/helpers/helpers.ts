import { toHex } from '@cosmjs/encoding'
import { getDateFromMessage } from '@/helpers/decodeMessage'
import { adjustedData, ChartLabelsType } from '@/helpers/Types'
import { TxResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { cacheAnswers } from '@/helpers/requests'
import { bigMath } from '@/helpers/bigMath'
import { AnyFn, DecoratedFn } from '@/shared-types'
import {
  QueryTopValidatorsRequest,
  QueryTopValidatorsResponse,
} from '@provider/codec/telemetry/query'
import { ValidatorBlockStats } from '@provider/codec/telemetry/telemetry'

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

const _randomColors = (size: number, name: string): Array<string> => {
  if (localStorage.getItem(name)) {
    return JSON.parse(localStorage.getItem(name) as string)
  }
  const colors: Array<string> = []
  let prevColor = 0
  for (let i = 0; i < (size >= 50 ? size : 50); i++) {
    let h = Math.random() * 360
    if (Math.abs(h - prevColor) <= 15) {
      h += 25
    }
    colors.push(`hsl(${h.toFixed()}, 60%, 60%)`)
    prevColor = h
  }
  localStorage.setItem(name, JSON.stringify(colors))
  return colors
}
export const getRandomColors = cacheAnswers(_randomColors)

export const prepareTransaction = async (
  txs: readonly TxResponse[]
): Promise<Array<adjustedData>> => {
  let tempArr: Array<adjustedData> = []
  for (const tx of txs) {
    const { receiver, sender, type, amount, time, fee } =
      await getDateFromMessage(tx)
    tempArr = [
      ...tempArr,
      {
        type: type ? type : '-',
        hash: tx.hash ? toHexFunc(tx.hash) : '-',
        block: tx.height ? tx.height : '-',
        time: time ? time : null,
        sender: sender ? sender : '',
        receiver: receiver ? receiver : '',
        amount: amount ? amount : '',
        fee: fee ? fee : '-',
      },
    ].filter((item) => _allowedTypes.includes(item.type))
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

export const withoutDuplicates = <T>(
  arr: Array<T>
): ReturnType<() => Array<T>> => {
  arr = arr.filter((el) => {
    return el[Object.keys(el)[0]].length !== 0
  })
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

export const requestByDays = async <T extends AnyFn>(
  { startDate, endDate, pagination }: QueryTopValidatorsRequest,
  fn: T,
  days: number
): Promise<Array<ReturnType<T>>> => {
  const tempArr: Array<ReturnType<T>> = []
  for (let i = 0; i <= days * 24; ++i) {
    startDate?.setHours(startDate.getHours() - 1)
    const res = (await fn({
      startDate,
      endDate,
      pagination: pagination ? pagination : null,
    })) as ReturnType<T>
    if (res[Object.keys(res as string)[0]].length)
      tempArr.push(...res[Object.keys(res as string)[0]])
  }
  return tempArr
}
