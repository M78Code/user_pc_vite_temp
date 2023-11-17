import * as MITT_TYPES_PROJECT from "base_path/core/mitt/mitt-keys.js";
import * as MITT_TYPES_DEFAULT from "src/core/mitt/mitt-keys";

declare module 'src/core/mitt/index.js' {
  export type MittType = (typeof MITT_TYPES_DEFAULT & typeof MITT_TYPES_PROJECT);
  /** 激发MittEmit事件 */
  function useMittEmit(type: keyof MittType): void;

  interface EmitRefreshDetailsParamType { 
    /** 赛事ID */
    mid: string, 
    csid: string,
    /** 联赛ID */ 
    tid: string 
  }
  /** 激发RefreshDetails时, 携带params */
  function useMittEmit(type: typeof MITT_TYPES_PROJECT.EMIT_REFRESH_DETAILS, param: { mid: string, csid: string, tid: string }): void;
  function useMittOn(type: typeof MITT_TYPES_PROJECT.EMIT_REFRESH_DETAILS, callback: (param: EmitRefreshDetailsParamType) => void): MITT.UseMittOnResult;

}
