import { OdinApiBroadcastError } from '@/api/api'
import { notifyError } from './notifications'

type ErrorLike = Pick<Error, 'message'>

export function handleError(error: Error | ErrorLike | unknown): void {
  if (error instanceof OdinApiBroadcastError) {
    _handleBroadcastError(error)
  } else {
    console.error(error)
    if (isErrorLike(error)) {
      notifyError(error.message)
    }
  }
}

export function isErrorLike(value: unknown): value is ErrorLike {
  if (!value || typeof value !== 'object') return false
  return 'message' in value
}

function _handleBroadcastError(error: OdinApiBroadcastError): void {
  console.error(error)
  notifyError(error.message)
}
