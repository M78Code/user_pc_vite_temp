/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:50
 * @Description: 注部分公共方法提取(包括与列表,详情,投注项三部分)
 */
import play_mapping from "./play_mapping.js";
import _ from  "lodash";
import { useMittEmit,MITT_TYPES } from 'src/core/mitt/index.js'
import { compute_value_by_cur_odd_type } from "../bet/bet_odds_change"

/**
 * @description: 同步投注项部分数据
 * @param {Object} that 视图对象
 * @param {Object} skt_data 推送的指令息体cd部分
 * @return {undefined} undefined
 */
const sync_bet_obj = (vx_get_virtual_bet_obj,skt_data) => {
  let hls=[];
  for(let { bs } of Object.values(vx_get_virtual_bet_obj , {})) {
    if(bs) {
      let hl =  _.get(bs, 'hps[0].hl');
      if(hl && hl.length) {
        hls.push(...hl);
      }
    }
  }
  if(hls && hls.length && hls.length>0) {
    _.forEach(hls, item=>{
      if(item && item.hid) {
        // console.log(`============common========sync_bet_obj======hid:${item.hid}`);
        update_bet_item_status(vx_get_virtual_bet_obj,{
          mid: skt_data.mid,
          hid: item.hid,
          status: skt_data.mhs
        });       
      }
    });
  }
}
/**
 * @description: 更新投注项状态
 * @param {Object} that 视图对象
 * @param {Object} obj 更新的对象
 * @return {undefined} undefined
 */
const update_bet_item_status = (vx_get_virtual_bet_obj, obj,vx_get_is_virtual_handle) => { 
  if (vx_get_is_virtual_handle) {
    return;
  } 
  let bet_obj,cs; 
  for(let key of Object.keys(vx_get_virtual_bet_obj,{})) {      
    bet_obj = _.cloneDeep( vx_get_virtual_bet_obj[key] );
    cs = _.get(bet_obj,'cs', {});
    if(!_.isEmpty(cs) && obj.mid==cs.match_id || obj.hid == cs.handicap_id || obj.id == cs.id) {
      update_target_obj( bet_obj, obj, key);
    } 
  }
}
/**
 * @description: 更新Object对象(主要是在投注提交时,从后台拉取的方法更新了投注栏后,同步列表与详情对应的投注项对象)
 * @param {Object} that 视图对象
 * @param {Object} bet_obj 投注项对象
 * @param {Object} obj 传入更新的数据
 * @param {String} key 传入的id(可能是oid后续可能为坑位id)
 * @return {undefined} undefined 
 */
const update_target_obj = (bet_obj, obj, key) => {
  if(_.has(bet_obj,'bs') && 
    _.has(bet_obj,'cs') &&
    _.get(bet_obj,'cs.match_id')==obj.mid &&
    _.get(bet_obj,'cs.handicap_id')==obj.hid &&
    _.get(bet_obj,'cs.id')==obj.id) {
    bet_obj.bs.hps[0].hl[0].ol[0].os = obj.status;
    bet_obj.cs.active = obj.status;
    // console.log(`==========111=====update_target_obj====source:${bet_obj.cs.source}===obj:${JSON.stringify(obj)}`); 
  } else if(_.has(bet_obj,'bs') && 
    _.has(bet_obj,'cs') &&
    _.get(bet_obj,'cs.match_id')==obj.mid &&
    _.get(bet_obj,'cs.handicap_id')==obj.hid &&
    key) {   
    obj.id = key;    
    bet_obj.bs.hps[0].hl[0].hs = obj.status;
    bet_obj.bs.hps[0].hl[0].ol[0]._hs = obj.status;
    bet_obj.cs.handicap_status = obj.status; 
  //  console.log(`===========222====update_target_obj====source:${bet_obj.cs.source}===obj:${JSON.stringify(obj)}`);    
  } else if (_.has(bet_obj,'bs') && 
    _.has(bet_obj,'cs') &&
    _.get(bet_obj,'cs.match_id')==obj.mid &&
    key) { 
    obj.id = key;  
    bet_obj.bs.mhs = obj.status;
    bet_obj.bs.hps[0].hl[0].ol[0]._mhs = obj.status;
    bet_obj.cs.match_status = obj.status;
    // console.log(`==========333=====update_target_obj====source:${bet_obj.cs.source}===obj:${JSON.stringify(obj)}`);    
  } 
  if(bet_obj) {
    useMittEmit(MITT_TYPES.EMIT_VITTUAL_BET_OBJ_ADD,bet_obj)
  }
}
/**
 * @description: 获取球种id
 * @param {*} that
 * @return {*}
 */
const get_sport_id = (vx_get_virtual_bet_obj,id) => {
  // return _.get(that.vx_get_virtual_bet_obj,`${that.id}.bs.csid`);
  return _.get(vx_get_virtual_bet_obj,`${id}.bs.csid`);
}
// 获取盘口和赔率是否都变化的值
const get_hv_ov_change = (vx_get_virtual_bet_obj,id) => {
  // let bet_obj = _.get(that,`vx_get_virtual_bet_obj.${that.id}`, {});
  let bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`, {});
  if(_.has(bet_obj,'bs') && _.has(bet_obj,'cs')) {
    let bet_cs = _.get(bet_obj,'cs', {});
    let hn = _.get(bet_obj, 'bs.hps[0].hl[0].hn'); // 坑位值
    if(hn) { // 若坑位值存在
      return _.get(bet_cs,'hv_ov_change', false); 
    }
  }
  return false;
}
/**
 * @description: 获取玩法名称
 * @param {Object} that 视图对象 
 * @return {String} 玩法名称
 */
const get_play_id = (vx_get_virtual_bet_obj,id) => {
  let bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`);
  let cs = _.get(bet_obj,'cs', false);
  return cs ? _.trim(cs.play_id) : '';
}
/**
 * @description: 获取玩法名称
 * @param {Object} that 视图对象 
 * @return {String} 玩法名称
 */
