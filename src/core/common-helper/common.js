/*
 * @Author: Sword
 * @Date: 2020-08-04 17:13:50
 * @Description: 注部分公共方法提取(包括与列表,详情,投注项三部分)
 */
import play_mapping from "./play-mapping.js";
import _ from  "lodash";

/**
 * @description: 更新投注项状态
 * @param {Object} that 视图对象
 * @param {Object} obj 更新的对象
 * @return {undefined} undefined
 */
const update_bet_item_status = (that, obj) => {

  if ((that.vx_is_bet_single && that.vx_get_is_single_handle) || (!that.vx_is_bet_single && that.vx_get_is_handle)) {
    return;
  }
  let bet_obj = that.vx_is_bet_single? 'vx_get_bet_single_obj': 'vx_get_bet_obj',cs;
  for(let key of Object.keys(_.get(that, `${bet_obj}`, {}))) {
    bet_obj = _.cloneDeep(_.get(that,`${bet_obj}.${key}`, {}));
    cs = _.get(bet_obj, 'cs', {});
    if(!_.isEmpty(cs) && (obj.mid == cs.match_id &&(obj.hid == cs.handicap_id || obj.id == cs.id))) {
      update_target_obj(that, bet_obj, obj, key);
    }
  }
}
/**
 * @description: 更新Object对象(主要是在投注提交时,从后台拉取的方法更新了投注栏后,同步列表与详情对应的投注项对象)
 * @param {Object} that 视图对象
 * @param {Object} bet_obj 投注项对象
 * @param {Object} obj 传入更新的数据
 * @param {String} key 传入的id(可能是oid后续可能为坑位id)back
 * @return {undefined} undefined
 */
const update_target_obj = (that, bet_obj, obj, key) => {
  if(_.has(bet_obj,'bs') && _.has(bet_obj,'cs') && _.get(bet_obj,'cs.match_id')==obj.mid && _.get(bet_obj,'cs.handicap_id')==obj.hid && _.get(bet_obj,'cs.id')==obj.id) {
    bet_obj.bs.hps[0].hl[0].ol[0].os = obj.status;
    bet_obj.cs.active = obj.status;
    // console.log(`==========111=====update_target_obj====source:${bet_obj.cs.source}===obj:${JSON.stringify(obj)}`);
  } else if(bet_obj && bet_obj.bs && bet_obj.cs && bet_obj.cs.match_id==obj.mid && bet_obj.cs.handicap_id==obj.hid && key) {
    obj.id = key;
    bet_obj.bs.hps[0].hl[0].hs = obj.status;
    bet_obj.bs.hps[0].hl[0].ol[0]._hs = obj.status;
    bet_obj.cs.handicap_status = obj.status;
    // console.log(`===========222====update_target_obj====source:${bet_obj.cs.source}===obj:${JSON.stringify(obj)}`);
  } else if (_.has(bet_obj,'bs') && _.has(bet_obj,'cs') && _.get(bet_obj,'cs.match_id')==obj.mid && key && _.isEmpty(obj.hid)) {
    obj.id = key;
    bet_obj.bs.mhs = obj.status;
    bet_obj.bs.hps[0].hl[0].ol[0]._mhs = obj.status;
    bet_obj.cs.match_status = obj.status;
    // console.log(`==========333=====update_target_obj====source:${bet_obj.cs.source}===obj:${JSON.stringify(obj)}`);
  }
  if(bet_obj) {
    set_bet_obj_value(that, bet_obj);
  }
}
/**
 * @description: 盘口和赔率是否一起变化
 * @param {Object} that 视图对象
 * @return {boolean} 
 */
const get_hv_ov_change = (that) => {
  let bet_obj = that.vx_is_bet_single? _.get(that.vx_get_bet_single_obj,`${that.id}`):_.get(that,`.${that.id}`);
  if(_.has(bet_obj,'bs') && _.has(bet_obj,'cs')) {
    let bet_cs = bet_obj.cs;
    let hn = _.get(bet_obj, 'bs.hps[0].hl[0].hn');
    if(hn) {
      return _.get(bet_cs,'hv_ov_change', false);
    }
  }
  return false;
}
/**
 * @description: 获取比赛分数 格式: (主队比分-客队比分)
 * @param {Object} that 视图对象
 * @return {String} 比分的格式
 */
const get_score_info = (that) =>{
  let bet_obj = that.vx_is_bet_single? _.get(that,`vx_get_bet_single_obj.${that.id}`):_.get(that,`vx_get_bet_obj.${that.id}`);
  if(_.has(bet_obj,'bs') && _.has(bet_obj,'cs')) {
    let bet_bs = _.get(bet_obj,'bs',{});
    let bet_cs = _.get(bet_obj,'cs',{});
    let ms = bet_bs.ms; // 赛事状态
    let sport_id = bet_bs.csid;
    let play_id = bet_cs.play_id;
    let market_type = bet_cs.market_type;
    //console.log(`==============home_score:>>>>${bet_cs.home_score}================away_score:>>>${bet_cs.away_score}`);
    // 如果为足球(sport_id=1)已开赛(ms=1)且菜单在滚球盘(play)或者今日(today)日里面,PLAY_TODY_SCORE里面包含的玩法id则需要显示比分 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
    // market_type: 0滚球
    // 0未开赛，1 进行中
    if (ms != 0 &&
        market_type == 0 &&
        sport_id == '1' &&
        play_mapping.PLAY_TODAY_SCORE.includes(`${play_id}`)) {
      return `${_.get(bet_cs,'home_score', 0)}-${_.get(bet_cs,'away_score', 0)}`;
    }
  }
  return '';
}
/**
 * @description: 获取及时比分 格式: (主队比分-客队比分)
 * @param {Object} that 视图对象
 * @return {String} 比分的格式
 */
const get_timerly_score_info = (that) => {
  let bet_obj = that.vx_is_bet_single? _.get(that,`vx_get_bet_single_obj.${that.id}`):_.get(that,`vx_get_bet_obj.${that.id}`);
  if(_.has(bet_obj,'bs') && _.has(bet_obj,'cs')) {
    let bet_bs = _.get(bet_obj,'bs',{});
    let bet_cs = _.get(bet_obj,'cs',{});
    let ms = bet_bs.ms; // 赛事状态
    let timerly_home_score = _.get(bet_cs,'timerly_home_score');
    let timerly_away_score = _.get(bet_cs,'timerly_away_score')
    let market_type = bet_cs.market_type;
    if (ms != 0 && market_type == 0 && timerly_home_score && timerly_away_score) {
      return `${timerly_home_score}-${timerly_away_score}`;
    }
  }
  return '';
}
/**
 * @description: 获取玩法名称
 * @param {Object} that 视图对象
 * @return {String} 玩法名称
 */
