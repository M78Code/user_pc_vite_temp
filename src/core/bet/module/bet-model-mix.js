

import {  MenuData  } from "src/core/index.js";
import {  PageSourceData  } from "src/core/index.js";
import UserCtr from  "src/core/user-config/user-ctr.js";
import BetData from "../class/bet-data-class.js";
import {compute_value_by_cur_odd_type} from  "./bet_odds_change.js"
import {get_bet_amount_param} from  "./bet-amount.js"
import {http_upd_data ,bet_obj_add_attr} from  "./upd_data.js"
import mathjs from "src/core/utils/mathjs.js"
import yabo_common from "src/core/common-helper/index.js"
import uid from "src/core/uuid/index.js";
import {ref} from "vue"
import { useMittOn, useMittEmit, MITT_TYPES  } from  "src/core/mitt/index.js"

    
    /**
       * @description: 初始化串关数据
       * @param {undefined} undefined
       * @return {undefined} undefined
       */
    export const   init_bet_mix_data=()=> {
        //所有串关的金额
        BetData.bet_s_list.forEach(item => {
          let bs = _.cloneDeep(_.get(BetData.bet_s_obj,`[${item}].bs`,{}));
          let cs = _.cloneDeep(BetData.bet_s_obj,`[${item}].cs`,{});
          let obj = JSON.parse('{"key":"", "bs":{}, "cs":{}}');
          obj.key = item;
          obj.bs = bs;
          Object.assign(cs, {
            ...bs,
            money: "", // 投注额
            win_money: "", // 可赢额
            min_money: "", // 最大值
            max_money: "" // 最小值
          });
          obj.cs = cs;
         bet_obj_add_attr(obj);
        });
      }


      

    /**
     * @description: 获取投注模块-统计串关数
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    export const  getSeriesCountJointNumbe=(callback) =>{
        let data = BetCountJointNumber.getBetCountJoint(BetData.get_bet_list.length);
        let min_num = BetData.get_mix_min_count;
        if(min_num <= 10) {
          data = data.filter((item) => {
            return Number(item.id.slice(0, 1)) >= min_num ||  ['10串1','10串1013'].includes(item.name) }
            );
        }else if(BetData.get_bet_list.length == 10){
          data = [data[0]];
        }else {
          data = [];
        }
        console.log(JSON.stringify(data));
        if (_.isFunction(callback)) {
          callback(200, data);
        }
      }
  
  
