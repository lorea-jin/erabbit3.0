/** 插件 */

import XtxSkeleton from './xtx-skeleton.vue'

export default {
  install (app) {
    app.component(XtxSkeleton.name, XtxSkeleton)
  }
}
