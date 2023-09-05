
import {  MenuData  } from "src/core/index.js";
import {  PageSourceData  } from "src/core/index.js";
import UserCtr from  "src/core/user-config/user-ctr.js";
import BetData from "./class/bet-data-class.js";
import { compute_value_by_cur_odd_type } from "src/core/format/module/format-odds-conversion-mixin.js";
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
 * @description: 获取投注一方的队名
 * @return {String} 队伍名称
 */
const get_team_name = ( ) => {

    //获取当前下注对象数据
    let bet_obj = BetData.is_bet_single? _.get(  BetData.bet_single_obj,`bet_single_obj.${BetData.item_cs_id}`):_.get( BetData.bet_ob,`get_bet_obj.${BetData.item_cs_id}`),      team_name = '',hpid='', handicap='';
    if(_.has(bet_obj,'bs') && _.has(bet_obj,'cs')) {
      // target_side值为T1是主队 T2是客队
      let item_cs = bet_obj.cs,item_bs = bet_obj.bs,target_side =  _.get(item_cs, 'target_side');
      if(target_side=='T1') {
        team_name = _.get(item_bs, 'mhn', '');
      } else if(target_side=='T2') {
        team_name = _.get(item_bs, 'man', '');
      }
      // hpid玩法id handicap_value 
      hpid = `${_.get(item_bs, 'hps[0].hpid') || _.get(item_bs, 'hps[0].hl[0].ol.hpid')}`;
      //盘口值
      handicap = _.get(item_cs, 'handicap_value');
      // 以下逻辑同 列表中tips的显示逻辑 非赛事详情（没有T1,T2）
      if(item_cs.source == 'is_chat_room'){//聊天室
        // team_name = `${team_name} ${_.get(item_bs, 'hps[0].hl[0].ol.ott')}`;
        if (_.get(item_bs, 'hps[0].hl[0].ol.otv')) {
          team_name = `${_.get(item_bs, 'hps[0].hl[0].ol.otv')}`
          }else{
            team_name = `${team_name} ${_.get(item_bs, 'hps[0].hl[0].ol.ott')}`;
          }
          
      }else//非聊天室
      if(!['details','match_details'].includes(item_cs.source)) {
        // 让球玩法数组中PLAY_LET_BALL中包含的则显示队伍名称与盘口值 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
        if(play_mapping.PLAY_LET_BALL.includes(hpid)) {
          team_name = `${team_name} ${_.get(item_bs, 'hps[0].hl[0].ol[0].on')}`;
        }else if(['341','342'].includes(hpid)) {
          let arr = _.get(item_bs, 'hps[0].hl[0].ol[0].on', '') || _.get(item_bs, 'hps[0].hl[0].ol[0].ot');
          if(arr.split(':').length > 1){
            team_name = arr.split(':')[0] + '' + '-' + arr.split(':')[1];  
          }else{
            team_name = arr;
          }
          
        }
        // 进球玩法
         else if(!play_mapping.PLAY_GOAL.includes(hpid) ||(play_mapping.PLAY_GOAL.includes(hpid) && target_side=='')) {//如果不在进球玩法中且target_side值不存在
          team_name = _.get(item_bs, 'hps[0].hl[0].ol[0].on') || _.get(item_bs, 'hps[0].hl[0].ol[0].ot');
           //on没取到就去取ot 这个是玩法id为7得时候会取到ot，然后把冒号替换成-  这里做个标记5分钟可能改动这里
          if(team_name.indexOf(':') > -1 && !['361', '362'].includes(hpid)){
            team_name = team_name.split(':')[0] + '' + '-' + team_name.split(':')[1]
          }
        }
        //玩法名称存在 盘口存在 并且玩法id不是在PLAY_ALL_KINDS中包含 具体注释请见\user-pc\src\project\yabo\config\mapping\play_id_mapping.js
        if(team_name && handicap && handicap!='' && !play_mapping.PLAY_ALL_KINDS.includes(hpid)) {
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
          // 盘口值为正时
          if(team_name.endsWith(`+${handicap}`) || _.trim(team_name) ==`+${handicap}`) {
            let len2 = `+${handicap}`.length;
            team_name = team_name.substr(0,(len1-len2)); // 去掉盘口值(获取玩法名称)
          } else if (team_name.endsWith(`${handicap}+`) || _.trim(team_name) ==`${handicap}+`) { // 盘口值以+结尾(例如:进球数玩法最后一个投注项为3+)
            let len2 = `${handicap}+`.length;
            team_name = team_name.substr(0,(len1-len2)); // 去掉盘口值(获取玩法名称)
          } else if (team_name.endsWith(`-${handicap}`) || _.trim(team_name) ==`-${handicap}`) {   // 盘口值为负数时
            let len2 = `-${handicap}`.length;
            team_name = team_name.substr(0,(len1-len2));  // 去掉盘口值(获取玩法名称)
          } else if (team_name.endsWith(`${handicap}-`) || _.trim(team_name) ==`${handicap}-`) { // 盘口值以-结尾(暂无此种场景)
            let len2 = `${handicap}-`.length;
            team_name = team_name.substr(0,(len1-len2));
          } else if(team_name.endsWith(handicap) || _.trim(team_name) == handicap) { // 盘口值不带正负号且玩法名称就是盘口值
            let len2 = `${handicap}`.length;
            team_name = team_name.substr(0,(len1-len2)); // 相当月对盘口值去空即:team_name=""
          } else if(team_name.includes(`+${handicap}`)) {  // 队伍名称中包含盘口值
            team_name = team_name.replace(`+${handicap}`, '');
          } else if(team_name.includes(`-${handicap}`)) {   // 队伍名称中包含盘口值
            team_name = team_name.replace(`-${handicap}`, '');
          }
        }
      } else {
        //详情部分特殊玩法
        if(play_mapping.PLAY_RESULT.includes(hpid)){
          // 投注项显示值
          let on = _.get(item_bs, 'hps[0].hl[0].ol[0].on', '');
          // 投注时所需展示的信息
          let otv = _.get(item_bs, 'hps[0].hl[0].ol[0].otv', '');
          // 投注项类型
          let ot = _.get(item_bs, 'hps[0].hl[0].ol[0].ot', '');
          
          if(otv && on && otv.endsWith(on) && ![340,141,7,359,383].includes(hpid*1)) {
            team_name = _.get(item_bs, 'hps[0].hl[0].ol[0].ott', '');   
          }else if([7].includes(hpid*1)){
            team_name = _.get(item_bs, 'hps[0].hl[0].ol[0].on', '');
          }else  
          {
            team_name = _.get(item_bs, 'hps[0].hl[0].ol[0].otv', '');
            if([340,141].includes(hpid*1) && UserCtr.lang == 'zh') team_name = team_name.replace(/\s*/g,"");
          }
        } else {
          // 球员玩法id
          if(play_mapping.PLAYER_ID.includes(hpid)) {
            team_name = `${_.get(item_bs, 'hps[0].hl[0].ad2', '')}-${_.get(item_bs, 'hps[0].hl[0].ol[0].ott', '')}` ;
          } else {
            // 如果是详情部分则取ott字段进行投注项名称显示
            team_name = _.get(item_bs, 'hps[0].hl[0].ol[0].ott', '');
            if(_.isEmpty(team_name)) {
              team_name = _.get(item_bs, 'hps[0].hl[0].ol[0].on', '');
            }
          }
        }
      }
    }
   console.log('team_name===', team_name);
    return team_name;
  }
  
  