const get_play_name = (vx_get_virtual_bet_obj,id) => {
  let bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`);
  let cs = _.get(bet_obj,'cs', false);
  return cs ? _.trim(cs.play_name) : '';
}
/**
 * @description: 返回数字集合
 * @param {*}
 * @return {*}
 */
const get_numbers =  (vx_get_virtual_bet_obj,id) => {
  let ot = _.get(vx_get_virtual_bet_obj,`${id}.bs.hps[0].hl[0].ol[0].ot`);
  if(ot) {
    if(ot.includes('/')) {
      return ot.split('/');
    }
    return ot;
  }
  return [];
}
/**
 * @description: 赔率计算
 * @param {Object} that 视图对象 
 * @param {String} id 传入的id(可能是oid后续可能为坑位id)
 * @return {Double} 赔率 
 */
const get_odds_value = (that, id = '' ) => {
  let bet_obj= _.get(vx_get_virtual_bet_obj,`${id}`), cs, ret = ''; 
  if(!bet_obj) return ret; 
  cs = _.get(bet_obj,'cs', false);
  if (cs) {
    let odds_value_ = cs.odds_value;
    ret = compute_value_by_cur_odd_type(
      odds_value_ / 100000,
      cs.break_odds_value / 100000,
      cs.odds_switch,
      cs.sport_id
    );
  }
  return ret;
}
/**
 * @description: 获取盘口id
 * @param {object} that 上下文
 * @return {undefined} undefined
 */
const get_handicap_id = (vx_get_virtual_bet_obj,id) => {
  let bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`);
  return _.get(bet_obj,'cs.handicap_id', '');
}
/**
 * @description: 获取盘口值
 * @param {Object} that 视图对象
 * @return {String} 盘口值 
 */
const get_handicap = (vx_get_virtual_bet_obj,id) => {
  let bet_obj,item_bs,item_cs,team_name='',handicap='',hpid, target_side;
  bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`);
  if(!_.has(bet_obj,'bs') || !_.has(bet_obj,'cs')) return ''; 
  item_bs = _.get(bet_obj,'bs',false);
  item_cs = _.get(bet_obj,'cs',false);
  if(item_cs && item_bs) {
    handicap = _.get(item_cs,'handicap_value',''); 
    hpid = `${_.get(item_cs,'play_id','')}`;
    target_side = _.get(item_cs,'target_side','');    
    // 以下逻辑同 列表中tips的显示逻辑 非赛事详情
    if(!['details','match_details'].includes(item_cs.source)) {
      // 让球玩法数组中PLAY_LET_BALL中包含的则显示队伍名称与盘口值 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
      if(play_mapping.VIRTUAL_PLAY_LET_BALL.includes(hpid)) {
        team_name = `${team_name} ${_.get(item_bs, 'hps[0].hl[0].ol[0].on','')}`;
      } else if(!play_mapping.VIRTUAL_PLAY_GOAL.includes(hpid) || (play_mapping.VIRTUAL_PLAY_GOAL.includes(hpid) && target_side=='')) {//如果不在进球玩法中且target_side值不存在
        team_name = _.get(item_bs, 'hps[0].hl[0].ol[0].on','');
      } 
      //玩法名称存在 盘口存在 并且玩法id不是在PLAY_ALL_KINDS中包含 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
      if(team_name && handicap && handicap!='' && !play_mapping.VIRTUAL_PLAY_ALL_KINDS.includes(hpid)) {
        // 如果盘口存在且可以转化成数字,则去掉正负号后进行匹配(防止接口hv字段的盘口值与on或者otv字段中盘口值正负号不一致造成页面显示问题)
        if(!handicap.includes('/') && !isNaN(handicap)){
          if (handicap.includes('.')) { // 精度问题
            handicap = Math.abs(handicap).toFixed(1);
          } else {
            handicap = Math.abs(handicap)
          }
        } else if(handicap.includes('/') && (handicap.startsWith('+') || handicap.startsWith('-'))) {
          handicap = handicap.substr(1,handicap.length)
        }      
        if(team_name.endsWith(`+${handicap}`) || _.trim(team_name) ==`+${handicap}`) {
          return `+${handicap}`;
        } else if (team_name.endsWith(`${handicap}+`) || _.trim(team_name) ==`${handicap}+`) {
          return `${handicap}+`;
        } else if (team_name.endsWith(`-${handicap}`) || _.trim(team_name) ==`-${handicap}`) {
          return `-${handicap}`;
        } else if (team_name.endsWith(`${handicap}-`) || _.trim(team_name) ==`${handicap}-`) {
          return `${handicap}-`;
        } else if(team_name.endsWith(handicap) || _.trim(team_name) == handicap) {
          return handicap;
        }
      } else {
        handicap = '';
      }       
    } else {
      if(['20003','20024'].includes(hpid)){
        handicap = '';
      } else {
        handicap = _.get(item_bs, 'hps[0].hl[0].ol[0].on','');
      }    
    }
  }
  // console.log(`============get_handicap================>handicap:${handicap}`);
  return handicap=='null'?'':handicap;
}
/**
 * @description: 获取投注项显示的状态
 * @param {Object} that 视图对象
 * @return {String} 显示的状态
 */
const get_active = (vx_get_virtual_bet_obj,id) => {
  let bet_obj =_.get(vx_get_virtual_bet_obj,`${id}`);
  let cs = _.get(bet_obj,'cs',false);
  let active = 3;
  if (cs) {
    // 赛事盘口状态
    let match_status = cs.match_status;
    // 盘口状态
    let handicap_status = cs.handicap_status;
    // 投注项状态
    active = cs.active;  
    active = get_odds_active(match_status, handicap_status, active);
  }
  return active;
}
/**
 * @description: 获取杯赛
 * @param {Object} that 视图对象
 * @return {String} 赛季名称
 */
const get_season = (vx_get_virtual_bet_obj,id) => {
  let tn = _.get(vx_get_virtual_bet_obj,`${id}.bs.tn`,'');
  return  tn
}
/**
 * @description: 是否可以进行串关
 * @param {object} that 上下文
 * @param {*} that
 */
const get_serial = (vx_get_virtual_bet_obj) => {
  let bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`,{});
  return _.get(bet_obj, 'cs.is_serial', false);
}
/**
 * @description: 获取轮次
 * @param {*} that
 * @return {*}
 */
const get_no = (vx_get_virtual_bet_obj) => {
  let bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`), no = '';
  if(_.has(bet_obj,'bs')) {
    let item_bs = _.get(bet_obj,'bs',{});
    no = item_bs.no;
  }
  return no;
}
/**
 * @description: 获取批次
 * @param {*} that
 * @return {*}
 */
const get_batch_no = (vx_get_virtual_bet_obj) => {
  let bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`), batch_no = '';
  if(_.has(bet_obj,'bs')) {
    let item_bs = _.get(bet_obj,'bs',{});
    batch_no = item_bs.batchNo;
  }
  return batch_no;
}
/**
 * @description: 获取投注一方的队名
 * @param {Object} that 视图对象
 * @return {String} 队伍名称
 */
