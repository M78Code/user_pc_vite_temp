

declare namespace MITT {
  interface UseMittOnResult {
    /** 用于取消Mitt监听的函数 */
    off(): void;
    /** 用于激发Mitt事件的函数
     * @param {Object} [param] useMittEmit传递的param
     */
    emit(param?): void;
  }
    /** 兼容EMIT_REFRESH_DETAILS事件param的参数改动. 服务于原先代码 */
  interface Refresh {
    refresh: boolean
  }
  /** EMIT_REFRESH_DETAILS 事件的回调函数签名 */
  type RefreshDetailsCallback = (param: MATCH.mid | MATCH.csid | MATCH.tid | Refresh) => void
}

