//当前项目的强相关的一些入口 ，当前项目专用的，理论上 运行A 项目 不会 因为这里 引入 B 项目的文件 ，例如 运行H5，却加载了PC 的组件
// pc 路径抛出
export { default as MatchListCard } from "src/core/match-list-pc/match-card/match-list-card-class.js";

export { default as MatchListCardData } from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";

/**
 * PC  布局
 */
export { default as LayOutMain_pc } from "src/core/layout/index.js";

/**
 * 搜索组件类 PC
 */
export { default as SearchPCClass } from "src/core/search-class/seach-pc-calss.js";
 
export { default as MenuData } from "src/core/menu-pc/menu-data-class.js";