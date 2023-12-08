// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "app/job/output/version/build-version.js";
 

  export const  PROJECT_NAME =  BUILD_VERSION_CONFIG.PROJECT_NAME
  export const  IS_PC =  BUILD_VERSION_CONFIG.IS_PC

//通用
// import { useRouter, useRoute } from 'vue-router';
// const router = useRouter();
// const route = useRoute();

// src\core\utils\module\match-list-utils.js与src\core\format\module\format-date.js 存在get_remote_time的冲突导出
export * from "src/core/format/index.js";
export * from "src/core/constant/index.js";
export * from "src/core/utils/index.js";
export * from "src/core/enter-params/index.js";

export * from "src/core/file-path/file-path";
// ==============================   间接转出     项目无差异的        ======================================
 
export { default as uid } from "src/core/uuid/index.js";
export { default as SearchData } from "src/core/search-class/search-data-class.js";
export { default as UserCtr } from "src/core/user-config/user-ctr.js";
import MatchDetailCtr from "src/core/match-detail/match-detail-class.js";
import MatchListDetailMiddleware from "src/core/match-detail/match-detail-h5/match-list-detail-h5/index.js";
import {
  http,
  axios_loop,
  infoUpload,
  zhuge,
  AllDomain,
} from "src/core/http/index.js";

export { default as PageSourceData } from "src/core/page-source/page-source.js";
export { default as GlobalAccessConfig } from "src/core/access-config/access-config.js";

// ==============================  间接转出     默认输出   项目有差异的    ======================================

// pc

// 搜索组件类
export { default as SearchPCClass } from "src/core/search-class/seach-pc-calss.js";
// h5

export * from "./project-computed.js";

//=================================     pc全局开关类 =================================
export { default as GlobalSwitchClass } from "src/core/global/global.js";

/***
 * 详情操作类
 */
export const MatchDetailCalss = new MatchDetailCtr();
/***
 * H5详情中间件
 */
export const MatchListH5DetailMiddleware = new MatchListDetailMiddleware();
/**
 * PC  布局
 */

export { default as LayOutMain_pc } from "src/core/layout/index.js";

/**
 * CSS 变量
 */
export { compute_css_variables } from "src/core/css-var/index.js";

/**
 * img 变量
 */
export * from "src/core/server-img/";
/**
 *
 * 所有的用法 都一样 注意 这里输出的 模块不能 用这种方法
 * import { xxxx } from "src/core/index.js";
 *
 * import { is_eports_csid  } from "src/core/index.js";
 *
 */
import ServerTime from "src/core/server-time/server-time.js";

export * from "./match-data-base.js";

export {
  //
  http,
  axios_loop,
  infoUpload,
  zhuge,
  AllDomain,
  ServerTime,
  // 国际化相关
  i18n,
  loadLanguageAsync,
  map_lang,
  t,
  i18n_t,
  // emit相关
  useMittOn,
  useMitt,
  useMittEmit,
  useMittEmitterGenerator,
  MITT_TYPES,
  uid,
  SearchData,
 
  IS_PC,
  PROJECT_NAME,
  MenuData,
  MatchListCard,
  MatchListCardData,
  PageSourceData,
  GlobalAccessConfig,
  MatchListH5DetailMiddleware,
  LayOutMain_pc,
  compute_css_variables,
  GlobalSwitchClass,
  SearchPCClass,
};
