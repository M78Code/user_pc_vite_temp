import BetData from "src/core/bet/class/bet-data-class.js";
   import {
     get_item_disable
   } from "./status.js"
   import {
     bet_single_obj_remove_attr,
     bet_single_list_remove,
     bet_single_list_remove
   } from "./bet-model-single.js"
   import {
     useMittEmit,
     MITT_TYPES
   } from "src/core/mitt/index.js"



   /**
    * @description:删除盘口中的垃圾盘口
    * @param {Founction} callback
    * @return {undefined} undefined
    */
   export const remove_close_handicap = (callback) => {
     if (BetData.is_bet_single) {
       let len = BetData.bet_single_list.length;
       for (let index = 0; index < len; index++) {
         let id = BetData.bet_single_list[index];
         // 投注服务器对象
         let item_bs = _.get(BetData.bet_single_obj, `${id}.bs`, {});
         // 投注客户端对象
         let item_cs = _.get(BetData.bet_single_obj, `${id}.cs`, {});
         // match_over: 1赛事结束
         if ((!_.isEmpty(item_bs) && get_item_disable(item_bs)) || (!_.isEmpty(item_cs) && item_cs.match_over == 1)) {
           bet_single_obj_remove_attr(id);
           // 关盘时,删除该子项
           bet_single_list_remove(index, 1);
           index--;
         }
       }
     }
     if (_.isFunction(callback)) {
       callback();
     }
   }

   /**
    * @description:移除串关结束的赛事
    * @param {*} callback
    * @return {undefined} undefined
    */
   export const remove_mix_match_end = (callback) => {
     //串关
     if (!BetData.is_bet_single) {
       let is_remove_match = false;
       let len = BetData.bet_list.length;
       for (let index = 0; index < len; index++) {
         let id = BetData.bet_list[index];
         // 投注服务器对象
         let item_bs = _.get(BetData.bet_obj, `${id}.bs`, {});
         //投注客户端对象
         let item_cs = _.get(BetData.bet_obj, `${id}.cs`, {});
         // match_over: 1赛事结束 或者不支持串关
         if ((!_.isEmpty(item_bs) && get_item_disable(item_bs)) || (!_.isEmpty(item_cs) && (item_cs.match_over == 1 || !item_cs.serial_type))) {
           // 删除投注对象
           BetData.bet_obj_remove_attr(id);
           // 关盘时,删除该子项
           BetData.bet_list_remove(index, 1);
           index--;
           is_remove_match = true;
         }
       }
       if (_.isFunction(callback)) {
         // 在回调中根据is_remove_match判断是否需要移除赛事
         callback(is_remove_match);
       }
     }
   }




   /**
 * @description:  移除投注项 
 
 * @return {undefined} undefined
 */
   const del_bet_item = () => {
     let bet_obj;
     let item_cs_id = BetData.item_cs_id
     if (BetData.is_bet_single) {
       bet_obj = _.get(BetData, `bet_single_obj.${item_cs_id}`);
       if (_.has(bet_obj, 'bs') && _.isArray(BetData.bet_single_list)) {
         let index = BetData.bet_single_list.findIndex(it => it === item_cs_id);
         //移除对应的键值对
         bet_single_obj_remove_attr(item_cs_id);
         //移除对应的数据
         bet_single_list_remove(index);
         useMittEmit(MITT_TYPES.EMIT_BET_SINGLE_SCROLL_HEIGHT_CMD);
       }
     } else {
       bet_obj = _.get(BetData, `bet_obj.${item_cs_id}`);
       if (_.has(bet_obj, 'bs') && _.isArray(BetData.bet_list)) {
         let index = BetData.bet_list.findIndex(it => it === item_cs_id);
         //移除对应的键值对
         BetData.bet_obj_remove_attr(item_cs_id);
         //移除对应的数据
         BetData.bet_list_remove(index);
       }
     }
   }