    

import {  MenuData  } from "src/core/index.js";
import {  PageSourceData  } from "src/core/index.js";
import BetData from "../class/bet-data-class";
import {compute_value_by_cur_odd_type} from  "src/core/format/module/format-odds-conversion-mixin.js"
import {get_bet_amount_param} from  "./bet-amount.js"
import {http_upd_data ,bet_obj_add_attr} from  "./upd_data.js"
import mathjs from "src/core/utils/mathjs.js"
import yabo_common from "src/core/common-helper/index.js"
import uid from "src/core/uuid/index.js";
import {ref} from "vue"
import { useMittOn, useMittEmit, MITT_TYPES  } from  "src/core/mitt/index.js"
import {i18n} from "src/core/index.js"
import UserCtr from  "src/core/user-config/user-ctr.js";
    


/*
 * @Description: 押注动作相关的方法
 */

export const hide_bet_series_but = () =>{
    let res = false;
    // 单关时,获取投注列表数据
    if(!BetData.bet_is_mix && _.get(get_bet_list,'get_bet_list.length')){
      // 遍历投注列表数据,检测是否红猫赛事
      for (let i = 0; i < get_bet_list.length; i++) {
        // 获取投注项id
        let id = _.get(BetData,`bet_list[${i}]`);
        // 获取投注项的数据源
        let cds = _.get(BetData,`bet_obj[${id}].bs.cds`);
        if(cds == "C01"){
          // C301赛事时,隐藏串关按钮
          res = true;
          break;
        }
      }
    }
    return res;
}

 /**
* @description 校验串关投注项数量是否小于最小串关数量
*  @param {*} value 不为空表示是删除某个投注项，undefined表示校验所有
*  @returns
*/
export const vilidata_mix_count = (value) =>{
    const bet_length  = get_bet_list.length
    if(value && bet_length <= 2){
        return true
    }
    const min_num = _.get(UserCtr.user_info, 'configVO.minSeriesNum', 2)
    if((bet_length - (value ? 1 : 0)) < min_num){
        set_toast({ 'txt': i18n_t('bet.match_min', [min_num]) });
        return false
    }else{
        return true
    }
}

/**
     *@description 更新提示信息
    * @param {*} value 需要更新的内容
    * @returns
*/
export const tips_msg_update = (value) =>{
    set_update_tips(value||'')
}   

/**
 *@description 是否存在PA操盘的赛事
*@return {Boolean} flag
*/
export const is_exist_pa_operate = ()=> {
    let flag = false;
    _.forIn(get_bet_obj, function(item) {
    if (item.bs.mprmc == 'PA') {
        flag = true
    }
    });
    return flag
}
