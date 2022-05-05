import { App, createApp } from 'vue'
import router from './router'
import {
  cropAddress,
  formatCoin,
  formatDate,
  getPrecisePercents,
  getPercentOutOfNumber,
} from './helpers/formatters'
import Notifications from '@kyvg/vue3-notification'
import { api } from './api/api'
import { bigMath } from './helpers/bigMath'
import { translateBondStatus } from './helpers/translators'
import { convertLokiToOdin } from './helpers/converters'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'

async function _main() {
  try {
    await api.init()
  } catch (error) {
    const appModule = await import(
      /* webpackChunkName: "maintenance-screen" */ '@/components/MaintenanceScreen/MaintenanceScreen.vue'
    )
    const app = createApp(appModule.default)
    app.mount('#app')
    console.error(error)
    return app
  }
  const appModule = await import(
    /* webpackChunkName: "app-entry" */ './App.vue'
  )
  const app = createApp(appModule.default)
  app.config.globalProperties.$cropAddress = cropAddress
  app.config.globalProperties.$fCoin = formatCoin
  app.config.globalProperties.$getPrecisePercents = getPrecisePercents
  app.config.globalProperties.$getPercentOutOfNumber = getPercentOutOfNumber
  app.config.globalProperties.$fNum = bigMath.format
  app.config.globalProperties.$fDate = formatDate
  app.config.globalProperties.$tBondStatus = translateBondStatus
  app.config.globalProperties.$convertLokiToOdin = convertLokiToOdin
  app.use(router)
  app.use(Notifications)
  app.component('VuePicker', VuePicker)
  app.component('VuePickerOption', VuePickerOption)
  app.mount('#app')
  return app
}

let app: App<Element>
_main().then((_app) => {
  if (_app) app = _app
})

export { app }