const get_play_id = (that) => {
  let bet_obj = that.vx_is_bet_single? _.get(that,`vx_get_bet_single_obj.${that.id}`):_.get(that,`vx_get_bet_obj.${that.id}`);
  let cs = _.get(bet_obj, 'cs', false);
  return cs ? _.trim(cs.play_id) : '';
}
/**
 * @description: 获取玩法名称
 * @param {Object} that 视图对象
 * @return {String} 玩法名称
 */
const get_play_name = (that) => {
  let bet_obj = that.vx_is_bet_single? _.get(that,`vx_get_bet_single_obj.${that.id}`):_.get(that,`vx_get_bet_obj.${that.id}`);
  let cs = _.get(bet_obj, 'cs', false);
  return cs ? _.trim(cs.play_name) : '';
}
/**
 * @description: 赔率计算
 * @param {Object} that 视图对象
 * @param {String} id 传入的id(可能是oid后续可能为坑位id)
 * @return {Double} 赔率
 */
const get_odds_value = (that, id=(that.id||'')) => {
  let bet_obj = that.vx_is_bet_single?"vx_get_bet_single_obj":"vx_get_bet_obj", cs, ret = '';
  id = get_id(that, id);
  bet_obj = _.get(that, `${bet_obj}.${id}`, {});
  cs = _.get(bet_obj, 'cs', false);
  let odds_js = that.$mathjs.divide(cs.odds_value, 100000);
  let break_js = that.$mathjs.divide(cs.break_odds_value , 100000);
  if (!_.isEmpty(bet_obj) && cs) {
    ret = that.compute_value_by_cur_odd_type(
      odds_js,
      break_js,
      cs.odds_switch
    );
  }
  return ret;
}
/**
 * @description: 获取盘口值
 * @param {Object} that 视图对象
 * @return {String} 盘口值
 */
const get_handicap_id = (that) => {
  let bet_obj = that.vx_is_bet_single? _.get(that,`vx_get_bet_single_obj.${that.id}`):_.get(that,`vx_get_bet_obj.${that.id}`);
  if(!bet_obj || !bet_obj.cs) return '';
  return bet_obj.cs.handicap_id;
}
/**
 * @description: 获取盘口值
 * @param {Object} that 视图对象
 * @return {String} 盘口值
 */
const get_handicap = (that) => {
  let bet_obj = that.vx_is_bet_single? _.get(that,`vx_get_bet_single_obj.${that.id}`):_.get(that,`vx_get_bet_obj.${that.id}`),item_bs,item_cs,team_name='',handicap='',hpid, target_side;
  if(!_.has(bet_obj,'bs') || !_.has(bet_obj,'cs')) return '';
  item_bs = bet_obj.bs;
  item_cs = bet_obj.cs;
  if(item_cs && item_bs) {
    handicap = _.get(item_cs, 'handicap_value', '');
    hpid = `${_.get(item_cs, 'play_id')}`;
    if([340, 141,7, 341, 20].includes(hpid*1)){
      return '';
    }
    target_side = _.get(item_cs, 'target_side', '');
    console.log('正常投注参数playOptionName处理------------99',handicap,item_cs.source);
    console.log('正常投注参数playOptionName处理------------990',handicap,item_cs );
    // 1-1比分形式
    if(handicap && ((handicap.includes('-') && !handicap.startsWith('-') && !handicap.endsWith('-')) || that.$root.$t('list.other')== handicap) || (handicap && item_cs.source == 'is_chat_room')) {
      if (item_cs.source == 'is_chat_room') {
        const otv = _.get(item_bs, 'hps[0].hl[0].ol[0].otv', '');
        handicap =otv?'': _.get(item_bs, 'hps[0].hl[0].ol[0].on', '');
      }
      return handicap;
    }
    // 以下逻辑同 列表中tips的显示逻辑 非赛事详情
    if(!['details','match_details','is_chat_room'].includes(item_cs.source)) {
      // 让球玩法数组中PLAY_LET_BALL中包含的则显示队伍名称与盘口值 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
      if(play_mapping.PLAY_LET_BALL.includes(hpid) || !play_mapping.PLAY_GOAL.includes(hpid) || (play_mapping.PLAY_GOAL.includes(hpid) && target_side=='')) {
        team_name = `${_.get(item_bs, 'hps[0].hl[0].ol[0].on', '')}`;
      }
      //玩法名称存在 盘口存在 并且玩法id不是在PLAY_ALL_KINDS中包含 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
      if(team_name && handicap && handicap!='' && !play_mapping.PLAY_ALL_KINDS.includes(hpid)) {
        // 如果盘口存在且可以转化成数字,则去掉正负号后进行匹配(防止接口hv字段的盘口值与on或者otv字段中盘口值正负号不一致造成页面显示问题)
        if(!handicap.includes('/') && !isNaN(handicap)){
          if (handicap.includes('.')) { // 精度问题
            handicap = Math.abs(handicap).toFixed(1);
          } else {
            handicap = Math.abs(handicap);
          }
        } else if(handicap.includes('/') && (handicap.startsWith('+') || handicap.startsWith('-'))) {
          handicap = handicap.substr(1,handicap.length);
        }
        //以+结尾
        if(team_name.endsWith(`+${handicap}`) || _.trim(team_name) ==`+${handicap}`) {
          return `+${handicap}`;
        } else if (team_name.endsWith(`${handicap}+`) || _.trim(team_name) ==`${handicap}+`) {
          return `${handicap}+`;
        } else if (team_name.endsWith(`-${handicap}`) || _.trim(team_name) ==`-${handicap}`) {
          return `-${handicap}`;
        } else if (team_name.endsWith(`${handicap}-`) || _.trim(team_name) ==`${handicap}-`) {
          return `${handicap}-`;
        } else if(team_name.endsWith(handicap) || _.trim(team_name) ==handicap) {
          return handicap;
        } else if(team_name.includes(`+${handicap}`)) {
          return `+${handicap}`;
        } else if(team_name.includes(`-${handicap}`)) {
          return `-${handicap}`;
        }
      } else {
        if([7,20,74,341,342].includes(+hpid)){
          handicap = `${_.get(item_bs, 'hps[0].hl[0].ol[0].ot', '')}`;
          handicap = handicap.replace(':', '-')
        }else{
          handicap = '';
        }
      }
    } else {
      //如果是详情部分特殊玩法
      if(play_mapping.PLAY_RESULT.includes(hpid)){
        console.log('正常投注参数playOptionName处理------------991',handicap );
        //投注项显示值
        let on = _.get(item_bs, 'hps[0].hl[0].ol[0].on', '');
        //投注时所需展示的信息
        let otv = _.get(item_bs, 'hps[0].hl[0].ol[0].otv', '');
        //投注项类型
        let ot = _.get(item_bs, 'hps[0].hl[0].ol[0].ot', '');
        let hpid = _.get(item_bs, 'hps[0].hpid', '');
        if(otv && on && otv.endsWith(on)&& !['383','359'].includes(hpid) ) {
          handicap = _.get(item_bs, 'hps[0].hl[0].ol[0].on', '');
        }else {
          handicap = '';
        }
      } else {
        //盘口值
        let hv = _.get(item_bs, 'hps[0].hl[0].hv', '');
        // if(item_cs.source=="is_chat_room"){
        //   hv = _.get(item_bs, 'hps[0].hl[0].ol[0].hv', '')
        //   console.log(hv);

        // }

        console.log('正常投注参数playOptionName处理------------992',handicap,'****',hv,item_bs ,item_cs);
        console.log('正常投注参数playOptionName处理------------996',handicap,'****', JSON.stringify(_.get(item_bs, 'hps[0].hl[0].ol[0]')));
        if(hv || hv=='0') {

          handicap = _.get(item_bs, 'hps[0].hl[0].ol[0].on', '');
          console.log('正常投注参数playOptionName处理------------994',handicap,'****',hv);
          // 盘口中间不能包含‘-’ 不能以'+'结尾
          if(handicap && isNaN(parseFloat(handicap))) {
            handicap = '';
          }

        }
        // else if(['341', '342'].includes(hpid)){
        //   // handicap = _.get(item_bs, 'hps[0].hl[0].ol[0].ot', '');
        // }
        else {
          handicap = '';
        }
        console.log('正常投注参数playOptionName处理------------993',handicap,'****',hv);
      }
    }
  }
  //  console.log('handicap===', handicap);
  return handicap;
}
/**
 * @description: 获取投注项显示的状态
 * @param {Object} that 视图对象
 * @return {String} 显示的状态
 */
