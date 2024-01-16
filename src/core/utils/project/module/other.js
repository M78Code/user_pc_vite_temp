

import GlobalSwitchClass  from "src/core/global/global.js";
  /**
   * @description: 是否显示sr标志入口图标
   * @param {Object} match 赛事信息
   * @return {Boolean} 显示结果
   */
 export const is_show_sr_flg=(match)=>{
 

    // console.error(match.cds,'----------',match.man);
    // !['B03',C01,'O01','B02'].includes(match.cds)  B03 == BE电子足球、C01、O01==OD、B02等要屏蔽赛事分析 B02暂不屏蔽
    let ret = false; 
    if([1,2].includes(+match.csid) && GlobalSwitchClass.global_switch.statistics_switch && !['BE','C01','O01'].includes(match.cds) ){
      ret = true;
    }
    // if(!(window.env &&  window.env.config && window.env.config.FINAL_TARGET_PROJECT_NAME == 'yabo'))
    // { // 只有专业版显示sr标志入口图标
    //   ret = false;
    // }
    return ret;
  }