/**
 * 这里是处理次要玩法的逻辑  
 */

import { ref } from 'vue';

import { MatchDataWarehouse_PC_List_Common as MatchListData } from "src/core/index.js";
import { get_match_status } from 'src/core/index.js'
import MatchListCardDataClass from "src/core/match-list-pc/match-card/module/match-list-card-data-class.js";
import { csid_to_tpl_id } from 'src/core/constant/util/csid-util.js'
let other_play_current_play = {};

import { other_play_name_to_playid } from 'src/core/constant/config/data-class-ctr/index.js';
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt"
import { MATCH_LIST_TEMPLATE_CONFIG } from 'src/core/match-list-pc/list-template/index.js'


/**
   * @Description 克隆数组
   * @param {array} arr 需要克隆的数值
   */
const clone_arr = (arr) => {
  let new_arr = [];
  lodash.merge(new_arr, arr || []);
  return new_arr;
}
/**
* @Description 合并列表模板数据
* @param {Object} match 赛事信息
* @param {Object} handicap_list 模板数据
* @param {NUmber} type 盘口类型 1:主盘，  2：附加盘1， 3：附加盘2  4:15分钟玩法
* @param {String} play_key 次要玩法key
*/
export function merge_template_data({ match, handicap_list, type, play_key }) {
  let length = handicap_list.length
  let { all_ol_data = {}, hSpecial5min } = match
  handicap_list.forEach((col, col_index) => {
    col.ols.forEach((ol, ol_index) => {
      let handicap_type = 1
      let { hn, _hpid, ot } = ol
      if (type == 4) {
        handicap_type = get_min15_handicap_type(length, match.hSpecial, col_index)
        //22号模板 足球-独赢 让球胜平负 附加盘 合并到主盘   hn = 2 | 3 附加盘编号
      } else if (hn) {
        handicap_type = hn
      } else {
        handicap_type = type
      }
      let ol_data = all_ol_data[`${match.mid}_${_hpid}_${handicap_type}_${ot}`]
      if (ol_data) {
        //附加盘1
        if (type == 2) {
          match.has_add1 = true
        }
        //附加盘2
        if (type == 3) {
          match.has_add2 = true
        }
        Object.assign(col.ols[ol_index], ol_data)
      }
    })
  })
  // 波胆置顶
  if ('hpsBold' == play_key) {
    handicap_list = data_topping(handicap_list)
  }
  // 滚球-下一个进球玩法，后边的依次往前移动
  if ('hps5Minutes' == play_key && hSpecial5min == 5) {
    handicap_list = data_move_up(handicap_list)
  }
  return handicap_list
}
/**
   * @Description 获取6列 十五分钟玩法 handicap_type 值
   * @param {Number} hSpecial 赛事阶段
   * @param {Number} col_index 盘口列位置
   * @return {handicap_type} handicap_type 值
   */
export function get_min15_handicap_type(length, hSpecial, col_index) {
  let handicap_type
  let index = get_phase(col_index)
  if (length > 6) {
    handicap_type = get_min15_col13_handicap_type(hSpecial, index)
  } else {
    handicap_type = get_min15_col6_handicap_type(hSpecial, index)
  }
  return handicap_type
}
/**
 * @Description 获取盘口列位置
 * @param {Number} col_index  当前列索引
 * @return {Number} index  位置索引值 (0 = 1-3盘口列位置  1 = 4-6盘口列位置 2 = 7-9盘口列位置 3 = 10-13盘口列位置)
 */
function get_phase(col_index) {
  let index = 0
  if (col_index > 8) {
    index = 3
  } else if (col_index > 5) {
    index = 2
  } else if (col_index > 2) {
    index = 1
  }
  return index
}
/**
 * @Description 获取6列 十五分钟玩法 handicap_type 值
 * @param {Number} hSpecial 赛事阶段
 * @param {Number} index 盘口列位置
 * @return {handicap_type} handicap_type 值
 */
