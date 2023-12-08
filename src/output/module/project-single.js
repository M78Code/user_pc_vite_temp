/**
 * 业务逻辑  相关
 * 菜单 ，卡片 ，表征 ，非数据仓库的其他业务逻辑
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
 * PC  布局
 */

export { default as LayOutMain_pc } from "src/core/layout/index.js";

/**
 * img 变量
 */
export * from "src/core/server-img/";

/**
 * CSS 变量
 */
export { compute_css_variables } from "src/core/css-var/index.js";

export { default as PageSourceData } from "src/core/page-source/page-source.js";
export { default as GlobalAccessConfig } from "src/core/access-config/access-config.js";
export { default as GlobalSwitchClass } from "src/core/global/global.js";

// 搜索组件类
export { default as SearchPCClass } from "src/core/search-class/seach-pc-calss.js";

export { default as SearchData } from "src/core/search-class/search-data-class.js";

export * from "src/core/utils/project/go-where.js";
