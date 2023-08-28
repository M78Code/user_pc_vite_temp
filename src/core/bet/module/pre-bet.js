

import MenuData from "src/core/menu-pc/menu-data-class.js";
import PageSourceData from "src/core/page-source-h5/page-source-h5.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import BetData from "./class/bet-data-class.js";
import {compute_value_by_cur_odd_type} from  "./bet_odds_change.js"
import {get_bet_amount_param} from  "./bet-amount.js"
import {http_upd_data} from  "./upd_data.js"
import mathjs from "src/core/utils/mathjs.js"
import yabo_common from "src/core/bet/common-helper/index.js"
import uid from "src/core/uuid/index.js";
import {ref} from "vue"
import { useMittOn, useMittEmit, MITT_TYPES  } from  "src/core/mitt/index.js"

 
const query_pre_bet_amount_gcuuid = ref(uid())
const post_book_list_gcuuid = ref(uid())
 
   
   /**
     * @description:获取预约投注预约额度接口合并
     * @param {*} callback
     * @return {undefined} undefined
     */
  const   query_pre_bet_amount=(callback, type='', oid = "")=> {
        let bet_obj;
        //是单关
        if (BetData.is_bet_single) {
          bet_obj = BetData.bet_single_obj;
        } else {
          bet_obj = BetData.bet_obj;
        }
        //获取额度接口合并 参数
        let param =  get_bet_amount_param(bet_obj, oid);
        query_pre_bet_amount_gcuuid.value  = uid();
        param.gcuuid = query_pre_bet_amount_gcuuid.value;
        console.log('preparam===', JSON.stringify(param));
        api_betting.query_pre_bet_amount(param).then(res=>{
          
          let gcuuid = _.get(res,'config.gcuuid')
          if(gcuuid && query_pre_bet_amount_gcuuid.value != gcuuid) {
            return;
          }
          let code = _.get(res, "data.code");
          let data = _.get(res, "data.data") || { latestMarketInfo:[],betAmountInfo: [] };
          //原有获取额度返回结构体 betAmountInfo
          let {latestMarketInfo,betAmountInfo} = data;
          //原有最新盘口信息结构体 latestMarketInfo
          if(latestMarketInfo && _.isArray(latestMarketInfo)) {
            BetData.bet_single_list.forEach((item, i) => {
              // 调用vuex中的http_upd_data方法同步数据
             http_upd_data({
                i: i,
                http_data_list: latestMarketInfo,
                
              });
            });
          } else {
            BetData.bet_list.forEach((item, i) => {
              // 调用vuex中的http_upd_data方法同步数据
            http_upd_data({
                i: i,
                http_data_list: latestMarketInfo,
            
              });
            });
          }
          // 设置预约押注信息
   
          BetData.pre_bet_list = latestMarketInfo[0]
          if(_.isFunction(callback)) {
            callback(code, betAmountInfo);
          }
        });
      }
 /**
     * @description: 预约投注拉单,预约注单状态
     * @param {Object} params 预约投注拉单入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
 const get_book_status_data=(params, callback)=> {
    api_betting.get_book_status_list(params).then(res => {
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
    }).catch(error=> {
      console.error(error);
      if (_.isFunction(callback)) {
        callback(-999, '');
      }
    });
  }
  


      
    /**
     * @description: 预投投注取消
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
   const  cancel_book_record_order=(params, callback)=> {
        api_betting.cancel_book_order(params).then(res => {
          let code = _.get(res, "data.code");
          let msg = _.get(res, "data.msg");
          let data = _.get(res, "data.data");
          if (!code) {
            code = _.get(res, "data.data.code");
            msg = _.get(res, "data.data.msg");
            data = _.get(res, "data.data.data");
          }
          let status = _.get(res, "status");
          if (code == 200 && status) {
            let data = _.get(res, "data.data");
            if (_.isFunction(callback)) {
              callback(code, data, msg);
            }
          } else {
            if (_.isFunction(callback)) {
              callback(code, '', msg);
            }
          }
        }).catch(error=> {
          console.error(error);
          if (_.isFunction(callback)) {
            callback(-999, '', msg);
          }
        });
      } 


      /**
     * @description: 获取预投住注单记录
     * @param {Object} params 投注记录入参
     * @param {Function} callback 回调函数
     * @return {undefined} undefined
     */
   const   get_book_record_data=(params, callback)=> {
    post_book_list_gcuuid.value = uid();
        params.gcuuid = post_book_list_gcuuid.value;
        // console.log('get_book_record_data====',JSON.stringify(params));
        api_betting.post_book_list(params).then(res => {
          let code = _.get(res, "data.code");
          let status = _.get(res, "status");
  
  
    
  
          let gcuuid = _.get(res,'config.gcuuid')
          if(gcuuid && post_book_list_gcuuid.value != gcuuid) {
            return;
          }
  
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
        }).catch(error=> {
          console.error(error);
          if (_.isFunction(callback)) {
            callback(-999, '');
          }
        });
      } 
     