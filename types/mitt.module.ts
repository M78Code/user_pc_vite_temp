import * as MITT_TYPES_PROJECT from "base_path/core/mitt/mitt-keys.js";
import * as MITT_TYPES_DEFAULT from "base_path/core/mitt/mitt-keys";

declare module 'src/core/mitt/index.js' {
  type MittType = (typeof MITT_TYPES_DEFAULT & typeof MITT_TYPES_PROJECT);
  type OtherMittType = Exclude<keyof MittType, keyof DefineMittType>
  /** 具名定义事件与param */
  type DefineMittType = {
    /** 详情刷新: param type */
    EMIT_REFRESH_DETAILS: K.mid | K.csid | K.tid | MITT.refresh | { csid?, refresh?}
    /** toast 提示框, 携带提示信息 */
    EMIT_SHOW_TOAST_CMD: string | { 
      /** 提示信息 */ msg: string, 
      /** 持续时间 */ delay: number 
    }
  }
  /** 激发MittEmit事件 */
  function useMittEmit(type: keyof MittType): void;

  function useMittEmit<T extends keyof DefineMittType>(
    type: T, param: DefineMittType[T]): void;
  function useMittOn<P extends DefineMittType, T extends keyof DefineMittType>(
    type: T, callback: (param: P[T]) => void): MITT.UseMittOnResult;
  function useMitt<T extends keyof DefineMittType>(
    type: T, callback: (param: DefineMittType[T]) => void): void;
}