const get_team_name = (vx_get_virtual_bet_obj) => {
  let bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`,{}),team_name = '',hpid='', handicap='';
  if (_.has(bet_obj,'cs') && _.has(bet_obj,'bs')) {
    let item_cs = _.get(bet_obj,'cs',{}),item_bs = _.get(bet_obj,'bs',{}),target_side =  _.get(item_cs, 'target_side',''), sport_id = _.get(item_cs, 'sport_id','');
    hpid = `${_.get(item_bs, 'hps[0].hpid','')}`;
    if([play_mapping.VIURTUAL_SPORT.football,
       play_mapping.VIURTUAL_SPORT.basketball,
       play_mapping.ESPORTS_SPORT.lol,
       play_mapping.ESPORTS_SPORT.dota2,
       play_mapping.ESPORTS_SPORT.csgo,
       play_mapping.ESPORTS_SPORT.king].includes(sport_id) || 
       (_.get(item_cs,'source')=='match_list' &&
        play_mapping.VIURTUAL_SPORT.mudland_motorcycle==sport_id && 
        ['20039','20040'].includes(hpid)
      )) {
      if([play_mapping.VIURTUAL_SPORT.football,
          play_mapping.VIURTUAL_SPORT.basketball].includes(sport_id)) {
        if(target_side=='T1') {
          team_name = _.get(item_bs,'teams[0]','');
        } else if(target_side=='T2') {
          team_name = _.get(item_bs,'teams[1]','');
        }
      } else {
        if(target_side=='T1') {
          team_name = _.get(item_bs, 'mhn', '');
        } else if(target_side=='T2') {
          team_name = _.get(item_bs, 'man', '');
        }
      }
      handicap = _.get(item_cs,'handicap_value','');
      // 以下逻辑同 列表中tips的显示逻辑 非赛事详情
      if(!['details','match_details'].includes(_.get(item_cs,'source'))) {
        // 让球玩法数组中VIRTUAL_PLAY_LET_BALL中包含的则显示队伍名称与盘口值 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
        
        if([...play_mapping.VIRTUAL_PLAY_LET_BALL,
            ...play_mapping.ESPORTS_PLAY_LET_BALL].includes(hpid)) {
          team_name = `${team_name} ${_.get(item_bs, 'hps[0].hl[0].ol[0].on','')}`;
        } else if(!play_mapping.VIRTUAL_PLAY_GOAL.includes(hpid) || (play_mapping.VIRTUAL_PLAY_GOAL.includes(hpid) && target_side=='')) {//如果不在进球玩法中且target_side值不存在
          team_name = _.get(item_bs, 'hps[0].hl[0].ol[0].on','');
        }      
        //玩法名称存在 盘口存在 并且玩法id不是在VIRTUAL_PLAY_ALL_KINDS中包含 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
        if(team_name && handicap && handicap!='' && !play_mapping.VIRTUAL_PLAY_ALL_KINDS.includes(hpid)) {
          if(!handicap.includes('/') && !isNaN(handicap)){
            if (handicap.includes('.')) { // 精度问题
              handicap = Math.abs(handicap).toFixed(1);
            } else {
              handicap = Math.abs(handicap)
            }      
          } else if(handicap.includes('/') && (handicap.startsWith('+') || handicap.startsWith('-'))) {
            handicap = handicap.substr(1,handicap.length)
          }   
          let len1 = team_name.length;  
          if(team_name.endsWith(`+${handicap}`) || _.trim(team_name) ==`+${handicap}`) {
            let len2 = `+${handicap}`.length;
            team_name = team_name.substr(0,(len1-len2));
          } else if (team_name.endsWith(`${handicap}+`) || _.trim(team_name) ==`${handicap}+`) {
            let len2 = `${handicap}+`.length;
            team_name = team_name.substr(0,(len1-len2));
          } else if (team_name.endsWith(`-${handicap}`) || _.trim(team_name) ==`-${handicap}`) {          
            let len2 = `-${handicap}`.length;
            team_name = team_name.substr(0,(len1-len2));
          } else if (team_name.endsWith(`${handicap}-`) || _.trim(team_name) ==`${handicap}-`) {
            let len2 = `${handicap}-`.length;
            team_name = team_name.substr(0,(len1-len2));
          } else if(team_name.endsWith(handicap) || _.trim(team_name) == handicap) {
            let len2 = `${handicap}`.length;
            team_name = team_name.substr(0,(len1-len2));
          } else if(team_name.includes(`+${handicap}`)) {
            team_name = team_name.replace(`+${handicap}`, '');
          } else if(team_name.includes(`-${handicap}`)) {
            team_name = team_name.replace(`-${handicap}`, '');
          }
        }
      } else {        
        if(['20003','20024'].includes(hpid)) {
          // 如果是详情部分则取otv字段进行投注项名称显示
          team_name = _.get(item_bs, 'hps[0].hl[0].ol[0].otv','');
        } else {
          // 如果是详情部分则取otv字段进行投注项名称显示
          team_name = _.get(item_bs, 'hps[0].hl[0].ol[0].ott','');
        }
      }
    } else {
      if(!['details','match_details'].includes(item_cs.source)) {
        let teams = _.get(item_bs, 'teams', []), match_index = _.get(item_cs, 'match_index', 0);
        team_name = teams[match_index];
      } else {        
        if(!play_mapping.VIRTUAL_PLAY_NOT_NUMBER.includes(hpid)) {
          team_name = _.get(item_bs, 'hps[0].hl[0].ol[0].on','');
        }    
      }
    }
  }
  return team_name;
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
      let bet_obj = _.cloneDeep(_.get(that,`vx_get_virtual_bet_obj.${that.id}`)); 
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
 * @description: 复位盘口及赔率的变换标志
 * @param {Object} that 视图对象
 * @param {Integer} delay 延迟多少毫秒
 * @return {undefined} undefined
 */
const delay_reset_message = (that, delay = 3000, callback) => {
  if (delay) {
    if (that.view_ctr_obj.timer_) {
      clearTimeout(that.view_ctr_obj.timer_);
      that.view_ctr_obj.timer_ = undefined;
    }
    that.view_ctr_obj.timer_ = setTimeout(() => {
      reset_odds_handicap_change(that);
      let count = get_deactive_count();
      if(count==0) {
        init_message(that);
      }
      if(callback) {
        callback();
      }
    }, delay);
  }
}
/**
 * @description: 初始化提示信息
 * @param {Object} that 视图对象
 * @return {undefined} undefined
 */
const init_message = (that) => {
  if (!that || (that && !that.view_ctr_obj)) return;
  // console.log(`========================init_message=====`);
  // 如果当前是串关提示，先不清除提示
  if(["0400477","0400478"].includes(that.view_ctr_obj.error_code) || that.view_ctr_obj.input_max_flag==1) return;
  let count = get_deactive_count(that);
  if(count>0) return;
  that.view_ctr_obj.error_code = "";
  that.view_ctr_obj.error_message = "";
}
/**
 * @description: 
 * @param {*} that
 * @param {*} type
 * @return {*}
 */
const check_result_msg = (that, type, money) => {
  let count = get_deactive_count(that);
  if(count>0) return;
  //single_range_money取值说明 -2: 当前输入金额为空 -1: 当前输入金额小于最小值 1: 当前输入金额大于最大值 0: 在正常范围内
  type = (type == 'single')? that.view_ctr_obj.single_range_money : that.view_ctr_obj.mix_range_money
  switch(type) {
    case 1:
      // 大于最大金额时的提示
      that.view_ctr_obj.error_code = "M400011";
      break;
    case -1:
      // 小于最小金额时的提示
      that.view_ctr_obj.error_code = "M400010";
      break;
    case -2:
      // 当前输入为空的提示
      that.view_ctr_obj.error_code = "M400005";
      break;
    case -3:
      // 最大最小值正在获取中
      that.view_ctr_obj.error_code = "M400012";
      break;
    default:
      // 在正常范围内无提示
      that.view_ctr_obj.error_code = "";
      break;
  }
  if(that.view_ctr_obj.error_code=="M400010" && money) {
    let msg = that.$root.$t(`error_msg_info.${that.view_ctr_obj.error_code}`).client_msg1;
    that.view_ctr_obj.error_message = msg.replace('%s', Number(money).toFixed(2));
  } else if (that.view_ctr_obj.error_code) {// 校验串关金额
    that.view_ctr_obj.error_message = that.$root.$t(`error_msg_info.${that.view_ctr_obj.error_code}`).client_msg1;
  } else {
    that.view_ctr_obj.error_message = "";
  }
}

/**
 * @description: 初始化提示信息
 * @param {Object} that 视图对象
 * @return {undefined} undefined
 */
const del_bet_item = (vx_get_virtual_bet_obj,vx_get_virtual_bet_list,id) => {
  let bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`);
  if (bet_obj && bet_obj.bs) {
    let index = vx_get_virtual_bet_list.findIndex(it => it === id);
    //移除对应的键值对
    useMittEmit(MITT_TYPES.EMIT_VITTUAL_BET_OBJ_DEL,id)
    //移除对应的数据
    useMittEmit(MITT_TYPES.EMIT_VITTUAL_BET_OBJ_DEL,index)
  }
}
/**
 * @description:更新赛事列表以及赛事详情的赔率(前端模拟C105进行发送) 目的: 解决赔率不同步问题
 * @param {Object} that 视图对象
 * @return {undefined} undefined
 */
