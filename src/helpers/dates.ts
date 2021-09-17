import * as dateFns from 'date-fns'

export const isYesterday = dateFns.isYesterday
export const isToday = dateFns.isToday
export const isTomorrow = dateFns.isTomorrow
export const isThisMonth = dateFns.isThisMonth
export const isThisYear = dateFns.isThisYear

export const convertToDate = (time: string): string => {
  const someTime = new Date(time)
  const day =
    someTime.getDay() > 9 ? someTime.getDay() : '0' + someTime.getDay()
  const month =
    1 + someTime.getMonth() > 9
      ? 1 + someTime.getMonth()
      : '0' + (1 + someTime.getMonth())
  const year =
    someTime.getFullYear() > 9
      ? someTime.getFullYear()
      : '0' + someTime.getFullYear()

  return `${day}:${month}:${year}`
}

export const convertToDayMonth = (time: string | Date): string => {
  return `${dateFns.format(new Date(time), 'MMM dd')}`
}

export const convertToTime = (time: string): string => {
  const someTime = new Date(time)

  const minutes =
    someTime.getMinutes() > 90
      ? someTime.getMinutes()
      : '0' + someTime.getMinutes()
  const hours =
    someTime.getHours() > 9 ? someTime.getHours() : '0' + someTime.getHours()
  return `${hours}:${minutes}`
}

export const convertToTxTime = (time: string): string => {
  if (!time) return '-'
  return `${dateFns.format(new Date(time), 'H:MM:SS MMM dd Y')}`
}
