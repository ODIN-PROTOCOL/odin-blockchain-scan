import { BigNumber } from 'bignumber.js'
import { bigMath } from './bigMath'

type ConverterOptions = {
  withDenom?: boolean
  withPrecise?: boolean
}

const FORMAT_OPTIONS = {
  decimals: 2,
  decimalSeparator: '.',
}
const ODIN_MULTIPLIER = 0.000001
const ODIN_DENOM = 'ODIN'
const LOKI_DENOM = 'LOKI'
const GEO_DENOM = 'GEO'
const LOKI_MULTIPLIER = 1000000

export function convertLokiToOdin(
  amount: string | undefined,
  options?: ConverterOptions,
  denom = ODIN_DENOM
): string {
  if (!amount) return '-'
  if (denom.toUpperCase() === LOKI_DENOM || denom === ODIN_DENOM) {
    denom = ODIN_DENOM
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