const update_odds_info = (vx_get_virtual_bet_obj,id) => {
  if (!id) return;  
  if(window.ws) {
    let bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`,{});
    //console.log(`=========is_bet_single:${that.vx_is_bet_single}=========bet_obj:${JSON.stringify(bet_obj)}`);
    if(_.has(bet_obj,'cs')&&_.has(bet_obj,'bs')){
      let cs = bet_obj.cs;
      let bs = bet_obj.bs;
      let hps;
      if(play_mapping.PLAY_TODAY_SCORE.includes(`${cs.play_id}`)) {
        hps = `${_.get(cs,'score_type')}|${_.get(cs,'home_score','0')}:${_.get(cs,'away_score','0')}`;
      }
      // 模拟发送C105用来同步项目各模块的投注项信息
       let cmd_obj = {
          "cd":{            
            "mid": _.get(cs, 'match_id'),
            "send":"my_self",
            "hls": [{
              "hid": _.get(cs, 'handicap_id'),
              "hpid": _.get(cs, 'play_id'),
              "hmt": _.get(cs, 'market_type'),
              "hs":  _.get(cs, 'handicap_status'),
              "mid": _.get(cs, 'match_id'),
              "hn": _.get(bs, 'hps[0].hl[0].hn'),
              "hps": _.isEmpty(_.get(cs,'score_type'))?'':hps,
              "ol": [{
                "obv": _.get(cs, 'break_odds_value'),
                "oid": _.get(cs, 'oid'),
                "os": _.get(cs, 'active'),               
                "ot": _.get(bs, 'hps[0].hl[0].ol[0].ot'),
                "ov": _.get(cs, 'odds_value')
              }]
            }]
          },
          "cmd":"C105"    
      }
      if(window.ws) {
        console.log('模拟发送的C105',{ ...cmd_obj });
        window.ws.customWsCmdData(cmd_obj);
      }
    }
  }
}
/**
 * @description: 球种名称与id对应关系
 * @param {String} csid 球种id  
 * @return {Object} 映射的对象 
 */
const play_name_mapping = (csid) => {
  let obj = {
    '1001': 'VR足球',
    '1002': 'VR赛狗',
    '1007': 'VR泥地赛车',
    '1008': 'VR卡丁车',
    '1009': 'VR泥地摩托车',
    '1010': 'VR摩托车',
    '1011': 'VR赛马',
    '1012': 'VR马车赛'
  };
  return obj[csid];
}
/**
 * @description: 更新投注项的比分
 * @param {Object} that 视图对象
 * @param {Object} 投注更新的目标对象
 * @param {String} id 投注项的id
 * @return {undefined} undefined
 */
const set_bet_obj_value = (obj) => {
  if (_.isPlainObject(obj)) {    
    obj.key = _.get(obj,'cs.id',''); 

    useMittEmit(MITT_TYPES.EMIT_VITTUAL_BET_OBJ_ADD,obj)
  }
}
/**
 * @description: 根据oid或者坑位id获取投注项id
 * @param {Object} that 视图对象
 * @param {String} okid oid或者坑位id
 * @return {String} 投注项id
 */
 const get_id = (vx_get_virtual_bet_obj, okid) => {
  let id;
  for(let [key, obj] of Object.entries(vx_get_virtual_bet_obj)) {
    if(_.get(obj,'cs.oid')==okid || _.get(obj,'cs.kid') == okid){
      id = key;
      break;
    }
  }
  return id;
}
/**
 * @description: 根据投注项id获取投注项的oid
 * @param {Object} that 视图对象
 * @param {String} id 投注项id
 * @return {String} 投注项oid
 */
 const get_oid = (vx_get_virtual_bet_obj,virtual_id, id) => {
  let oid = id, bet_obj = _.get(vx_get_virtual_bet_obj,`${virtual_id}`);
  for(let [key, obj] of Object.entries(that[bet_obj])) {
    if(_.get(obj,'cs.id')==key){
      oid = _.get(obj,'cs.oid','');
      break;
    }
  }   
  return oid;
}
/**
 * @description: 根据投注项id获取投注项的坑位id(kid)
 * @param {Object} that 视图对象
 * @param {String} id 投注项id
 * @return {String} 投注项坑位id(kid)
 */
 const get_kid = (vx_get_virtual_bet_obj, id) => {
  let kid, bet_obj = _.get(vx_get_virtual_bet_obj,`${id}`);   
  if(_.has(bet_obj,'cs')) {
    kid = _.get(bet_obj,'cs.kid','');
  }
  return kid;
}
/**
 * @description: 更具投注项id,获取投注项对象
 * @param {Object} that 视图对象
 * @param {String} id 投注项id
 * @return {Object} 投注项
 */
const get_bet_obj = (vx_get_virtual_bet_obj, id) => {
  let bet_obj = _.cloneDeep(vx_get_virtual_bet_obj);
  for(let obj of Object.values(bet_obj)) {
    if(_.get(obj,'cs.oid')==id || _.get(obj,'cs.kid')==id) {
      bet_obj = obj;
      bet_obj.id = _.get(obj,'cs.id','');
      break;
    }
  }
  return bet_obj;    
}
/**
 * @description: 检查可否进行串关
 * @param {Object} that 视图对象
 * @param {Array} match_list 虚拟体育投注列表
 * @return {Array} 赛事id数组
 */
const check_mix = (vx_get_virtual_bet_list, match_list,vx_get_virtual_bet_obj) => {
  let match_team= [],mid_obj = {}, bet_id_obj={};
  // 如果从外部没有传入match_list则取vuex中get_bet_list中的id
  if(!match_list) {
    match_list = _.cloneDeep(vx_get_virtual_bet_list) || []
  }
  if(match_list==1) {
    return [];
  }
  let m_l_len = match_list.length;
  for(let i=0;i<m_l_len; i++) {
    let obj = {}, id = match_list[i], item;    
    item = _.get(vx_get_virtual_bet_obj,`${id}`,{});
    obj.id = id;
    obj.mid = _.get(item, 'bs.mid','');
    // 放入该场赛事的两支球队id，如果提供了球员id则放入球员id
    obj.teams = [_.get(item,'cs.home',''), _.get(item,'cs.away','')];
    match_team.push(obj);
  }
  let m_t_len = match_team.length - 1;
   // 两支球队进行比较
   for(let i=0;i<m_t_len;i++) {
    let team1 = _.get(match_team,`[${i}].teams`);
    let mid1 = _.get(match_team,`[${i}].mid`);
    let id1 = _.get(match_team,`[${i}].id`);
    let obj = _.cloneDeep(_.get(that,`vx_get_virtual_bet_obj.${id1}`,{}));
    // 恢复是否可以串关的标志
    if(obj && obj.cs) {
      obj.cs.is_serial = true;
    }
    set_bet_obj_value(obj);
    for(let j=i+1;j<match_team.length;j++) {
      let team2 = _.get(match_team,`[${j}].teams`);
      let mid2 = _.get(match_team,`[${j}].mid`);
      let id2 = _.get(match_team,`[${j}].id`);
      // 非同一场赛事的两支球队进行比较,如果比较结果相同则result与team2相等，如果不同则result与team2不相等。对team2过滤掉team1
      let result = _.difference(team2, team1);
      if(!_.isEqual(result,team2)) {//比较result, team2是否相等，不相等的话，把赛事id和队伍id保存下来
        // 将两支球队同时存入mid_obj对象中
        mid_obj[mid1]="";
        mid_obj[mid2]="";
        bet_id_obj[id1]="";
        bet_id_obj[id2]=""
      }
    }
  } 
  // 若mid_obj对象有key值,则表示不可以进行串关,设置对应的标志
  for(let key in bet_id_obj) {
    let obj = _.cloneDeep(_.get(vx_get_virtual_bet_obj,`${key}`,{}));
    // 设置为不可串关
    if(obj && obj.cs) {
      obj.cs.is_serial = false;
    }
    set_bet_obj_value( obj);
  } 
  return Object.keys(mid_obj);
}
/**
 * @description: 串关失效投注项的个数
 * @param {Object} that 视图对象
 * @return {number} 
 */
const get_deactive_count = (that) => {
  let bet_obj,count = 0;
  try{
    bet_obj = _.get(that,'vx_get_virtual_bet_obj',{});
    if(_.isEmpty(bet_obj)) {
      return count;
    }
    for(let obj of Object.values(bet_obj)) {
      let active = 1;
      let cs = _.get(obj,'cs',false);
      if (cs) {
        // 赛事盘口状态
        let match_status = cs.match_status;
        // 盘口状态
        let handicap_status = cs.handicap_status;
        // 投注项状态
        active = cs.active;
        // console.log(`=========get_deactive_count=====match_status:${match_status}=====handicap_status:${handicap_status}=========active:${active}`);
        active = get_odds_active(match_status, handicap_status, active);
        if([2,3].includes(active)) {
          count++;
        }
        // console.log(`=========match_status:${match_status}=========handicap_status:${handicap_status}============active:${active}`);
      }
    }
  }catch(e) {
    count = 1000
    console.log(`====================获取异常count:${count}`);
  }  
  return count;
}

 /**
 * @description: 获取投注项状态
 * @param {Number} matchHandicapStatus 赛事盘口状态 0:active 开, 1:suspended 封, 2:deactivated 关, 11:锁
 * @param {Number} status 盘口状态0-5。 0：有效，1：暂停，2：停用，3：已结算，4：已取消，5：移交
 * @param {Number} active 投注项状态 1.开盘，2封盘，3关盘 ，4 锁盘
 * @return {Number} 投注项状态 1.开盘，2封盘，3关盘 ，4 锁盘
 */
 const get_odds_active = (matchHandicapStatus, status, active) => {
  var active_ = 1;
  // console.log(`matchHandicapStatus==${matchHandicapStatus}, ${status}, ${active}`);
  if (matchHandicapStatus) { // 赛事盘口有操作变化时
    if (matchHandicapStatus == 1) { //赛事封盘状态
      active_ = 2;
    } else if (matchHandicapStatus == 11) { //赛事锁盘
      if(active!=1){
        active_ = active;
      } else{
        active_ = 4;
      }
    } else if (matchHandicapStatus == 2 || matchHandicapStatus == 3 || matchHandicapStatus == 4 || matchHandicapStatus == 5) { //赛事关盘
      active_ = 3;
    }
    return active_;
  }

  if (status) { // 盘口有操作变化时
    if (status == 1) { //盘口封盘
      active_ = 2;
    } else if (status == 2 || status == 3 || status == 4 || status == 5) { //盘口关盘
      active_ = 3;
    } else if (status == 11) { //盘口锁盘
      active_ = 4;
    }
    return active_;
  }
  return active
}



/**
 * @description: 更新投注项信息
 * @param {Object} that 视图对象
 * @param {object} data 数据对象
 * @return {undefined}
 */
const update_bet_item_info = (vx_get_virtual_bet_obj, data) => {
  // console.log(data)
  _.forEach(data, item => {
    for(let key of Object.keys(vx_get_virtual_bet_obj)) { 
      if(!_.isEmpty(key)) {
        let clone_bet_obj = _.cloneDeep(_.get(vx_get_virtual_bet_obj,`${key}`));
        let cs = _.get(clone_bet_obj, 'cs', false);        
        if(cs && item.mid==cs.match_id) {
          let source = cs.source; 
          let obj = tidy_virtual_bet_item(clone_bet_obj, item, source);
          if(!item.teams) {
            item.teams = [item.mhn,item.man];
            obj.cs.home = item.mhn;
            obj.cs.away = item.man;
          } else {
            obj.cs.home = item.teams[0];
            obj.cs.away = item.teams[1];
          }
          clone_bet_obj.bs.tn = obj.bs.tn;      
          clone_bet_obj.bs.hps[0].hpn = obj.cs.play_name;          
          if($menu.menu_data.is_esports) {
            clone_bet_obj.bs.teams = item.teams;
            clone_bet_obj.bs.no = obj.bs.no;
            clone_bet_obj.bs.batch_no = obj.bs.batchNo;            
          }
          if(['details', 'match_details'].includes(source)) {
            clone_bet_obj.bs.hps[0].hl[0].ol[0].otv = obj.bs.hps[0].hl[0].ol[0].otv;
            clone_bet_obj.bs.hps[0].hl[0].ol[0].ott = obj.bs.hps[0].hl[0].ol[0].ott;   
          } 
          Object.assign(clone_bet_obj.cs, {...obj.cs});       
          set_bet_obj_value(clone_bet_obj);
        } 
      }
    }
  }); 
}
/**
 * @description: 整理投注项信息
 * @param {Object} cur_obj 当前vuex中的对象
 * @param {Object} bet_obj 接口查询后对应的投注项数据
 * @param {String} source  vuex中投注项的来源
 * @return {Object} 返回需要更新的投注项对象数据
 */
 const tidy_virtual_bet_item = (cur_obj, bet_obj, source) => {
  let obj = {bs:{}, cs:{}}, item_obj, hps, hl, ol, bet_omit_obj = {},           
      // fields为组合赛事需要保留的对象字段 hps
      fields =  ["csid","mid","tid","msc","tn","no","mmp","tlev","ms","mgt","mcg","mhs", "teams", "batchNo"], 
      hps_fields = ["hpid","hpn","hsw","title","hl", "hps"], 
      hl_fields = ["hid","hmt","hs","hv","hn","ol"],
      ol_fields = ["oid", "on", "ov", "obv", "otd", "otv","ott"];
      // 深度复制对象
    item_obj = _.clone(bet_obj);
    for(let [key, value] of Object.entries(item_obj)){
      if(fields.includes(key)) {
        bet_omit_obj[key] = value;
      }
    }
    hps = _.cloneDeep([item_obj.play]);
    hl = _.cloneDeep(hps[0].hl);
    ol = _.cloneDeep(hps[0].hl[0].ol);

    bet_omit_obj.hps = _.cloneDeep([item_obj.play]);
    for(let [key, value] of Object.entries(item_obj)){
      if(fields.includes(key)) {
        bet_omit_obj[key] = value;
      }
    }

    for(let key of Object.keys(hps[0])) {
      if(!hps_fields.includes(key)) {
        delete bet_omit_obj.hps[0][key];
      }
    }
    for(let key of Object.keys(hl[0])) {
      if(!hl_fields.includes(key)) {
        delete bet_omit_obj.hps[0].hl[0][key];
      }
    }
    for(let key of Object.keys(ol[0])) {
      if(!ol_fields.includes(key)) {
        delete bet_omit_obj.hps[0].hl[0].ol[0][key];
      }
    }
    // 如果来源是赛事列表:match_list,热门推荐:hot,近期关注:recent
    if(!['details', 'match_details'].includes(source)) {
      let cur_home = _.trim(_.get(cur_obj, 'bs.teams[0]'));
      let cur_away = _.trim(_.get(cur_obj, 'bs.teams[1]'));
      let cur_on = _.trim(_.get(cur_obj,'bs.hps[0].hl[0].ol[0].on', ''));
      let hv = _.get(cur_obj, 'bs.hps[0].hl[0].hv');
      let hpid = _.get(cur_obj, 'bs.hps[0].hpid');
      if((hv || hv=='0') && !hv.includes('/')) {
        hv = Math.abs(hv);
      } else if(hv && (hv.startsWith('+') || hv.startsWith('-'))) {
        hv = hv.replace('+','');
        hv = hv.replace('-','');
      }if(cur_on==cur_home) { // on值为主队
        bet_omit_obj.hps[0].hl[0].ol[0].on = _.get(item_obj, 'teams[0]');
        bet_omit_obj.hps[0].hl[0].ol[0].ots = "T1"
      } else if (cur_on==cur_away) {// on值为客队
        bet_omit_obj.hps[0].hl[0].ol[0].on = _.get(item_obj, 'teams[1]');
        bet_omit_obj.hps[0].hl[0].ol[0].ots = "T2"
      } else if(cur_on==hv || cur_on==`+${hv}` || cur_on==`-${hv}`) {//on值包含了盘口
        bet_omit_obj.hps[0].hl[0].ol[0].on = cur_on;
      } else if(hv && cur_on.startsWith(cur_home) && cur_on.endsWith(hv) && cur_on.endsWith(hv) && [...play_mapping.VIRTUAL_PLAY_LET_BALL,
        ...play_mapping.ESPORTS_PLAY_LET_BALL].includes(hpid)) {//on值包含了主对名称和盘口
        let arr = cur_on.split(' '), len = arr.length;
        bet_omit_obj.hps[0].hl[0].ol[0].on = `${_.get(item_obj, 'teams[0]')} ${arr[len-1]}`;
      } else if(hv && cur_on.startsWith(cur_away) && cur_on.endsWith(hv) && [...play_mapping.VIRTUAL_PLAY_LET_BALL,
        ...play_mapping.ESPORTS_PLAY_LET_BALL].includes(hpid)) {//on值包含了客对名称和盘口
        let arr = cur_on.split(' '), len = arr.length;
        bet_omit_obj.hps[0].hl[0].ol[0].on = `${_.get(item_obj, 'teams[1]')} ${arr[len-1]}`;
      } else {
        let otv = _.get(ol,'0.otv',''), ott = _.get(ol,'0.ott','');
        if(otv!=ott) {
          if(otv.includes(ott)) {
            bet_omit_obj.hps[0].hl[0].ol[0].on = otv;
          } else {
            bet_omit_obj.hps[0].hl[0].ol[0].on = ott;
          }
        }
      }
    } else {
      bet_omit_obj.hps[0].hl[0].ol[0].otv = _.get(ol,'0.otv','');
      bet_omit_obj.hps[0].hl[0].ol[0].ott = _.get(ol,'0.ott','');
      bet_omit_obj.hps[0].hl[0].ol[0].on = _.get(ol,'0.on','');
    }
    Object.assign(obj.bs,{...bet_omit_obj});
    obj.cs = {
      play_name: _.get(bet_omit_obj, 'hps[0].hpn') //玩法名称
    };
    return obj;
}
/**
* @description: 判断是否还有失效的投注项
* @param {Object} that 视图对象
* @return {undefined}
*/
const has_disable_item = (vx_get_virtual_bet_obj,vx_get_virtual_bet_list) => {
  let index, mhs, hs, active,serial_type;
  index = _.findIndex(vx_get_virtual_bet_list, (item) => {
    mhs = _.get(vx_get_virtual_bet_obj,`${item}.cs.match_status`, 0) * 1;
    hs = _.get(vx_get_virtual_bet_obj,`${item}.cs.handicap_status`, 0) * 1;
    active = _.get(vx_get_virtual_bet_obj,`${item}.cs.active`, 1) * 1;
    serial_type = _.get(vx_get_virtual_bet_obj,`${item}.cs.serial_type`, 1) * 1;
    return [1,2].includes(mhs) || [1,2].includes(hs) || [2,3].includes(active) || serial_type !== 1;
  });
  return index > -1;
}
/**
 * @description: 将比分数组转换成对象中指定格式
 * @param {Array} msc 比分
 * @param {String} score_type 比分默认为S1
 * @return {Object} msc 合并后的新比分对象 
 */
 const msc_array_obj = (msc,score_type) => {
  let score_obj = {};
  if (msc instanceof Array) {    
    msc.forEach(msc_item=>{
      let check_msc_item =  msc_item && msc_item.includes('|') && msc_item.includes(':');
      if(check_msc_item) {
        let msc_arr = msc_item.split('|');
        if(!_.isEmpty(msc_arr[0])&&!_.isEmpty(msc_arr[1])) {
          score_type = msc_arr[0];
          let team = msc_arr[1];
          let home = team.split(':')[0] ||'0';
          let away = team.split(':')[1] ||'0';
          let obj = {};
          obj[score_type] = {
            home,
            away
          }  
          //统计面板百分比计算
          if (["S17", "S18"].includes(score_type)) {
            obj[score_type].percentage = parseInt(
              (parseInt(obj[score_type].home) /
                (
                  parseInt(obj[score_type].home) +
                  parseInt(obj[score_type].away)
                ).toFixed(2)) *
                100
            );
          } else {
            obj[score_type].percentage = parseInt(
              (parseInt(obj[score_type].away) /
                (
                  parseInt(obj[score_type].home) +
                  parseInt(obj[score_type].away)
                ).toFixed(2)) *
                100
            );
          }      
          Object.assign(score_obj, obj);
        }
      }
    });
  }
  return score_obj;
}
/**
 * @description: 更新投注项对象
 * @param {Object} that 视图对象
 * @return {undefined} undefined
 */
const upd_bet_obj = (that, timestap, mid) => {
  return;
  // 如果是单关并且单关正在处理投注阻止数据合并 或者如果是串关且串关正在投注中,阻止数据合并
  if (!mid ||  that.vx_get_is_virtual_handle) {
    return;
  } 
  let bet_obj;
  _.forEach(that.vx_get_virtual_bet_list, item=>{
    if(item) {
      bet_obj = _.cloneDeep(_.get(that,'vx_get_virtual_bet_obj'));
      let match_id = _.get(bet_obj, `${item}.cs.match_id`, '');
      // 为同一场赛事则进行投注项更新
      if(match_id==mid) {
        upd_bet_obj_item(that, bet_obj, item, timestap);
      }
    }
  });
}
/**
 * @description: 更新投注项对象
 * @param {Object} that 视图对象
 * @param {Object} bet_obj 更新的目标对象
 * @param {String} item 投注项id
 * @return {undefined} undefined
 */
const upd_bet_obj_item = (that,bet_obj,item, handle_time) => {
  /* console.log(`==========upd_bet_obj_item=========>socket_name:${that.socket_name}`);
  console.log(`===================================${that.vx_layout_cur_page.cur}`); */
  if((that.vx_layout_cur_page.cur=='home' && that.socket_name=='match_list') || ['hot','details'].includes(that.socket_name)) {  
    let id = item, kid, oid, sport_id, bs = _.cloneDeep(_.get(bet_obj,`${id}.bs`)), cs = _.cloneDeep(_.get(bet_obj,`${id}.cs`)), obj = {"key":item, "bs":{}, "cs":{} },hl_obj, ol_obj, play_id, hn, ot, score_type='S1';  
    if (!bs || !cs ) {
      return;
    } 
    try {
      play_id = _.get(bs,'hps[0].hpid');
      sport_id = _.get(bs,'csid');
      hn = _.get(bs, 'hps[0].hl[0].hn', '');
      ot = _.get(bs, 'hps[0].hl[0].ol[0].ot', '');  
      if (that.socket_name=='match_list') { // 赛事列表
        // item如果是oid则必然坑位hn_obj通过id拿不到对象,所以可以再去ol_obj中去拿
        if(cs.kid==id) {      
          kid = id;
          ol_obj =  _.cloneDeep(_.get(that,`match_list_data.hn_obj.${id}`));
          if(_.isObject(ol_obj)) {
            oid = _.get(ol_obj,'oid','');  
          }
        } else {
          oid = id;
          ol_obj = _.cloneDeep(_.get(that,`match_list_data.ol_obj.ol_${oid}`));
          if(_.isObject(ol_obj)) {
            kid = _.get(ol_obj,'_hn','');
          }
        }  
        if(_.isEmpty(ol_obj)) return;
        // console.log('赛事列表更新投注项:', { kid, oid });
        hl_obj = _.cloneDeep(_.get(that, `match_list_data.hl_obj.hid_${_.get(ol_obj,'_hid')}`,{}));
      } else if (that.socket_name=='details') { // 赛事详情
        // item如果是oid则必然坑位hn_obj通过id拿不到对象,所以可以再去ol_obj中去拿
        if(cs.kid==id) {      
          kid = id
          ol_obj =  _.cloneDeep(_.get(that,`match_info_ctr.hn_obj.${id}`));
          if(_.isObject(ol_obj)) {
            oid = _.get(ol_obj,'oid','');  
          }
        } else {
          oid = id;
          ol_obj = _.cloneDeep(_.get(that,`match_info_ctr.ol_obj.${oid}`));
          if(_.isObject(ol_obj)) {
            kid = _.get(ol_obj,'_hn','');
          }
        }  
        if(_.isEmpty(ol_obj)) return;  
        hl_obj = _.cloneDeep(_.get(that,`match_info_ctr.hl_obj.${_.get(ol_obj,'_hid')}`,{}));
      } else if (that.socket_name=='hot') { // 热门赛事以及最近访问
        // item如果是oid则必然坑位hn_obj通过id拿不到对象,所以可以再去ol_obj中去拿
        if(cs.kid==id) {      
          kid = id
          ol_obj =  _.cloneDeep(_.get(that,`hn_obj.${id}`));
          if(_.isObject(ol_obj)) {
            oid = _.get(ol_obj,'oid','');  
          }
        } else {
          oid = id;
          ol_obj = _.cloneDeep(_.get(that,`ol_obj.${oid}`));
          if(_.isObject(ol_obj)) {
            kid = _.get(ol_obj,'_hn','');
          }
        }  
        if(_.isEmpty(ol_obj)) return;
        hl_obj = _.cloneDeep(_.get(that,`hl_obj.${_.get(ol_obj,'_hid')}`, {}));
      } 
      if(_.isEmpty(hl_obj) || 
        (hn && (_.isObject(hl_obj) && _.get(hl_obj,'hpid') != play_id) || 
        (ol_obj && ol_obj.ot != ot)) ||
        (handle_time && cs.handle_time > handle_time)
        ) return;
      let item_obj = _.cloneDeep({...bs}), target_side = _.get(item_obj, 'hps[0].hl[0].ol[0].ots', ''), handicap_value, handicap_value_old = cs.handicap_value, odds_value, odds_value_old = cs.odds_value, home_score = 0, away_score = 0, active, hv_ov_change_old = _.get(cs, "hv_ov_change", false), hv_ov_change = false, msc_obj;

      item_obj.hps[0].hl = _.cloneDeep([hl_obj]);
      item_obj.hps[0].hl[0].ol = _.cloneDeep([ol_obj]);  
      handicap_value = _.get(hl_obj,'hv');      
      if(that.socket_name=='details') {
        let play_obj = _.get(that,`match_info_ctr.pl_obj.${play_id}`, {});
        if(_.has(play_obj,'hps') && play_obj.hps.includes('|')) {
          score_type = play_obj.hps.split('|')[0];
        }
        handicap_value = _.get(ol_obj,'on','');
      }
      msc_obj = item_obj.msc;    
      if(msc_obj && _.isString(msc_obj)) {
        msc_obj = [msc_obj];
        msc_obj = msc_array_obj(msc_obj);
      } else if(_.isArray(msc_obj)) {
        msc_obj = msc_array_obj(msc_obj);
      }
      if(_.isEmpty(msc_obj)) {
        msc_obj[score_type] = {
          home: '0',
          away: '0'
        }
      }  
      if(msc_obj && _.get(msc_obj,`${score_type}`)) {
        home_score = _.get(msc_obj,`${score_type}.home`, '0');
        away_score = _.get(msc_obj,`${score_type}.away`, '0');
      } else {
        home_score = '0';
        away_score = '0';
      }    
      item_obj.mhs = ol_obj._mhs;
      item_obj.hps[0].hl[0].hs=ol_obj._hs;
      odds_value = _.get(ol_obj,'ov');
      active = get_odds_active(_.get(ol_obj, '_mhs'), _.get(ol_obj, '_hs'),  _.get(ol_obj, 'os'));
      // C303,C304拉取接口,如果hv_ov_change在vuex中还是true说明提示还没有结束,应该继续维持hv_ov_change=true
      if((hn && handicap_value_old!=handicap_value && odds_value_old != odds_value) || hv_ov_change_old) {
        hv_ov_change = true;
      }
      Object.assign(obj, {
        key: id,
        bs: item_obj,
        cs: {
          id,  // 投注项id
          oid, // 投注项oid
          kid, // 坑位id
          match_id: _.get(ol_obj,'_mid'), // 赛事id
          handicap_id: _.get(ol_obj,'_hid'), //盘口id
          play_id, //玩法id
          sport_id: _.get(item_obj,'csid'), //球种
          match_status: _.get(ol_obj,'_mhs'), //赛事盘口状态
          handicap_value, // 盘口      
          handicap_status:_.get(ol_obj,'_hs'), //盘口状态 
          odds_value, //赔率
          active:_.get(ol_obj, 'os'), // 投注项状态
          play_name: _.get(item_obj,'hps[0].hpn',''), //玩法名称
          odds_switch: _.get(item_obj,'hps[0].hsw',''), //支持的赔率转换模板
          break_odds_value:_.get(ol_obj,'obv'), //断档赔率
          target_side, //T1,T2
          score_type,
          home_id: _.get(item_obj, 'mhid'), // 主队id
          home: _.get(item_obj, 'mhn'), //主队
          home_score, // 主队得分
          away_id: _.get(item_obj, 'maid'), // 客队id
          away: _.get(item_obj, 'man'), //客队
          away_score, // 客队得分
          effect: ['1','4'].includes(`${active}`), // 是否有效
          full_bet: 0, //是否满额投注，1：是，0：否
          money: _.get(cs,'money'), // 投注额
          win_money: _.get(cs,'win_money',''), // 可赢额
          min_money: _.get(cs,'min_money',''), // 最大值
          max_money: _.get(cs,'max_money',''), // 最小值
          source: _.get(that,'socket_name', ''),
          match_type: _.get(cs, 'match_type',''), // 赛事类型
          market_type: _.get(cs, 'market_type',''), // 盘口类型
          hv_ov_change, // 盘口值与赔率是否一起变化
          handle_time,
          serial_type:_.get(cs,'serial_type',true), // 是否可以进行串关
          match_update:_.get(cs, 'match_update', false)
        }
      });
      useMittEmit(MITT_TYPES.EMIT_VITTUAL_BET_OBJ_ADD,obj)
    } catch (error) {
      console.log(error)
    }
  }
}
export {
  sync_bet_obj,
  update_bet_item_status,
  get_team_name,
  reset_hadicap_change,
  reset_odds_handicap_change,
  reset_message_info,
  delay_reset_message,
  init_message,
  check_result_msg,
  del_bet_item,
  get_sport_id,
  get_hv_ov_change,
  get_play_id,
  get_play_name,
  get_numbers,
  get_odds_value,
  get_handicap_id,
  get_handicap,
  get_active,
  update_odds_info,
  play_name_mapping,
  set_bet_obj_value,
  get_bet_obj,
  get_id,
  get_oid,
  get_kid,
  get_season,
  get_serial,
  get_no,
  get_batch_no,
  check_mix,
  get_deactive_count,
  update_bet_item_info,
  has_disable_item,
  msc_array_obj,
  upd_bet_obj,
  upd_bet_obj_item
}