const get_active = (that) => {
  let bet_obj = that.vx_is_bet_single?_.get(that,`vx_get_bet_single_obj.${that.id}`):_.get(that,`vx_get_bet_obj.${that.id}`);
  let cs = _.get(bet_obj,'cs', false);
  let active = 3;
  if (cs) {
    // 赛事盘口状态
    let match_status = cs.match_status;
    // 盘口状态
    let handicap_status = cs.handicap_status;
    // 投注项状态
    active = cs.active;
    active = that.get_odds_active(match_status, handicap_status, active);
  }
  return active;
}
/**
 * @description: 获取冠军玩法联赛赛季名称
 * @param {Object} that 视图对象
 * @return {String} 赛季名称
 */
const get_season = (that) => {
  let bet_obj = that.vx_is_bet_single? _.get(that,`vx_get_bet_single_obj.${that.id}`):_.get(that,`vx_get_bet_obj.${that.id}`), season_name = '';
  if(_.has(bet_obj,'bs')) {
    let item_bs = bet_obj.bs;
    season_name = _.get(item_bs,'onTn','');
  }
  return season_name;
}
/**
 * @description: 是否可以进行串关
 * @param {*} that
 */
const get_serial = (that) => {
  let bet_obj = that.vx_get_bet_obj[that.id];
  return _.get(bet_obj, 'cs.is_serial', false);
}
const get_serial_type = (that) => {
  let bet_obj = that.vx_get_bet_obj[that.id];
  return _.get(bet_obj, 'cs.serial_type', false);
}












/**
 * @description: 获取数据源
 * @param {Object} that 视图对象
 * @return {String} 数据源类型
 */
const get_operate_type = (that) => {
  let bet_obj = that.vx_is_bet_single?_.get(that,`vx_get_bet_single_obj.${that.id}`):_.get(that,`vx_get_bet_obj.${that.id}`);
  let operate_type = _.get(bet_obj,'cs.operate_type','') || '';
  return operate_type;
}
/**
 * @Description:格式化字符串 小于10的数字 前面补0
 * @param {string} str 格式化前的字符串
 * @return {string} 格式化后的字符串
 */
