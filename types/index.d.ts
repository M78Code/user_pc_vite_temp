import { Ref as _Ref } from "vue"
import _lodash from 'lodash'
import { WsCmdEnum } from "src/core/data-warehouse/ws/ws-ctr/ws-cmd-type"
import { RouteLocationRaw } from 'vue-router'

export {}

declare global {
  interface Ref<T> extends _Ref<T>{}
  /** 默认全局引入loadsh */
  const lodash: typeof _lodash
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
  params:K.mid|K.tid|K.csid|{csid?,mcid?:string}
}

declare module 'vue-router' {
  declare interface Router {
    push(to:RouteLocationRaw | NameRouterType );
  }
}