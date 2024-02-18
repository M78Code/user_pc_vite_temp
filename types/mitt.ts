

declare namespace MITT {
  /** useMittOn 函数的返回体 */
  interface UseMittOnResult {
    /** 用于取消Mitt监听的函数 */
    off(): void;
    /** 用于激发Mitt事件的函数
     * @param {Object} [param] useMittEmit传递的param
     */
    emit(param?): void;
  }

  /** useMittEmitterGeneratorResult 函数的返回体 */
  interface UseMittEmitterGeneratorResult {
    /** 本次函数挂载的所有事件监听 */
    emitters: Object, 
    /** 批量取消挂载的事件监听函数 */
    emitters_off: () => void
  }
  /** 兼容EMIT_REFRESH_DETAILS事件param的参数改动. 服务于原先代码 */
  interface refresh {
    /** 旧事件中携带的参数:是否刷新 */refresh: boolean
  }
  /** EMIT_REFRESH_DETAILS 事件的回调函数签名 */
  type RefreshDetailsCallback = (param: K.mid | K.csid | K.tid | refresh) => void
}

