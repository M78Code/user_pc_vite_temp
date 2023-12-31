/**
 * 业务逻辑  相关
 *  单例
 * 通用项目：  各个版本 体育 客户端 H5,PC ,
 * 不通用项目：活动动画等其他 项目
 *
 *
 */

/***
 * 详情操作类
 */

export { default as MatchDetailCalss } from "src/core/match-detail/match-detail-class.js";

/***
 * H5详情中间件
 */

export { default as MatchListH5DetailMiddleware } from "src/core/match-detail/match-detail-h5/match-list-detail-h5/index.js";

/**
 * img 变量
 */
export * from "src/core/server-img/";

/**
 * 默认主题
 */
export * from "src/core/theme/index.js";

/**
 * CSS 变量
 */
export { compute_css_variables } from "src/core/css-var/index.js";

export { default as PageSourceData } from "src/core/page-source/page-source.js";
export { default as GlobalAccessConfig } from "src/core/access-config/access-config.js";
export { default as GlobalSwitchClass } from "src/core/global/global.js";

 