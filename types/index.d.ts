import '@vue/runtime-core'
import { Ref as _Ref } from "vue"
import _lodash from 'lodash'
import { WsCmdEnum } from "src/core/data-warehouse/ws/ws-ctr/ws-cmd-type"
import { RouteLocationRaw } from 'vue-router'
import { i18n_t as _i18n_t } from "src/boot/i18n.js";
import _filters from 'src/core/filters/global_filters.js'

export {}

declare global {
  interface Ref<T> extends _Ref<T>{}
  /** 默认全局引入loadsh */
  const lodash: typeof _lodash
  const i18n_t: typeof _i18n_t
  const $filters: typeof import('src/core/filters/global_filters.js')['default']
  declare namespace WS {

    /** ws数据包 */ export interface DataWrap<T> {
      /** 数据包体 */ cd: T,
      /** 指令类别 */ cmd: WsCmdEnum | WsCmdValueEnum,
      /** 时间戳? */ ctsp: string,
      /** ? */ ld: string,
    }
    /** ws cmd value 枚举 */ export type WsCmdValueEnum = `${WsCmdEnum}`
  }
}

/** 命名路由跳转提供类型提示 */
type NameRouterType = RouteLocationRaw | {
  /** 欧洲H5详情页 */
  name: 'category',
  params:K.mid|K.tid|K.csid|{csid?,mcid?:string},
}|{
  /** 欧洲H5赛果详情页 */
  name: 'result',
  params:K.mid|K.tid|K.csid|{csid?,mcid?:string}
}

declare module 'vue-router' {
  declare interface Router {
    push(to:RouteLocationRaw | NameRouterType );
    replace(to:RouteLocationRaw | NameRouterType );
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    lodash: typeof _lodash
    i18n_t: typeof _i18n_t
    $filters: typeof import('src/core/filters/global_filters.js')['default']
  }
}