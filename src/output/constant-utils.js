

/***
 * 
 * 去业务逻辑化 
 */

export * from "src/core/format/index.js";
export * from "src/core/constant/index.js";
export * from "src/core/utils/index.js";
export * from 'src/core/file-path/file-path'



export { i18n, loadLanguageAsync, map_lang, t, i18n_t } from "src/boot/i18n.js";


//模块之间通信 ，去耦合化的一个 键值对 仓库
export {GLOBAL_CONSTANT} from  "src/core/constant/global\index.js"
 
//模块之间通信 ，去耦合化的一个 事件通信 仓库
export {
    useMittOn,
    useMittEmit,
    useMitt,
    useMittEmitterGenerator,
    MITT_TYPES,
  } from "src/core/mitt/index.js";

