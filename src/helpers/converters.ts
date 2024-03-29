import { BigNumber } from 'bignumber.js'
import { bigMath } from './bigMath'

type ConverterOptions = {
  withDenom?: boolean
  withPrecise?: boolean
  onlyNumber?: boolean
}

const FORMAT_OPTIONS = {
  decimals: 2,
  decimalSeparator: '.',
}
const ODIN_MULTIPLIER = 0.000001
const ODIN_DENOM = 'ODIN'
const LOKI_DENOM = 'LOKI'
const GEO_DENOM = 'GEO'
const MO9W_DENOM = 'MO9W'
const O9W_DENOM = 'O9W'
const LOKI_MULTIPLIER = 1000000

export function convertLokiToOdin(
  amount: string | BigNumber | undefined,
  options?: ConverterOptions,
  denom = ODIN_DENOM,
): string | BigNumber {
  if (!amount) return '-'
  if (Number.isNaN(Number(amount))) return '0'
  if (denom.toUpperCase() === LOKI_DENOM || denom === ODIN_DENOM) {
    denom = ODIN_DENOM
  } else if (denom.toUpperCase() === MO9W_DENOM) {
    denom = O9W_DENOM
  } else {
    denom = GEO_DENOM
  }
  let res: BigNumber
  if (options && options.withPrecise) {
    res = bigMath.fromPrecise(bigMath.multiply(amount, ODIN_MULTIPLIER))
  } else {
    res = bigMath.multiply(amount, ODIN_MULTIPLIER)
  }

  if (options && options.withDenom) {
    return bigMath.format(res, FORMAT_OPTIONS) + ' ' + denom
  } else if (options && options.onlyNumber) {
    return res
  } else {
    return res + ' ' + denom
  }
}

export function convertOdinToLoki(amount: string): number {
  const num = Number(amount)
  if (isNaN(num)) throw ReferenceError('Invalid number')

  return bigMath.multiply(num, LOKI_MULTIPLIER).toNumber()
}

export function getLokiFromString(value: string | undefined): string {
  if (!value) {
    return ''
  }
  return value.split('loki')[0]
}
