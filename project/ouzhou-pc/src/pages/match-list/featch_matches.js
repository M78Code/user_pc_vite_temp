/*
 * @Author         : lane jstylane@itcom888.com
 * @Date           : 2023-07-07 10:27:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-15 22:58:22
 * @FilePath: \user-pc-vue3\src\project-ouzhou\pages\match-list\featch_matches.js
 * @Description    : 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: lockie
 * @Date: 2023-07-07 10:41:05
 * @FilePath: \user-pc-vue3\src\project-ouzhou\pages\match-list\featch_matches.js
 * @Description: 
 */

import _ from 'lodash';

import { api_match_list } from 'src/api';
import { playingMethods_15 } from './matches_15mins';
import { filter_odds_func, handle_course_data, format_mst_data } from 'src/core/utils/matches_list.js'

const is_timer = [ '5', '10', '8', '7', '9', '13', '3' ]

/**
 * 
 * @param {Object} payload 请求主页列表的入参
 * @description 用于请求列表数据的函数 
 */
export const get_home_matches = async payload => {
  const res = await api_match_list.get_home_matches(payload);
  let obj = res?.data?.data || [];
  return obj;
}

/**
 * 
 * @param {Array} payload 需要筛选的15分钟玩法数据 
 * @description 需要返回已开赛且未结束的赛事(滚球)
 * @returns {Array} 返回处理好的15分钟玩法数据
 */
export const filter_15mins_func = payload => {
  // const timeStamp = new Date().getTime()
  // const endTimeStamp = 90 * 60 * 1000
  // 过滤已开赛且未结束数据
  // const matches_15mins_list = payload.filter(item => item.mgt < timeStamp && timeStamp - item.mgt < endTimeStamp)
  
  payload.forEach(item => {
    item['current_ol'] = filter_odds_func(item.hps15Minutes, '32', true);
    item['matches_15mins_obj'] = get_15mins_data(item);
    item['course'] = handle_course_data(item);
    item['mstValue'] = !is_timer.includes(item.csid) ? format_mst_data(item.mst) : '';
  })

  return payload.slice(0, 4);
}

export const filter_featured_list = payload => {
  payload.forEach(item => {
    item['current_ol'] = filter_odds_func(item.hps, '1', true);
    item['course'] = handle_course_data(item);
    item['mstValue'] = !is_timer.includes(item.csid) ? format_mst_data(item.mst) : '';
  })
  return payload;
}

/**
 * 
 * @param {Object} payload 包含着赛事时间的对象 
 * @description 根据字典映射不同的赛事时段
 * @returns {Object} 返回当前赛段的时间映射值
 */
export const get_15mins_data = payload => {
  const { mst, ms } = payload;
  if (Number(ms) !== 1) {
    return playingMethods_15[0];
  }
  const difference = mst / 60;
  if (difference >= 90) {
    return playingMethods_15[playingMethods_15.length - 1];
  } else {
    const residue = Math.floor(difference / 15)
    return playingMethods_15.find(p => p.value === residue);
  }
}

/**
 * 
 * @param {Array} payload 当前遍历的赛事列表
 * @description 需要前端筛选出不同赛种的赛事 
 * @returns {Array} 返回筛选好的赛事列表
 */
export const map_matches_list = (payload = []) => {
  const filter_matches_list = [];
  payload = payload.slice(0, 10);
  // 这是处理赛种级别的数据
  payload.forEach(item => {
    if (!filter_matches_list.some(option => option.csid === item.csid)) {
      const list_item = {
        csna: item.csna, //赛种名称
        csid: item.csid, //赛种ID
        hps: item.hps, 
        detail_info: item,
        league_list: [item], //用来存储联赛级数据
      }
      filter_matches_list.push(list_item);
    } else {
      const tn_index = filter_matches_list.findIndex(option => option.csid === item.csid);
      filter_matches_list[tn_index].league_list.push(item);
    }
  })

  // 这是处理联赛级数据
  filter_matches_list.forEach(item => {
    item.league_list_data = [];
    ( item.league_list || []).forEach(option => {
      if (!(item.league_list_data || []).some(option_league => option_league.tid === option.tid)) {
        const obj = {
          tid: option.tid, //联赛ID
          tn: option.tn, //联赛名称
          data: [option] 
        }
        item.league_list_data.push(obj);
      } else {
        const tn_index = (item.league_list_data || []).findIndex(option_league => option_league.tid === option.tid) || [0];
        item.league_list_data[tn_index].data.push(option);
      }
      option.msc = serialized_score(_.get(option, 'msc', []))
      option['course'] = handle_course_data(option);
      option['mstValue'] = !is_timer.includes(item.csid) ? format_mst_data(option.mst) : '';
    })
  })
  filter_matches_list.forEach(item => delete item.league_list);
  // 返回排序后的赛事列表信息
  return filter_matches_list.sort((x, y) => x.csid - y.csid);
}

/**
   * @description 序列化比分
   * @param  {Array} msc
   * @return {object}
   */
export const serialized_score = (msc = [], is_init = false) => {
  let score_obj = {};
  if (is_init) {
    score_obj = {
      S11: {
        home: "",
        away: "",
      },
      S103: {
        home: "0",
        away: "0",
      },
      S5: {
        home: "",
        away: "",
      },
      S10102: {
        home: "",
        away: "",
      },
    };
  }
  // 遍历接口比分数据 转成比分对象
  _.each(msc, (score_str) => {
    let [key, value] = score_str.split("|");
    if (value) {
      let [home, away] = value.split(":");
      score_obj[key] = { home, away };
    }
  });
  return score_obj;
}