const format_str = (str) => {
  return str < 10 ? "0" + str : str;
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
    that.timer_ = setTimeout(() => {
      // 复位赔率样式
      that.odds_change_up = false;
      that.odds_change_down = false;
      that.handicap_change = false;
      that.odds_status_change = false;
      let bet_obj = that.vx_is_bet_single?_.cloneDeep(_.get(that,`vx_get_bet_single_obj.${that.id}`,{})):_.cloneDeep(_.get(that,`vx_get_bet_obj.${that.id}`,{}));
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
  let bet_obj = that.vx_is_bet_single?_.cloneDeep(_.get(that,`vx_get_bet_single_obj.${that.id}`)):_.cloneDeep(_.get(that,`vx_get_bet_obj.${that.id}`));

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
/**
 * @description: 复位盘口及赔率的变换标志
 * @param {Object} that 视图对象
 * @param {Integer} delay 延迟多少毫秒
 * @return {undefined} undefined
 */
const delay_reset_message = (that, delay = 3000, callback) => {
  if (that.view_ctr_obj.timer_) {
    clearTimeout(that.view_ctr_obj.timer_);
    that.view_ctr_obj.timer_ = undefined;
  }
  if (delay) {
    let self = that
    that.view_ctr_obj.timer_ = setTimeout(() => {
      //复位盘口及赔率的变换标志
      reset_odds_handicap_change(self);
      init_message(self);
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
  if(["0400477","0400478"].includes(that.view_ctr_obj.error_code) || that.view_ctr_obj.input_max_flag == 1) return;
  // console.log('=====================init_messsage=============');
  let count = get_deactive_count(that);
  if(count > 0) return;
  that.view_ctr_obj.error_code = "";
  that.view_ctr_obj.error_message = "";
}
/**
 * @description: 检测提示信息
 * @param {Object} that  当前上下文
 * @param {string} type  单关还是串关
 * @param {number} money  金额
 * @return {undefined} undefined
 */
const check_result_msg = (that, type, money) => {
  // console.log('=====================check_result_msg=============');
  let count = get_deactive_count(that);
  if(count>0) return;
  //single_range_money取值说明 -2: 当前输入金额为空 -1: 当前输入金额小于最小值 1: 当前输入金额大于最大值 0: 在正常范围内
  type = (type == 'single')? that.view_ctr_obj.single_range_money : that.view_ctr_obj.mix_range_money
  switch(type) {
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
    case 1:
      // 输入金额超出最大限额
      that.view_ctr_obj.error_code = "M400011";
      break;
    case 2:
      //输入金额超出用户余额时
      that.view_ctr_obj.error_code = "M400013";
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
 * @description:更新赛事列表以及赛事详情的赔率(前端模拟C105进行发送) 目的: 解决赔率不同步问题
 * @param {Object} that 视图对象
 * @return {undefined} undefined
 */
const update_odds_info = (that) => {
  return;
  if (!that.id) return;
  if(window.ws) {
    let bet_obj = that.vx_is_bet_single? _.get(that,`vx_get_bet_single_obj.${that.id}`):_.get(that,`vx_get_bet_obj.${that.id}`);
    // console.log(`=========is_bet_single:${that.vx_is_bet_single}=========bet_obj:${JSON.stringify(bet_obj)}`);
    if(_.has(bet_obj,'bs') && _.has(bet_obj,'cs')) {
      let cs = _.get(bet_obj,'cs', {});
      let bs = _.get(bet_obj,'bs', {});
      let hps;
      //游戏和今日里面玩法
      if(play_mapping.PLAY_TODAY_SCORE.includes(cs.play_id) && _.has(cs,'score_type')) {
        hps = `${_.get(cs,'score_type')}|${_.get(cs,'home_score','0')}:${_.get(cs,'away_score','0')}`;
      }
      // 模拟发送C105用来同步项目各模块的投注项信息
       let cmd_obj = {
          "cd":{
            "mid": _.get(cs, 'match_id'),
            "send":"my_self", // 自定义属性send取值为my_self表示有用户模拟发送的指令
            "hls": [{
              "hid": _.get(cs, 'handicap_id'), // 盘口id
              "hpid": _.get(cs, 'play_id'), // 玩法id
              "hmt": _.get(cs, 'market_type'), // 盘口类型
              "hs":  _.get(cs, 'handicap_status'), // 盘口状态
              "mid": _.get(cs, 'match_id'), // 赛事id
              "hn": _.get(bs, 'hps[0].hl[0].hn'), // 坑位值
              "hps": _.isEmpty(_.get(cs,'score_type'))?'':hps, // 盘口比分
              "ol": [{
                "obv": _.get(cs, 'break_odds_value'), // 断档赔率
                "oid": _.get(cs, 'oid'), // 投注项oid
                "os": _.get(cs, 'active'), // 投注项状态
                "ot": _.get(bs, 'hps[0].hl[0].ol[0].ot'), // 投注项类型
                "ov": _.get(cs, 'odds_value') // 赔率
              }]
            }]
          },
          "ctsp": `${new Date().getTime()}`,
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
 * @description:更新赛事列表以及赛事详情的赔率(前端模拟C105进行发送) 目的: 解决赔率不同步问题
 * @param {Object} that 视图对象
 * @return {undefined} undefined
 */
 const update_odds_info2 = (obj) => {
  return;
  if(window.ws && !_.isUndefined(obj.mid) && !_.isNull(obj.mid)) {
    // console.log(`=========is_bet_single:${that.vx_is_bet_single}=========bet_obj:${JSON.stringify(bet_obj)}`);
     // 模拟发送C105用来同步项目各模块的投注项信息
     let cmd_obj = {
      "cd":{
        "mid": obj.mid,
        "send":"my_self",
      },
      "cmd":"C105"
    };
    // 赛事盘口状态
    if(!_.isUndefined(obj.mhs) && !_.isNull(obj.mhs)) {
      cmd_obj.cd.mhs = obj.mhs;
    }
    if(_.isArray(obj.marketList)) {
      let hls = [];
      _.forEach(obj.marketList, item => {
        let {
          marketType,
          placeNum,
          status,
          marketOddsList,
          score
        } = item,
        hl_item = { mid: obj.mid};
        // 盘口id
        if(!_.isUndefined(item.id) && !_.isNull(item.id)) {
          hl_item.hid = item.id;
        }
        // 玩法id
        if(!_.isUndefined(obj.playId) && !_.isNull(obj.playId)) {
          hl_item.hpid = obj.playId;
        }
        // 盘口类型
        if(!_.isUndefined(marketType) && !_.isNull(marketType)) {
          hl_item.hmt = marketType;
        }
        // 盘口状态
        if(!_.isUndefined(status) && !_.isNull(status)) {
          hl_item.hs = status;
        }
        // 坑位
        if(!_.isUndefined(placeNum) && !_.isNull(placeNum)) {
          hl_item.hn = placeNum;
        }
        // 对应玩法比分处理
        if(score && score.includes('|') && score.includes(':') && hl_item.hpid && hl_item.hpid==obj.playId) {
          // console.log(`===========111=====>>>>score:${score}`);
          let scoreBenchmark = score.split('|');
          let score_type = _.trim(scoreBenchmark[0]);
          if(!_.isEmpty(score_type)) {
            let scroe_array = scoreBenchmark[1].split(':');
            let home_score = scroe_array[0] || '0';
            let away_score = scroe_array[1] || '0';
            hl_item.hps = `${score_type}|${home_score}:${away_score}`;
          }
        }
        // 投注项部分处理
        if(_.isArray(marketOddsList)) {
          let ol = [];
          _.forEach(marketOddsList, ite=> {
            let {
              oddsStatus,
              oddsType,
              oddsValue
            } = ite,
            ol_obj = {};
            // 投注项oid
            if(!_.isUndefined(ite.id) && !_.isNull(ite.id)) {
              ol_obj.oid = ite.id;
            }
            // 投注项状态
            if(!_.isUndefined(oddsStatus) && !_.isNull(oddsStatus)) {
              ol_obj.os = oddsStatus;
            }
            // 投注项类型
            if(!_.isUndefined(oddsType) && !_.isNull(oddsType)) {
              ol_obj.ot = oddsType;
            }
            // 投注项类型
            if(!_.isUndefined(oddsValue) && !_.isNull(oddsValue)) {
              ol_obj.ov = oddsValue;
            }
            ol.push(ol_obj);
          });
          if(!_.isEmpty(ol)) {
            hl_item.ol = ol;
          }
        }
        // 盘口项不为空，则加入盘口hls数组中
        if(!_.isEmpty(hl_item)) {
          hls.push(hl_item);
        }
      });
      if(!_.isEmpty(hls)) {
        cmd_obj.cd.hls = hls;
      }
      // console.log(`模拟发送的C105:${JSON.stringify(cmd_obj)}`);
      window.ws.customWsCmdData(cmd_obj);
    }
  }
}
/**
 * @description:更新变化的盘口
 * @param {*} obj
 * @return {undefined} undefined
 */
const update_handicap = (obj) => {
  if(window.ws && !_.isUndefined(obj.mid) && !_.isNull(obj.mid)) {
    // 模拟发送C303用来同步项目各模块的投注项信息
    let cmd_obj = {
      "cd":{
        "mid": obj.mid,
        "csid": obj.csid,
        "hpid": obj.hpid,
        "send":"my_self",
      },
      "cmd":"C303"
    };
    console.log(`模拟发送的C303:${JSON.stringify(cmd_obj)}`);
    window.ws.customWsCmdData(cmd_obj);
  }
}
/**
 * @description: 模拟socket更新各模块的比分信息
 * @param {Object} that 视图对象
 * @return {undefined} undefined
 */
const update_match_score = (that, ctsp=0, mid) =>{
  if(window.ws) {
    let cur_match = _.get(that.match_list_data,`mid_obj.mid_${mid}`, {});
    // console.log(`==================msc_ctsp:${msc_ctsp}==============ctsp:${ctsp}`);
    // 当比分存在且是最新的数据则更新比分
    if(_.isArray(cur_match.msc) && !_.isEmpty(cur_match.msc)) {
      // 模拟发送C103 用来同步赛事列表,赛事详情等模块的比分
      let cmd_obj = {
        "cd":{
          "mid":mid,
          "send":"my_self",
          "csid":_.get(cur_match, 'csid'),
          "msc": cur_match.msc,
          'mpid': _.get(cur_match, 'mmp')
        },
        "cmd":"C103",
        "ts": ctsp
      }
      if(window.ws) {
        console.log('模拟发送的C103',{ ...cmd_obj });
        window.ws.customWsCmdData(cmd_obj);
      }
    }
  }
}
/**
 * @description: 更新比赛时间(目的是解决掉赛事详情页面赛事列表的赛事时间不同步问题)
 * @param {String} mid 赛事id
 * @param {Integer} time 时间
 * @return {undefined} undefined
 */
const update_match_time = (obj) => {
  if(!obj) return;
  // 发命令
  let cmd_obj = {
    "cd":{
      "send":"my_self"
    },
    "cmd":"C102"
  }
  if(obj.ctsp) {
    cmd_obj.ctsp = obj.ctsp;
    // 删除时间戳
    delete obj.ctsp;
  }
  for(let [key, value] of Object.entries(obj)) {
    cmd_obj.cd[key] = value;
  }
  if(window.ws) {
    // console.log('模拟发送的C102',{ ...cmd_obj });
    window.ws.customWsCmdData(cmd_obj);
  }
}

/**
 * @description: 球种名称与id对应关系
 * @param {String} csid 球种id
 * @return {Object} 映射的对象
 */
const play_name_mapping = (csid) => {
  let obj = {
    '1': '足球',
    '2': '篮球',
    '3': '棒球',
    '4': '冰球',
    '5': '网球',
    '6': '美式足球',
    '7': '斯诺克',
    '8': '乒乓球',
    '9': '排球',
    '10': '羽毛球',
    '11': '手球',
    '12': '拳击',
    '13': '沙滩排球',
    '14': '橄榄球',
    '15': '曲棍球',
    '16': '水球',
    '100': '英雄联盟',
    '101': 'dota2',
    '102': 'csgo',
    '103': '王者荣耀'
  };
  return obj[csid];
}
/**
 * @description: 比分合并
 * @param {Array} msc  原来的msc字段比分
 * @param {Object} skt_data 推送对象
 * @return {Array} msc 合并后的新比分数组
 */
const merge_msc_array = (msc, skt_data) => {
  // 使用对象临时存放比分
  let score_obj = {};
  for (let i = 0; i < msc.length; i++) {
    let msc_item = msc[i];
    let check_msc_item =  msc_item && msc_item.includes('|') && msc_item.includes(':');
    if (check_msc_item) {
      let mcs_item_arr = msc[i].split('|');
      // 将比分转换成 score_obj={"S1": "0:0"} 的格式(可以进行去重)
      score_obj[mcs_item_arr[0]] = mcs_item_arr[1];
      if (_.isArray(skt_data.msc)) {
        skt_data.msc.forEach(skt_item => {
          if (skt_item && skt_item.includes('|')) {
            let skt_item_arr = skt_item.split('|');
            if (mcs_item_arr[0] == skt_item_arr[0]) {
              score_obj[mcs_item_arr[0]] = skt_item_arr[1];
            } else {
              score_obj[skt_item_arr[0]] = skt_item_arr[1];
            }
          }
        });
      }
    }
  }
  msc = [];
  // 将比分对象重新组合成列表接口中msc中的格式
  for (let [key, value] of Object.entries(score_obj)) {
    let item = `${key}|${value}`;
    msc.push(item);
  }
  if (msc.length==0) {
    msc = skt_data.msc || [];
  }
  return msc;
}
/**
 * @description: 将比分转换成数组中指定格式
 * @param {Array} msc 比分
 * @return {Array} msc 合并后的新比分对象
 */
const msc_obj_arry = (msc) => {
  if (_.isArray(msc)) return msc;
  let arr = [],is_s1 = false;
  if(msc) {
    for (let [key, value] of Object.entries(msc)) {
      let obj = `${key}|${value.home}:${value.away}`;
      if(key=='S1') {
        is_s1 = true;
      }
      arr.push(obj);
    }
    // 如果不包含S1比分,则默认给0:0
    if(!is_s1) {
      arr.unshift('S1|0:0');
    }
  }
  return arr;
}
/**
 * @description: 将比分数组转换成对象中指定格式
 * @param {Array} msc 比分
 * @param {String} score_type 比分默认为S1
 * @return {Object} msc 合并后的新比分对象
 */
const msc_array_obj = (msc,score_type="S1") => {
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
            away,
            percentage: 0
          }
          if(!(home==0 && away==0)) {
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
          }
          Object.assign(score_obj, obj);
        }
      }
    });
  }
  return score_obj;
}


/**
 * @description: 比分格式处理(投注时用到)
 * @param {Array} msc 比分
 * @param {Integer} csid 球种id
 * @param {Integer} ms 赛事状态
 * @param {Integer} hpid 玩法id
 * @return {String} 比分格式为: (主队比分-客队比分)
 */
const calc_bifen = (msc, csid, ms, hpid) => {   //只有足球滚球展示基准分
  if (!msc[0] || csid != 1 || !ms || ms == 0) return "";
  let S;
  if (hpid == 128) {
    S = msc.toString().match(/S7\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 130) {
    S = msc.toString().match(/S701\|[0-9]+\:[0-9]+/);
  }
  if (hpid == 143) {
    S = msc.toString().match(/S3\|[0-9]+\:[0-9]+/);
  }
  if (['4','27','29','269','336'].includes(`${hpid}`)) {
    S = msc.toString().match(/S1\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 19) {
    S = msc.toString().match(/S2\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 113) {
    S = msc.toString().match(/S5\|[0-9]+\:[0-9]+/);
  }
  if(hpid == 121) {
    S = msc.toString().match(/S15\|[0-9]+\:[0-9]+/);
  }
  if (S) return S[0].split('|')[1];
  return "";
}
/**
 * @description: 同步投注项部分数据
 * @param {Object} that 视图对象
 * @param {Object} skt_data 推送的指令息体cd部分
 * @return {undefined} undefined
 */
const sync_bet_obj = (that,skt_data) => {
  let obj = that.vx_is_bet_single?"vx_get_bet_single_obj":"vx_get_bet_obj", bet_obj,hls=[];
  for(let key of Object.keys(that[obj])) {
    if(key) {
      bet_obj = that[obj][key];
      if(bet_obj && bet_obj.bs) {
        let hl =  _.get(bet_obj, 'bs.hps[0].hl');
        if(hl && hl.length) {
          hls.push(...hl);
        }
      }
    }
  }
  if(hls && hls.length && hls.length>0) {
    _.forEach(hls, item=>{
      if(item && item.hid) {
        console.log(`============common========sync_bet_obj======hid:${item.hid}`);
        update_bet_item_status(that,{
          mid: skt_data.mid,
          hid: skt_data.hid,
          status: skt_data.mhs
        });
      }
    });
  }
}
/**
 * @description: 根据oid或者坑位id获取投注项id
 * @param {Object} that 视图对象
 * @param {String} okid oid或者坑位id
 * @return {String} 投注项id
 */
const get_id = (that, okid) => {
  let id, bet_obj = that.vx_is_bet_single? 'vx_get_bet_single_obj':'vx_get_bet_obj';
  for(let [key, obj] of Object.entries(that[bet_obj])) {
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
const get_oid = (that, id) => {
  let oid = id, bet_obj = that.vx_is_bet_single? 'vx_get_bet_single_obj':'vx_get_bet_obj';
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
const get_kid = (that, id) => {
  let bet_obj = that.vx_is_bet_single? _.get(that,`vx_get_bet_single_obj.${id}`):_.get(that,`vx_get_bet_obj.${id}`), kid = "";
  if(_.has(bet_obj,'cs')) {
    kid = _.get(bet_obj,'cs.kid','');
  }
  return kid;
}
/**
 * @description: 根据投注项id,获取投注项对象
 * @param {Object} that 视图对象
 * @param {String} id 投注项id
 * @return {Object} 投注项
 */
const get_bet_obj = (that, id) => {
  let bet_obj = that.vx_is_bet_single? 'vx_get_bet_single_obj':'vx_get_bet_obj';
  for(let obj of Object.values(that[bet_obj])) {
    if(_.get(obj,'cs.oid')==id || _.get(obj,'cs.kid')==id) {
      bet_obj = obj;
      bet_obj.id = _.get(obj,'cs.id','');
      break;
    }
  }
  return bet_obj;
}


/**
 * @description: 倒计时补充
 * @param {*} that 试图
 * @param {Array} skt_data socket推送的消息体
 * @param {String} socket_name 接入的是那个地方的socket
 */
const match_fill_time = (that, skt_data, socket_name) => {
  if(_.isArray(skt_data)) {
    let len = skt_data.length;
    for(let i = 0; i < len; i++) {
      let item = _.get(skt_data,`[${i}]`, {});
      let cur_match;
      if(socket_name =='match_list' && _.get(that,`match_list_data.mid_obj.mid_${item.mid}`, false)) { // 赛事列表
        cur_match = _.get(that,`match_list_data.mid_obj.mid_${item.mid}`, {});
        if(item.msc) {
          let msc = _.cloneDeep(_.get(cur_match,'msc',[]));
          cur_match.msc = merge_msc_array(msc, skt_data);
          that.score_switch_handle(cur_match);
        }
      } else if (['details', 'match_details'].includes(socket_name) && _.get(that,'match_info_ctr.match_obj.mid')==_.get(item,'mid')) { // 赛事详情
        cur_match = _.get(that,`match_info_ctr.mid_obj.${item.mid}`, {});
          if(!_.isEmpty(item.msc)) {
            let score_obj = _.cloneDeep(_.get(cur_match,'msc',{}));
            score_obj = msc_array_obj(item.msc);
            item.msc = score_obj;
          }
      } else if (['hot','recent'].includes(socket_name) && _.get(that,`match_ctr.mid_obj.${item.mid}`,false)) { // 热门推荐，最近关注(专业版)
        cur_match = _.get(that,`match_ctr.mid_obj.${item.mid}`,{});
        let score_obj = _.cloneDeep(_.get(that,`match_ctr.mid_obj.${item.mid}.msc`, {}));
        item.msc.forEach(msc_item => {
          let check_msc_item =  msc_item && msc_item.includes('|') && msc_item.includes(':');
          if(check_msc_item) {
            let msc_arr = msc_item.split('|');
            let name = msc_arr[0];
            let team = msc_arr[1];
            let home = team.split(':')[0] || '0';
            let away = team.split(':')[1] || '0';
            let obj = {};
            obj[name] = {
              home,
              away
            }
            Object.assign(score_obj, obj);
          }
        });
        item.msc = score_obj;
      }
      Object.assign(cur_match, item);
      // 同步投注项数据
      update_odds_info(that);
    }
  }
}
/**
 * @description: 检查可否进行串关
 * @param {undefined} undefined
 * @return {undefined} undefined
 */
const check_mix = (that, match_list) => {
  let match_team= [],mid_obj = {}, bet_id_obj={};
  // 如果从外部没有传入match_list则取vuex中get_bet_list中的id
  if(!match_list) {
    match_list = _.get(that,'vx_get_bet_list',[]);
  }
  if(match_list == 1) {
    return [];
  }
  let len = match_list.length;
  for(let i = 0; i < len ; i++) {
    let obj = {}, id = match_list[i], item;
    item = _.get(that,`vx_get_bet_obj.${id}`,{});
    obj.id = id;
    obj.mid = _.get(item,'bs.mid','');
    // 放入该场赛事的两支球队id，如果提供了球员id则放入球员id
    obj.teams = [_.get(item,'bs.mhid', ''), _.get(item,'bs.maid', '')];
    match_team.push(obj);
  }
    // 两支球队进行比较
    let mlen = match_team.length - 1;
    for(let i = 0;i < mlen; i++) {
    let team1 = _.get(match_team,`[${i}].teams`);
    let mid1 = _.get(match_team,`[${i}].mid`);
    let id1 = _.get(match_team,`[${i}].id`);
    let obj = _.cloneDeep(_.get(that,`vx_get_bet_obj.${id1}`));
    // 恢复是否可以串关的标志
    if(obj && obj.cs) {
      obj.cs.is_serial = true;
    }
    set_bet_obj_value(that, obj);
    for(let j=i+1;j<match_team.length;j++) {
      let team2 = _.get(match_team,`[${j}].teams`);
      let mid2 = _.get(match_team,`[${j}].mid`);
      let id2 = _.get(match_team,`[${j}].id`);
      //两支球队进行比较,如果比较结果相同则result与team2相等，如果不同则result与team2不相等。
      let result = _.difference(team2, team1);
      if(!_.isEqual(result,team2)) {
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
    let obj = _.cloneDeep(_.get(that,`vx_get_bet_obj.${key}`));
    // 设置为不可串关
    if(obj && obj.cs) {
      obj.cs.is_serial = false;
    }
    set_bet_obj_value(that, obj);
  }
  return Object.keys(mid_obj);
}

/**
 * @description: 在语言切换时调用/v1/w/matchDetail/getOls接口后更新投注项信息(投注项部分国际化)
 * @param {Object} that 试图对象
 * @param {Array} data 接口查询后对应的投注项数据
 */
const update_bet_item_info = (that,data) => {
  let bet_obj;
  if(that.vx_is_bet_single){
    bet_obj = 'vx_get_bet_single_obj';
  } else {
    bet_obj = 'vx_get_bet_obj';
  }
  _.forEach(data, item => {
    for(let key of Object.keys(_.get(that, `${bet_obj}`, ''))) {
      if(!_.isEmpty(key)) {
        let clone_bet_obj = _.cloneDeep(_.get(that,`${bet_obj}.${key}`));
        let cs = _.get(clone_bet_obj, 'cs', false);
        if(cs && item.mid==cs.match_id) {
          let source = cs.source;
          let obj = tidy_bet_item_info(clone_bet_obj, item, source);
          let bs =  _.get(clone_bet_obj,'bs');
          bs.mhn = obj.bs.mhn;
          bs.man = obj.bs.man;
          // 联赛名称
          bs.tn = obj.bs.tn;
          // 数据源
          bs.cds = obj.bs.cds;
          // 球种
          bs.csna = obj.bs.csna;
          bs.hps[0].hpn = obj.bs.hps[0].hpn;
          let ol_obj = bs.hps[0].hl[0].ol[0];
          let bs_ol_obj = obj.bs.hps[0].hl[0].ol[0];
          bs.hps[0].hl[0].ol[0].on = bs_ol_obj.on;
          if(['details', 'match_details'].includes(source)) {
            bs.hps[0].title = obj.bs.hps[0].title;
            ol_obj.otv = bs_ol_obj.otv;
            ol_obj.ott = bs_ol_obj.ott;
          }
          Object.assign(clone_bet_obj.cs, {...obj.cs});
          set_bet_obj_value(that, clone_bet_obj);
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
const tidy_bet_item_info = (cur_obj, bet_obj, source) => {
  // fields 赛事层级需要组装的字段 hps_fields 玩法级需要组装的字段 hl_fields 盘口级需要组装的字段 ol_fields 投注项上的字段
  let obj = {bs:{}, cs:{}}, item_obj, hps, hl, ol, bet_omit_obj = {},
  // fields 赛事层级需要组装的字段
     fields =  ["csid","mid","tid","msc","tn","onTn","mmp","tlev","ms","mhid","mhn","maid","man","mgt","mcg","mhs","mf", "med", "seoy", "orpt", "_index"],
    //  hps_fields 玩法级需要组装的字段
    hps_fields = ["hpid","hpn","hsw","title","hl", "hps"],
    // hl_fields 盘口级需要组装的字段
    hl_fields = ["hid","hmt","hs","ad2","hv","hn","ol"],
    // ol_fields 投注项上的字段
    ol_fields = ["oid", "on", "ov", "obv", "otd", "otv","ott"];
    item_obj = _.clone(bet_obj);
    // 构建bet_omit_obj对象
    for(let [key, value] of Object.entries(item_obj)){
      if(fields.includes(key)) {
        bet_omit_obj[key] = value;
      }
    }
    // 玩法对象
    hps = _.cloneDeep([item_obj.play]);
    // 盘口对象
    hl = _.cloneDeep(hps[0].hl);
    // 投注项对象
    ol = _.cloneDeep(hps[0].hl[0].ol);
    bet_omit_obj.hps = _.cloneDeep([item_obj.play]);
    for(let [key, value] of Object.entries(item_obj)){
      if(fields.includes(key)) {
        bet_omit_obj[key] = value;
      }
    }
    // 删除多余的玩法字段
    for(let key of Object.keys(hps[0])) {
      if(!hps_fields.includes(key)) {
        delete bet_omit_obj.hps[0][key];
      }
    }
    // 删除多余的盘口字段
    for(let key of Object.keys(hl[0])) {
      if(!hl_fields.includes(key)) {
        delete bet_omit_obj.hps[0].hl[0][key];
      }
    }
    // 删除多余的投注项字段
    for(let key of Object.keys(ol[0])) {
      if(!ol_fields.includes(key)) {
        delete bet_omit_obj.hps[0].hl[0].ol[0][key];
      }
    }
    // 非详情部分的数组
    if(!['details', 'match_details'].includes(source)) {
      // 删除玩法层级title
      delete bet_omit_obj.hps[0].title;
      // vuex对象的主队名称
      let cur_home = _.trim(_.get(cur_obj, 'bs.mhn'));
      // vuex对象的客队名称
      let cur_away = _.trim(_.get(cur_obj, 'bs.man'));
      // vuex对象的投注项显示值
      let cur_on = _.trim(_.get(cur_obj,'bs.hps[0].hl[0].ol[0].on', ''));
      // vuex对象的盘口值
      let hv = _.get(cur_obj, 'bs.hps[0].hl[0].hv');
      // 盘口值并字段不包含‘/’
      if((hv || hv=='0') && !hv.includes('/')) {
        // 取绝对值
        hv = Math.abs(hv);
        // 盘口值+开头，-结尾，去除+-
      } else if(hv && (hv.startsWith('+') || hv.startsWith('-'))) {
        hv = hv.replace('+','');
        hv = hv.replace('-','');
      }
      // 投注项显示值跟主队名称一样
      if(cur_on==cur_home) { // on值为主队
        bet_omit_obj.hps[0].hl[0].ol[0].on = _.get(item_obj, 'mhn');
        bet_omit_obj.hps[0].hl[0].ol[0].ots = "T1"
      // 投注项等于客队
      } else if (cur_on==cur_away) {// on值为客队
        bet_omit_obj.hps[0].hl[0].ol[0].on = _.get(item_obj, 'man');
        bet_omit_obj.hps[0].hl[0].ol[0].ots = "T2"
      // 投注项等于盘口值
      } else if(cur_on==hv || cur_on==`+${hv}` || cur_on==`-${hv}`) {//on值包含了盘口
        // 投注数据的投注项显示值更新为投注主队数据
        bet_omit_obj.hps[0].hl[0].ol[0].on = cur_on;
        // 有盘口值，而且投注项显示值以主队开头，以盘口值结尾
      } else if(hv && cur_on.startsWith(cur_home) && cur_on.endsWith(hv)) {//on值包含了主对名称和盘口
        let arr = cur_on.split(' '), len = arr.length;
        // 投注数据的投注项显示值以客队和盘口值拼接
        bet_omit_obj.hps[0].hl[0].ol[0].on = `${_.get(item_obj, 'mhn')} ${arr[len-1]}`;
        // 有盘口值，而且投注项显示值以客队开头，以盘口值结尾
      } else if(hv && cur_on.startsWith(cur_away) && cur_on.endsWith(hv)) {//on值包含了客对名称和盘口
        let arr = cur_on.split(' '), len = arr.length;
        // 投注数据的投注项显示值以主队和盘口值拼接
        bet_omit_obj.hps[0].hl[0].ol[0].on = `${_.get(item_obj, 'man')} ${arr[len-1]}`;
      } else {
        let otv = _.get(ol,'0.otv',''), ott = _.get(ol,'0.ott','');
        if(otv!=ott) {
          // 投注时所需展示的信息
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
      play_name: _.get(bet_omit_obj, 'hps[0].hpn'), //玩法名称
      home: _.get(bet_omit_obj, 'mhn'), //主队
      away: _.get(bet_omit_obj, 'man') //客队
    };
    return obj;
}


/**
 * @description:
 * @param {*} el dom元素  attr 要获取值的属性
 * @return {*}
 */
const get_refs_info = (el, attr, _this = null) => {
  let __this = _this || this;
  let _ref = __this.$refs || null;
  if (!el || !_ref) {return;}
  if (attr) {
    return _ref[el][attr] || null;
  } else {
    return _ref[el] || null;
  }
}
/**
 *
 * @param {*} el
 * @returns
 */
const query_selector = (el) => {
  return document.querySelector(el);
}
const remove_invalid_item = () => {

}
export {
  update_bet_item_status,
  // get_team_name,
  get_operate_type,
  format_str,
  reset_hadicap_change,
  reset_odds_handicap_change,
  reset_message_info,
  delay_reset_message,
  init_message,
  check_result_msg,
  // del_bet_item,
  update_match_score,
  get_hv_ov_change,
  get_score_info,
  get_timerly_score_info,
  get_play_id,
  get_play_name,
  get_odds_value,
  get_handicap_id,
  get_handicap,
  get_active,
  update_odds_info,
  update_odds_info2,
  update_handicap,
  update_match_time,
  play_name_mapping,
  merge_msc_array,
  msc_obj_arry,
  msc_array_obj,
  // update_bet_score,
  calc_bifen,
  // set_bet_obj_value,
  sync_bet_obj,
  get_bet_obj,
  get_id,
  get_oid,
  get_kid,
  // upd_bet_obj,
  get_season,
  match_fill_time,
  check_mix,
  get_serial,
  get_serial_type,
  // get_deactive_count,
  update_bet_item_info,
  // has_disable_item,
  // get_bet_scroll_top,
  get_refs_info,
  query_selector,
  remove_invalid_item
}
