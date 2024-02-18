/***
 *
 * 业务逻辑  无关
 * 常量，工具函数 ，国际化 ，顶层通信用的 全局常量和 MITT
 * 通用项目： 各个版本 体育 客户端 H5,PC ,  活动动画等其他 项目
 * 不通用项目：无
 *
 * 必须 内部 单独引用 或者  从 src\output\module\constant-utils-common.js 引用 问题不大
 * 但是不能 引用 非这个文件内引入的内容
 */
// 本次打包的 客户端版本
import BUILDIN_CONFIG from "app/job/output/env/index.js";;
export * from "src/core/format/common/index.js";
export * from "src/core/constant/common/index.js";
export * from "src/core/utils/common/index.js";
export * from "src/core/file-path/file-path";

 


export { default as STANDARD_KEY } from "src/core/standard-key";

export {  uid, create_gcuuid } from "src/core/uuid/index.js";
export { i18n, loadLanguageAsync, map_lang,  i18n_t } from "src/boot/i18n.js";

//模块之间通信 ，去耦合化的一个 键值对 仓库
export { GLOBAL_CONSTANT } from "src/core/constant/global/index.js";

//模块之间通信 ，去耦合化的一个 事件通信 仓库
export {
  useMittOn,
  useMittEmit,
  useMitt,
  useMittEmitterGenerator,
  MITT_TYPES,
} from "src/core/mitt/index.js";






export const { BUILD_VERSION, CURRENT_ENV ,PROJECT_NAME ,IS_PC} = BUILDIN_CONFIG ;
export const  project_name = PROJECT_NAME

export {
  url_param_ctr_init,
  watch_route_fun,
} from "src/core/url-param-ctr/index.js";
 
