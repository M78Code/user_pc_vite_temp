/**
 * 业务逻辑  相关 
 * 卡片 ，表征
 * 通用项目：  各个版本 体育 客户端 H5,PC ,   
 * 不通用项目：活动动画等其他 项目
 * 
 * 
 */


import BUILD_VERSION_CONFIG from "app/job/output/version/build-version.js";
  const {  IS_PC} = BUILD_VERSION_CONFIG;



// pc

 
import MatchListCard_PC from "src/core/match-list-pc/match-card/match-list-card-class.js";
 
// h5

 
import MatchListCard_H5 from "src/core/match-list-h5/match-card/match-list-card-class.js";
 
 
export const MatchListCard = IS_PC ? MatchListCard_PC : MatchListCard_H5;
 
 



 
 

 