function get_min15_col6_handicap_type(hSpecial, index) {
  let handicap_type = hSpecial
  if (index == 0) {
    //跳过第三阶段
    if (hSpecial == 3) {
      handicap_type = hSpecial + 1
    }
  } else if (index == 1) {
    handicap_type = hSpecial + 1
    //跳过第三阶段
    if ([2, 3].includes(hSpecial)) {
      handicap_type = hSpecial + 2
    }
  }
  return handicap_type
}
/**
* @Description 获取13列 十五分钟玩法 handicap_type 值
* @param {Number} hSpecial 赛事阶段
* @param {Number} index 盘口列位置
* @return {handicap_type} handicap_type 值
*/
function get_min15_col13_handicap_type(hSpecial, index) {
  let handicap_type
  switch (hSpecial) {
    case 1:
      handicap_type = hSpecial + index
      break;
    case 2:
      if (index > 0) {
        handicap_type = hSpecial + index + 1
      } else {
        handicap_type = hSpecial + index
      }
      break;
    case 3:
      handicap_type = hSpecial + index + 1
      break;
    case 4:
    case 5:
      handicap_type = hSpecial + index
      break;

    default: handicap_type = hSpecial
      break;
  }
  return handicap_type
}
/*
数据置顶
*/
export function data_topping(data) {
  let list = []
  let max_index = 0, line = 0
  //遍历列
  lodash.each(data, e => {
    let hp = { sum: 0, own: [], none: [] }
    line = e.ols.length - 1
    //遍历行
    lodash.each(e.ols, (dt, j) => {
      //other不处理
      if (line != j) {
        //1、开 2、封 3、关
        if ([1, 2].includes(dt.os) && dt._hs != 2) {
          hp.sum++
          hp.own.push(j)
          //最大索引
          if (hp.sum > max_index) {
            max_index = hp.sum
          }
        } else {
          hp.none.push(j)
        }
      }
    })
    list.push(hp)
  });

  //最小3行（含other）
  if (max_index < 2) max_index = 2
  let res = []
  lodash.each(list, (e, i) => {
    let indexes = e.own.concat(e.none)
    indexes.splice(max_index, line - max_index)
    let arr = []
    //添加有效列
    indexes.forEach(j => {
      arr.push(data[i].ols[j])
    });
    //添加other
    arr.push(data[i].ols[line])
    res.push({ ols: arr })
  })
  return res
}
/**
* @Description 滚球-75-85分钟时，把顶上空的那一行移动到最下边
* @param {Array} arr 原数据列表
*/
export function data_move_up(list) {
  for (let i = 0; i < 4; i++) {
    let ols = lodash.get(list, `${i}.ols`) || []
    let [ol] = ols.splice(0, 1)
    ol.os = 3
    if ([0, 2].includes(i)) {
      Object.assign(ol, { other_class: 'col1.5 row2' })
    }
    ols.push(ol)
  }
  return list
}  /**
* @Description 获取赛事模板ID
* @param {number} csid 球种类型
*/
function get_match_template_id({ csid }) {
  let tpl_id = $menu.menu_data.match_tpl_number
  // 虚拟足球1001、虚拟篮球1004
  if ([1001, 1004].includes(+csid)) {
    tpl_id = csid
  }
  // 虚拟赛狗1002 虚拟摩托1010 虚拟赛马1011 泥地摩托车1009
  else if ([1002, 1010, 1011, 1009].includes(+csid)) {
    tpl_id = 1002
  }
  // 99模板根据球种获取模板ID
  else if (tpl_id == -1) {
    tpl_id = csid_to_tpl_id(csid)
  }
  return tpl_id
}
/**
   * @Description 计算角球、罚牌等其他玩法数据 (获取角球、罚牌模板数据，并与接口数据合并)
   * @param {undefined} undefined
  */
