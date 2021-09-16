import BigNumber from 'bignumber.js'
import { NumLike, toBigNumber, toNum, toStr } from './casts'

export enum ROUNDING {
  DEFAULT = 4,
  UP = 0,
  DOWN = 1,
  CEIL = 2,
  FLOOR = 3,
  HALF_UP = 4,
  HALF_DOWN = 5,
  HALF_EVEN = 6,
  HALF_CEIL = 7,
  HALF_FLOOR = 8,
}

export interface BigCfg {
  decimals?: number
  rounding?: ROUNDING
}

export type BigFormatCfg = BigNumber.Format & BigCfg

BigNumber.config({
  DECIMAL_PLACES: 0,
  ROUNDING_MODE: ROUNDING.DEFAULT,
  FORMAT: {
    // TODO: translate
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
  },
})

function bigMultiply(a: NumLike, b: NumLike, cfg?: BigCfg): BigNumber {
  return _bn(a, cfg).multipliedBy(_bn(b))
}

function bigDivide(a: NumLike, b: NumLike, cfg?: BigCfg): BigNumber {
  return _bn(a, cfg).dividedBy(_bn(b))
}

function bigAdd(a: NumLike, b: NumLike, cfg?: BigCfg): BigNumber {
  return _bn(a, cfg).plus(_bn(b))
}

function bigSubtract(a: NumLike, b: NumLike, cfg?: BigCfg): BigNumber {
  return _bn(a, cfg).minus(_bn(b))
}

function bigRound(a: NumLike, precision: number, mode?: ROUNDING): string {
  return _bn(a).toPrecision(precision, mode)
}

function bigFormat(a: NumLike, format?: BigFormatCfg): string {
  try {
    const {
      decimals = BigNumber.config({}).DECIMAL_PLACES as number,
      rounding = BigNumber.config({}).ROUNDING_MODE as ROUNDING,
      ...fmt
    } = format || {}
    Object.assign(fmt, BigNumber.config({}).FORMAT)
    return _bn(a).toFormat(decimals, rounding, fmt)
  } catch (error) {
    console.error(error)
    return '—'
  }
}

function bigConvectOdinAndGeo(num: NumLike): string {
  return bigFormat(bigDivide(num, _bn(10).exponentiatedBy(6)))
}

export function bigToPrecise(num: NumLike): BigNumber {
  return bigMultiply(num, '1000000000000000000')
}

export function bigFromPrecise(num: NumLike): BigNumber {
  return bigMultiply(num, '0.000000000000000001')
}

function bigToStrStrict(num: NumLike): string {
  return _bn(num).toFormat({
    groupSeparator: '',
    decimalSeparator: '.',
    fractionGroupSeparator: '',
  })
}

const _bn = toBigNumber

export const bigMath = {
  multiply: bigMultiply,
  divide: bigDivide,
  add: bigAdd,
  subtract: bigSubtract,
  round: bigRound,
  format: bigFormat,
  toPrecise: bigToPrecise,
  fromPrecise: bigFromPrecise,
  toNum,
  toStr,
  bigConvectOdinAndGeo,
  toStrStrict: bigToStrStrict,
  zero: _bn(0),
}
