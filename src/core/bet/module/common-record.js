    

import {  MenuData  } from "src/core/index.js";
import {  PageSourceData  } from "src/core/index.js";
import { UserCtr } from "src/core/index.js";
import BetData from "./class/bet-data-class.js";
import {compute_value_by_cur_odd_type} from  "./bet_odds_change.js"
import {get_bet_amount_param} from  "./bet-amount.js"
import {http_upd_data ,bet_obj_add_attr} from  "./upd_data.js"
import mathjs from "src/core/utils/mathjs.js"
import yabo_common from "src/core/bet/common-helper/index.js"
import uid from "src/core/uuid/index.js";
import {ref} from "vue"
import { useMittOn, useMittEmit, MITT_TYPES  } from  "src/core/mitt/index.js"
import axios_api_loop from "src/core/http/axios-loop.js"
    
const post_order_list_gcuuid = ref(uid())


    /**
     * @description: 获取投注记录数据
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
    export const    get_bet_record_data=(params, callback)=> {
        post_order_list_gcuuid.value = uid();
        params.gcuuid =  post_order_list_gcuuid.value ;
        // console.log('get_bet_record_data====',JSON.stringify(params));
        let obj_ = {
          // axios api对象
          axios_api: api_betting.post_order_list,
          // axios api对象参数
          params: params,
          // 轮询次数
          max_loop: 2,
          // axios中then回调方法
          fun_then: res => {
            // console.log('get_bet_record_data=======', post_order_list_gcuuid.value  === res.config.gcuuid);
            // if( post_order_list_gcuuid.value  != res.config.gcuuid) {
            //   return;
            // }
  
            let gcuuid = _.get(res,'config.gcuuid')
            if(gcuuid &&  post_order_list_gcuuid.value  != gcuuid) {
              return;
            }
            let code = _.get(res, "data.code");
            let status = _.get(res, "status");
            if (code == 200 && status) {
              let data = _.get(res, "data.data");
              if (_.isFunction(callback)) {
                callback(code, data);
              }
            } else {
              if (_.isFunction(callback)) {
                callback(code, '');
              }
            }
          },
          // axios中catch回调方法
          fun_catch: err => {
            console.error(err);
            if (_.isFunction(callback)) {
              callback(-999, '');
            }
          }
        }
       axios_api_loop(obj_);
      }
      
  