export const get_compute_other_play_data = (match) => {
  if (!match) return []
  let { cos15Minutes, cos5Minutes, mst, mid } = match
  if (cos15Minutes || cos5Minutes) {
    set_min15(match, mst)
  }
  // set_tab_play_keys(match)
  //当前选中玩法
  let cur_other_play = get_play_current_play(mid)
  let match_style_obj = MatchListCardDataClass.get_card_obj_bymid(mid)
  const { data_tpl_id } = match_style_obj;
  const match_tpl_info = MATCH_LIST_TEMPLATE_CONFIG[`template_${data_tpl_id}_config`][`template_${data_tpl_id}`]
  match.tpl_id = data_tpl_id;
  // 其他玩法盘口列表
  let other_handicap_list = clone_arr(match_tpl_info[cur_other_play])
  // 波胆
  if (cur_other_play == 'hpsBold') {
    other_handicap_list = get_21_bold_template(match);
  }
  //5分钟
  if (cur_other_play == 'hps5Minutes') {
    other_handicap_list = get_5minutes_template(match);
  }
  if (!cur_other_play) {
    other_handicap_list = clone_arr(match_tpl_info.hpsCorner)
  }
  // 4：15分钟玩法 1：其他玩法
  let type = cur_other_play == 'hps15Minutes' ? 4 : 1
  other_handicap_list = merge_template_data({ match, handicap_list: other_handicap_list, type, play_key: cur_other_play })
  // coverage_match_data({ other_handicap_list }, mid)
  // match.other_handicap_list = other_handicap_list
  return other_handicap_list || []
}


/**
  * @Description 设置十五分钟玩法阶段
  * @param {Object} match 赛事信息
  * @param {Number} mst 赛事进行时间
  * @param {Function} callback 回调 重新拉取赛事信息
  */
function set_min15(match, mst, callback) {
  // 如果未开赛
  if (get_match_status(match.ms, [110]) === 0) {
    return
  }
  // 自定义赛事阶段
  let hSpecial
  // mst 小于900 特1 小于1800 特二 小于2700 特三 小于3600 特4 小于4500 特5 否则是特6
  if (mst < 900) {
    hSpecial = 1
  }
  else if (mst < 1800) {
    hSpecial = 2
  }
  else if (mst < 2700 || match.mmp == 6 || match.mmp == 41) { // 如果是上半场或者上半场加时 15分钟阶段显示特3
    hSpecial = 3
  }
  else if (mst < 3600 || match.mmp == 31) {
    hSpecial = 4
  }
  else if (mst < 4500) {
    hSpecial = 5
  }
  else {
    hSpecial = 6
  }

  const { hSpecial5min } = get_min5_state(match, mst)
  // 如果默认阶段和接口数据返回的hSpecial不一致 重新调用接口获取 //5分钟玩法比赛时间大于85分钟并且是下半场
  if ((hSpecial !== match.hSpecial || hSpecial5min !== match.hSpecial5min) && callback) {
    callback()
  }
  Object.assign(match, { hSpecial, hSpecial5min })
}
/**
  * @Description 获取五分钟玩法阶段状态
  * @param {Object} match 赛事信息
  * @param {Number} mst 赛事进行时间
  */
function get_min5_state(match, mst) {
  // 5分钟状态处理
  let hSpecial5min = 1
  // 15分钟时，第4个投注项16-20会停止，此时第一排投注项全空，以此类推
  if (mst < 900) {
    hSpecial5min = 1
  }
  else if (mst < 2100) {
    hSpecial5min = 2
  }
  else if (mst < 3300 || match.mmp == 6 || match.mmp == 41 || match.mmp == 31) { // 如果是上半场或者上半场加时或者半场休息
    hSpecial5min = 3
  }
  else if (mst < 4500) {
    hSpecial5min = 4
  }
  else if (mst < 5100) {
    hSpecial5min = 5 // 75-85分钟，只剩2个或1个投注项，需要上移
  } else { // 超过85分钟，所有玩法关闭
    hSpecial5min = 6
  }
  return {
    hSpecial5min
  }
}
/**
 * @Description 获取其他玩法请求参数
 * @param {array} mids 赛事ID数组
*/
export const get_tab_param_build = (mids) => {
  let tabs = []
  mids.forEach(mid => {
    let match = MatchListData.get_quick_mid_obj(mid)
    // 有其他玩法
    if (match.has_other_play) {
      // 添加玩法ID
      tabs.push({
        mid,
        playId: other_play_name_to_playid[other_play_current_play[mid + '_']]
      })
    }
  })
  return tabs
}
/**
   * @Description 获取21号模板(波胆)
   * @param {object} match 赛事信息
   * @return {Array} template 模板
  */
