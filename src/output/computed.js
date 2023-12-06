import BUILD_VERSION_CONFIG from "app/job/output/version/build-version.js";
const { BUILD_VERSION, CURRENT_ENV ,PROJECT_NAME ,IS_PC} = BUILD_VERSION_CONFIG;


// pc

import MenuData_PC from "src/core/menu-pc/menu-data-class.js";
import MenuData_PC_Yazhou from "src/core/menu-pc-yazhou/menu-data-class.js";
import MatchListCard_PC from "src/core/match-list-pc/match-card/match-list-card-class.js";
import MatchListCardData_PC from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
// 搜索组件类
import  SearchPCClass  from "src/core/search-class/seach-pc-calss.js";
// h5

import MenuData_H5 from "src/core/menu-h5/menu-data-class.js";
import MatchListCard_H5 from "src/core/match-list-h5/match-card/match-list-card-class.js";
import MatchListCardData_H5 from "src/core/match-list-h5/match-card/module/match-list-card-data-class.js";

import MenuData_App_h5 from "src/core/menu-app-h5/menu-data-class.js";
import OZ_MenuData_App_h5 from "src/core/menu-app-h5/oz-menu-data-class.js";

let MenuData = IS_PC ? MenuData_PC : MenuData_H5;
// if( ['ouzhou-h5','app-h5'].includes(PROJECT_NAME)){
//   MenuData = MenuData_App_h5
// }

switch (PROJECT_NAME) {
  case 'ouzhou-h5':
    MenuData = OZ_MenuData_App_h5
    break;
  case 'app-h5':
    MenuData = MenuData_App_h5
    break;
  case 'yazhou-pc': 
    MenuData = MenuData_PC_Yazhou
    break;
  case 'ouzhou-pc':
    MenuData = MenuData_PC
    break;
  default:
    break;
}

export const MatchListCard = IS_PC ? MatchListCard_PC : MatchListCard_H5;
export const MatchListCardData = IS_PC ? MatchListCardData_PC : MatchListCardData_H5;

 