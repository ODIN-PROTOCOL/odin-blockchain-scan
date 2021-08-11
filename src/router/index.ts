export * from './router'
export { default } from './router'

import { Router } from 'vue-router'
import { UnwrapRef } from 'vue'

export const routerBack = (router: UnwrapRef<Router>): void => {
  router.back()
}