export function get_21_bold_template(match) {
  let list_name = "main_handicap_list_20"
  match.tpl_id == 13 && (list_name += '_13')
  let tpl_21_hpids = ''
  function compute_hl_obj_data(hl_obj) {
    let { hpid } = hl_obj
    if ([7, 20, 74, 341, 342].includes(+hpid) && lodash.get(hl_obj, 'hl.hs', 2) != 2) {
      tpl_21_hpids += hpid + ','
    }
  }
  // // 遍历主盘口数据
  lodash.each(match.hpsData, hpsData => {
    lodash.each(hpsData.hps, hl_obj => {
      compute_hl_obj_data(hl_obj)
    })
  })
  // 遍历附加盘数据
  let add_hps = lodash.get(match, 'hpsData[0].hpsAdd', [])
  add_hps.forEach(item => {
    // 遍历附加盘盘口
    let { hl: hls_arr = [], hpid, chpid } = item
    hls_arr.forEach((hl) => {
      compute_hl_obj_data({ hl, hpid, chpid })
    })
  })
  // 足球让球与大小玩法 遍历其他玩法数据
  if (match.csid == 1 && [0, 13].includes(+match.tpl_id)) {
    lodash.each(Object.keys(other_play_name_to_playid), key => {
      lodash.each(match[key], hl_obj => {
        compute_hl_obj_data(hl_obj)
      })
    })
  }
  if (tpl_21_hpids?.includes(341)) {
    list_name = list_name.replace("20", "341")
  }
  return clone_arr(MATCH_LIST_TEMPLATE_CONFIG.template_21_config.template_21[list_name])
}
/**
   * @Description 获取5分钟玩法模板
   * @param {Object} match 赛事数据
   * @return {Object} other_handicap_list 5分钟模板
   */
export function get_5minutes_template(match = {}) {
  let { tpl_id = 0, hSpecial5min = 6, ms = 110 } = match
  let other_handicap_list = []
  let hpid = get_match_status(ms, [110]) ? "362" : "361"
  let tpl_name = `hps5Minutes_${hpid}`
  let slice_index = Math.min(hSpecial5min - 1, 3)
  lodash.each(MATCH_LIST_TEMPLATE_CONFIG[`template_${tpl_id}_config`][tpl_name], col => {
    other_handicap_list.push({ ols: col.ols.slice(slice_index) })
  })
  return clone_arr(other_handicap_list)
}
/**
 * @Description 覆盖赛事数据
 * @param {Object} data_obj 覆盖对象
 * @param {String} mid 赛事id
 */
function coverage_match_data(data_obj, mid) {
  let match = MatchListData.get_quick_mid_obj(mid)
  if (match) Object.assign(match, data_obj);
}

/**
 * @Description 切换其他玩法
 * @param {string} mid 赛事id
*/
export function switch_other_play(mid, play_key) {
  let match = MatchListData.get_quick_mid_obj(mid)
  set_match_play_current_index(match, play_key)
  useMittEmit(MITT_TYPES.EMIT_API_BYMIDS, { mids: [mid] });
}
/**
   * @Description 设置其他玩法选中索引    更新玩法模板及数据
   * @param {undefined} undefined
  */
export const set_match_play_current_index = (match, play_key) => {
  let tab_play_keys = MatchListData.get_tab_play_keys(match).split(",")
  // 设置选中的玩法索引
  match.play_current_index = tab_play_keys.findIndex(key => key == play_key)
  // 设置选中的玩法key
  match.play_current_key = play_key
  // 保存当前选中的玩法
  other_play_current_play[match.mid + '_'] = play_key
}


//获取保存的盘口玩法
export function get_play_current_play(mid) {
  return other_play_current_play[mid + '_'];
}