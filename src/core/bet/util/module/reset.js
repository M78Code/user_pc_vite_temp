
import {  MenuData  } from "src/core/index.js";
import {  PageSourceData  } from "src/core/index.js";
import UserCtr from  "src/core/user-config/user-ctr.js";
import BetData from "./class/bet-data-class.js";
import { compute_value_by_cur_odd_type } from "./bet_odds_change.js";
import { get_bet_amount_param } from "./bet-amount.js";
import { http_upd_data } from "./upd_data.js";
import { set_submit_status } from "./status.js";
import mathjs from "src/core/utils/mathjs.js";
import yabo_common from "src/core/common-helper/index.js";
import uid from "src/core/uuid/index.js";
import { ref } from "vue";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import lodash from "lodash";
import play_mapping from "src/core/constant/config/play_mapping/index.js";



/**
 * @description: 复位盘口变换标志
 * @param {Object} that 视图对象
 * @param {Integer} delay 延迟多少毫秒
 * @return {undefined} undefined
 */
const reset_hadicap_change = (that, delay) => {
    // 如果是封盘或者关盘时
    if(that.active==2 || that.active==3) {
      if (that.timer_) {
        clearTimeout(that.timer_);
        that.timer_ = undefined;
      }
      that.timer_ = setTimeout(() => {
        // 复位赔率样式
        that.odds_change_up = false;
        that.odds_change_down = false;
        that.handicap_change = false;
        that.odds_status_change = false;
        let bet_obj = _.cloneDeep(_.get(BetData,`virtual_bet_obj.${that.id}`)); 
        if(bet_obj && bet_obj.cs) {
          bet_obj.key = that.id;
          bet_obj.cs.hv_ov_change = false;
          set_bet_obj_value(bet_obj);
        }
        clearTimeout(that.timer_);
        that.timer_ = undefined;
      }, delay);
    }
  }
  /**
   * @description: 复位盘口及赔率的变换标志
   * @param {Object} that 视图对象
   * @return {undefined} undefined
   */
  const reset_odds_handicap_change = (that) => {
    if (!that || (that && !that.view_ctr_obj)) return;
    // 复位赔率样式
    that.odds_change_up = false;
    that.odds_change_down = false;
    that.handicap_change = false;
    that.odds_status_change = false;
    // 恢复盘口值和赔率一起变化的标志
    let bet_obj = _.cloneDeep(_.get(that,`vx_get_virtual_bet_obj.${that.id}`)); 
    if(bet_obj && bet_obj.cs) {
      bet_obj.key = that.id;
      bet_obj.cs.hv_ov_change = false;
      set_bet_obj_value(that, bet_obj);
    }
    let count = get_deactive_count(that);
    if(count>0) return;  
    that.view_ctr_obj.error_code = that.view_ctr_obj.error_code || "";
    // 若视图错误吗不为空并且不是自定义错误码(以M开头的错误码为自定义错误码供前端内部自己使用)
    if (that.view_ctr_obj.error_code != "" && !that.view_ctr_obj.error_code.startsWith('M')) {
      that.view_ctr_obj.error_code = "";
      that.view_ctr_obj.error_message = "";
    }
  }

 

  /**
 * @description: 复位提示语
 * @param {Object} that 视图对象
 * @return {undefined} undefined
 */
const reset_message_info = (that) => {
    if (!that || (that && !that.view_ctr_obj)) return;
    let count = get_deactive_count(that);
    if(count>0) return;
    if (that.view_ctr_obj.error_code) {
      that.view_ctr_obj.error_code = "";
      that.view_ctr_obj.error_message = "";
    }
  }

  /**
 * @description: 复位盘口变换标志
 * @param {Object} that 视图对象
 * @param {Integer} delay 延迟多少毫秒
 * @return {undefined} undefined
 */
const reset_hadicap_change = (that, delay) => {
    // 如果是封盘或者关盘时
    if(that.active==2 || that.active==3) {
        if (that.timer_) {
            clearTimeout(that.timer_);
            that.timer_ = undefined;
          } 
      that.timer_ = setTimeout(() => {
        // 复位赔率样式
        that.odds_change_up = false;
        that.odds_change_down = false;
        that.handicap_change = false;
        that.odds_status_change = false;

        let bet_obj = BetData.is_bet_single?_.cloneDeep(_.get(BetData,`bet_single_obj.${that.id}`,{})):_.cloneDeep(_.get(BetData,`bet_obj.${that.id}`,{}));
        
        if(_.has(bet_obj,'cs')) {
          bet_obj.key = that.id;
          bet_obj.cs.hv_ov_change = false;
          set_bet_obj_value(that, bet_obj);
        }
        clearTimeout(that.timer_);
        that.timer_ = undefined;
      }, delay);
    }
  }
  /**
   * @description: 复位盘口及赔率的变换标志
   * @param {Object} that 视图对象
   * @return {undefined} undefined
   */
  const reset_odds_handicap_change = (that) => {
    if (!that || (that && !that.view_ctr_obj)) return;
    // 复位赔率样式
    that.odds_change_up = false;
    that.odds_change_down = false;
    that.handicap_change = false;
    that.odds_status_change = false;
    // 恢复盘口值和赔率一起变化的标志
    let bet_obj = BetData.is_bet_single?_.cloneDeep(_.get(BetData,`bet_single_obj.${that.id}`)):_.cloneDeep(_.get(BetData,`bet_obj.${that.id}`));
  
    if(_.has(bet_obj,'cs') && !_.isUndefined(bet_obj,'cs')) {
      bet_obj.key = that.id;
      bet_obj.cs.hv_ov_change = false;
      set_bet_obj_value(that, bet_obj);
    }
    // console.log('=====================reset_odds_handicap_change=============');
    //串关失效投注项的个数
    let count = get_deactive_count(that);
    if(count>0) return;
    that.view_ctr_obj.error_code = that.view_ctr_obj.error_code || "";
    // 若视图错误吗不为空并且不是自定义错误码(以M开头的错误码为自定义错误码供前端内部自己使用)
    if (that.view_ctr_obj.error_code != "" && !that.view_ctr_obj.error_code.startsWith('M')) {
      that.view_ctr_obj.error_code = "";
      that.view_ctr_obj.error_message = "";
    }
  }

  /**
 * @description: 复位提示语
 * @param {Object} that 视图对象
 * @return {undefined} undefined
 */
const reset_message_info = (that) => {
    if (!that || (that && !that.view_ctr_obj)) return;
    // console.log('=====================reset_message_info=============');
    let count = get_deactive_count(that);
    if(count>0) return;
    if (that.view_ctr_obj.error_code) {
      that.view_ctr_obj.error_code = "";
      that.view_ctr_obj.error_message = "";
    }
  }