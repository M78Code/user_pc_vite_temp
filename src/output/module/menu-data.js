/**
 * 业务逻辑  相关 
 * 菜单  
 * 通用项目：  各个版本 体育 客户端 H5,PC ,   
 * 不通用项目：活动动画等其他 项目
 * 
 * 
 */


import BUILD_VERSION_CONFIG from "app/job/output/version/build-version.js";
const {  PROJECT_NAME ,IS_PC} = BUILD_VERSION_CONFIG;



// pc

import MenuData_PC from "src/core/menu-pc/menu-data-class.js";
import MenuData_PC_Yazhou from "src/core/menu-pc-yazhou/menu-data-class.js";
 
// h5

import MenuData_H5 from "src/core/menu-h5/menu-data-class.js";
 

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


 
export const MenuData = current_menu_data;
 
