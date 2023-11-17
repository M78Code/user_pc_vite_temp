

declare namespace MITT {
  export interface UseMittOnResult {
    /** 用于取消Mitt监听的函数 */
    off(): void;
    /** 用于激发Mitt事件的函数
     * @param {Object} param useMittEmit传递的param
     */
    emit(param?): void;
  }
}

