 import {
   MenuData
 } from "src/core/index.js";
 import {
   PageSourceData
 } from "src/core/index.js";
 import UserCtr from "src/core/user-config/user-ctr.js";
 import BetData from "src/core/bet/class/bet-data-class.js.js";
 import {
   compute_value_by_cur_odd_type
 } from "src/core/format/module/format-odds-conversion-mixin.js"
 // import {get_bet_amount_param} from  "./bet-amount.js"
 import {
   http_upd_data
 } from "./upd_data.js"
 // import mathjs from "src/core/utils/mathjs.js"
 // import yabo_common from "src/core/common-helper/index.js"
 import uid from "src/core/uuid/index.js";
 import {
   ref
 } from "vue"
 import {
   useMittOn,
   useMittEmit,
   MITT_TYPES
 } from "src/core/mitt/index.js"


 export const query_order_pre_settle_confirm_gcuuid = ref(uid())

 /**
  * @description:查询待确认中的提前结算单
  * @param {Function} callback 回调函数
  * @return {undefined} undefined
  */
 export const order_pre_settle_confirm = (callback) => {
   let param = {};
   query_order_pre_settle_confirm_gcuuid.value = uid();
   param.gcuuid = query_order_pre_settle_confirm_gcuuid.value;

   api_betting.query_order_pre_settle_confirm(param).then(res => {

     let gcuuid = _.get(res, 'config.gcuuid')
     if (gcuuid && query_order_pre_settle_confirm_gcuuid.value != gcuuid) {
       return;
     }
     let code = _.get(res, "data.code");
     if (code == 200) {
       let data = _.get(res, "data.data");
       if (_.isFunction(callback)) {
         callback(code, data);
       }
     } else {
       if (_.isFunction(callback)) {
         callback(code, '');
       }
     }
   }).catch(err => {
     if (_.isFunction(callback)) {
       // 异常code吗给-999
       callback(-999, '');
     }
   });
 }

 /**
  * @description: 提前结算实时查询最高返还批量,每5秒请求一次
  * @param {Object} params 投注记录入参
  * @param {Function} callback 回调函数
  * @return {undefined} undefined
  */
 export const get_bet_cashout_max_amount = (params, callback) => {
   api_betting.get_cashout_max_amount_list(params).then(res => {
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
   }).catch(error => {
     console.error(error);
     if (_.isFunction(callback)) {
       callback(-999, '');
     }
   });
 }