import { toHex } from '@cosmjs/encoding'

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
  return toHex(str).toUpperCase()
}