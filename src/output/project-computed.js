/**
 * 业务逻辑  相关 
 * 菜单 ，卡片 ，表征 ，非数据仓库的其他业务逻辑
 * 通用项目：  各个版本 体育 客户端 H5,PC ,   
 * 不通用项目：活动动画等其他 项目
 * 
 * 
 */


import BUILD_VERSION_CONFIG from "app/job/output/version/build-version.js";
export const { BUILD_VERSION, CURRENT_ENV ,PROJECT_NAME ,IS_PC} = BUILD_VERSION_CONFIG;



// pc

import MenuData_PC from "src/core/menu-pc/menu-data-class.js";
import MenuData_PC_Yazhou from "src/core/menu-pc-yazhou/menu-data-class.js";
import MatchListCard_PC from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MatchListCardData_PC from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
 
// h5

import MenuData_H5 from "src/core/menu-h5/menu-data-class.js";
import MatchListCard_H5 from "src/core/match-list-h5/match-card/match-list-card-class.js";
import MatchListCardData_H5 from "src/core/match-list-h5/match-card/module/match-list-card-data-class.js";

import MenuData_App_h5 from "src/core/menu-app-h5/menu-data-class.js";
import OZ_MenuData_App_h5 from "src/core/menu-app-h5/oz-menu-data-class.js";

let current_menu_data = IS_PC ? MenuData_PC : MenuData_H5;
// if( ['ouzhou-h5','app-h5'].includes(PROJECT_NAME)){
//   current_menu_data = MenuData_App_h5
// }

switch (PROJECT_NAME) {
  case 'ouzhou-h5':
    current_menu_data = OZ_MenuData_App_h5
    break;
  case 'app-h5':
    current_menu_data = MenuData_App_h5
    break;
  case 'yazhou-pc': 
    current_menu_data = MenuData_PC_Yazhou
    break;
  case 'ouzhou-pc':
    current_menu_data = MenuData_PC
    break;
  default:
    break;
}

export const MatchListCard = IS_PC ? MatchListCard_PC : MatchListCard_H5;
export const MatchListCardData = IS_PC ? MatchListCardData_PC : MatchListCardData_H5;
export const MenuData = current_menu_data;
 





import MatchDetailCtr from "src/core/match-detail/match-detail-class.js";

/***
 * 详情操作类
 */
export const MatchDetailCalss = new MatchDetailCtr();


import MatchListDetailMiddleware from "src/core/match-detail/match-detail-h5/match-list-detail-h5/index.js";

/***
 * H5详情中间件
 */
export const MatchListH5DetailMiddleware = new MatchListDetailMiddleware();


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