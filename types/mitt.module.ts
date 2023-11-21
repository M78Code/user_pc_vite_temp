import * as MITT_TYPES_PROJECT from "base_path/core/mitt/mitt-keys.js";
import * as MITT_TYPES_DEFAULT from "src/core/mitt/mitt-keys";

declare module 'src/core/mitt/index.js' {
  type MittType = (typeof MITT_TYPES_DEFAULT & typeof MITT_TYPES_PROJECT);
  /** 激发MittEmit事件 */
  function useMittEmit(type: keyof MittType): void;
 
  // param与回调函数签名不使用统一Type是为了js调用时可以很轻松的通过IDE提示看到类型签名
  /** 激发RefreshDetails时, 携带params */
  function useMittEmit(type: typeof MITT_TYPES_PROJECT.EMIT_REFRESH_DETAILS, param: K.mid | K.csid | K.tid | MITT.Refresh): void;
  /** 订阅EMIT_REFRESH_DETAILS 详情刷新事件 */
  function useMittOn(type: typeof MITT_TYPES_PROJECT.EMIT_REFRESH_DETAILS, 
    callback: (param: K.mid | K.csid | K.tid | MITT.Refresh) => void): MITT.UseMittOnResult;
}
