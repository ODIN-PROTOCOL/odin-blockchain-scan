import emitter from './emmiter'
export const TYPE_NOTIFICATION = {
  info: 'Info',
  failed: 'Failed',
  success: 'Success',
}
export function handleNotificationInfo(
  error: Error | string,
  typeNotification: string,
): void {
  emitter.emit('handleNotification', { error, typeNotification })
  if (typeNotification !== TYPE_NOTIFICATION.success) console.error(error)
}
