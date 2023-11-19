import { Ref as _Ref } from "vue"
import _lodash from 'lodash'

export {}

declare global {
  interface Ref<T> extends _Ref<T>{}
  /** 默认全局引入loadsh */
  const lodash: typeof _lodash
}