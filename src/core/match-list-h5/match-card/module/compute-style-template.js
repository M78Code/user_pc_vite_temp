





/**
 * 计算当前赛事数据模板    --------单个赛事
 * 数据依据：
 *    1. 赛事信息 ， 赛种ID
 *    2. 当前在哪一个列表  假定 which_list
 *    3. 配置文件  / 或者叫配置方法
 *
 *
 * 输出信息：
 *    一个计算后的当前赛事的 高度相关的数据 ，含 模板 等信息 ，
 *    这个信息用于两个地方：
 *      1. 联赛卡片 计算
 *      2. 用于赛事自身约束
 *
 * 主要注意：
 *     1. 附加需求:   例如目前的 滚球下的 球类显示行
 *     2. 联赛信息展示行
 *
 *
 *  备注  1.在滚球我们自己根据数据计算出实际模板数据
 *        2. 在早盘 后台返回模板我们根据 后台返回的模板计算出实际模板数据
 *
 * 最好是写 配置文件
 *
 */

import { MatchDataWarehouse_H5_List_Common as MatchListData  } from 'src/output/module/match-data-base.js'
import MatchListCardData from "./match-list-card-data-class.js"
import lodash from "lodash"
import { update_match_parent_card_style } from "src/core/match-list-pc/match-card/module/utils.js"
import { league_title_card_template } from "../template/card-template-config.js"
import { MATCH_LIST_TEMPLATE_CONFIG } from "../template"
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
/**
 * @Description 获取其他玩法盘口高度
 * @param {string | Number } csid  赛种id
 * @param {string | Number } mid  赛事id
*/
const get_tab_play_height = (mid, csid) => {
  if (![1,2].includes(+csid)) return
  const lang =  LocalStorage.get("__LANG")
  let { play_current_key, other_handicap_list = [] } = MatchListData.list_to_obj.mid_obj[`${mid}_`] || {}
  let { tab_play_total_height: handicap_height } = lodash.get(MATCH_LIST_TEMPLATE_CONFIG, `template_${csid}_config.match_template_config`)
  let length = lodash.get(other_handicap_list, '0.ols.length', 3)
  //5分钟      波胆
  if (['hps5Minutes', 'hpsBold'].includes(play_current_key)) {
    // 计算1号模板次要玩法 盘口+玩法标题高度
    handicap_height = length * 35 + (40 - (!['en', 'ad', 'ms'].includes(lang.value) ? 16 : 0))
  }
  return handicap_height
}

/**
 * @Description 计算模板0专有的数据
 * @param {object} match 赛事
 * @param {object} match_style_obj 配置
*/
const compute_style_template_by_match_info_template1_zuqiu = (match, match_style_obj) => {

  // 是否展示次要玩法
  let is_show_tab_play = lodash.get(match_style_obj, 'is_show_tab_play', false)

  let tab_play_total_height = 0
  if (is_show_tab_play && !is_fold_tab_play) {
    // 如果有角球玩法并且未折叠  角球区域总高度 等于角球标题高度加角球盘口高度
    tab_play_total_height = match_style_obj.tab_play_title_height + get_tab_play_height(match.mid)
  } else if (is_show_tab_play) {
    // 如果有角球玩法并且未折叠  角球区域总高度 等于角球标题高度
    tab_play_total_height = match_style_obj.tab_play_title_height
  }

  return {
    // 角球、罚牌、点球大战等玩法 是否折叠
    is_fold_tab_play,
    // 角球区域高度
    tab_play_total_height 
  }
}

/**
* @Description 跟新次要玩法高度
* @param {String|Number} mid 赛事id
*/
export const update_match_cur_card_style = (mid) => {

  let card_obj = MatchListCardData.all_card_obj['mid_' + mid] || {}
  if (!card_obj.is_fold_tab_play) {
    card_obj.tab_play_total_height = card_obj.tab_play_title_height + get_tab_play_height(-1)
    card_obj.total_height = card_obj.main_handicap_height + card_obj.add_handicap_height + card_obj.tab_play_total_height + 6
    update_match_parent_card_style(card_obj, MatchListCardData.all_card_obj)
  }
}


/**
 * @Description 篮球让球与大小
 * @param {object} match 赛事
 * @param {object} template_config 配置
 **/
const compute_style_template_by_match_info_template7_lanqiu = (match, template_config) => {
  // 附加盘高度 等于附加盘数量*模板配置附加盘高度
  let add_handicap_height = add_handicap_count * template_config.add_handicap_height

  return {
    // 足球篮球  附加盘数量
    add_handicap_count,
    // 附加盘高度
    add_handicap_height,
  }
}

/**
 * @Description 计算冠军模板赛事高度
 * @param {object} match 赛事
 **/
const compute_style_template_by_match_info_template18 = (match) => {
  let cur_match = MatchListData.list_to_obj.mid_obj[`${match.mid}_`] || { main_handicap_list: [] }
  // 附加盘口高度
  let add_handicap_height = 0
  // 投注项数量
  let ol_count = 0
  cur_match.main_handicap_list.forEach(hl_data => {
    if (hl_data.hid && hl_data.hs != 2) {
      // 盘口标题高度
      add_handicap_height += 32
      // 计算投注项数量
      ol_count = 0
      hl_data.ol.forEach(ol => {
        if (ol.os != 3 && ol.oid) {
          ol_count++
        }
      })
      // 累加投注项高度
      add_handicap_height = add_handicap_height + Math.ceil(ol_count / 2) * 35
    }
  })
  return { add_handicap_height }
}

/**
* @Description 角球折叠
* @param {number} mid 折叠的赛事ID
*/
export const fold_tab_play = (mid) => {
  let card_obj = MatchListCardData.all_card_obj['mid_' + mid] || {}
  card_obj.is_fold_tab_play = !card_obj.is_fold_tab_play
  if (card_obj.is_fold_tab_play) {
    // 角球已折叠  角球区域总高度 等于角球标题高度
    card_obj.tab_play_total_height = card_obj.tab_play_title_height
  } else if (card_obj.is_show_tab_play) {
    // 角球且未折叠  角球区域总高度
    card_obj.tab_play_total_height = card_obj.tab_play_title_height + get_tab_play_height(mid)
  }
  // 设置赛事卡片总高度 + 赛事间距和边框6px
  card_obj.total_height = card_obj.main_handicap_height + card_obj.add_handicap_height + card_obj.tab_play_total_height + 6
  // 更新赛事父级卡片样式 即对应的联赛容器卡片样式
  update_match_parent_card_style(card_obj, MatchListCardData.all_card_obj)
}



/**
* @Description 获取联赛标题卡片高度
* @param {number} template_id 赛事模板编号
* @param {undefined} undefined
*/
export const get_league_title_card_height = (template_id) => {
  let height
  // 个别模板有两行玩法标题
  if ([1, 3, 5, 21, 22].includes(+template_id)) {
    height = 56
  } else {
    height = league_title_card_template.league_nofold_height
  }
  return height
}



/**
 * 
 * 通过赛事信息 和模板 ID 计算 赛事的样式 模板 
 * @param {*} match 
 * @param {*} template_id 
 * @returns 
 */

export const compute_style_template_by_match_info1 = (match, template_id) => {
  if (template_id == 13) {
    template_id = 0
  }
  // 赛事列表模板配置
  let template_config = MATCH_LIST_TEMPLATE_CONFIG[`template_${template_id}_config`]['match_template_config'] || {}
  // 赛事样式对象
  let style_obj = {
    // 显示等级
    show_level: 1,
    // 是否显示卡片  没拿到赛事数据的时候 不显示
    is_show_card: false,
    // 是否显示角球、罚牌、点球大战等玩法
    is_show_tab_play: false,
    // 角球、罚牌、点球大战等玩法 是否折叠
    is_fold_tab_play: false,
    // 角球区域高度
    tab_play_total_height: 0,
    // 角球盘口高度
    tab_play_title_height: template_config.tab_play_title_height,
    // 角球盘口高度
    tab_play_handicap_height: get_tab_play_height(lodash.get(match, 'mid')),
    // 是否需要动态计算高度
    is_dynamic_compute_height: template_config.is_dynamic_compute_height,
    // 卡片总高度
    total_height: 0,
    // 主盘口高度
    main_handicap_height: 110,
    // 是否显示当前局玩法
    is_show_cur_handicap: false,
    // 当前局盘口高度
    cur_handicap_height: 0,
    // 赛事标题高度
    match_card_title_height: 30
  }

  // 如果没有赛事信息
  if (!match || !match.mid) {
    return style_obj
  }
  style_obj.csid = match.csid
  style_obj.tpl_id = match.tpl_id
  style_obj.is_show_card = true
  // 0号模板设置角球玩法数据
  if (template_id == 0) {
    let obj = compute_style_template_by_match_info_template0_zuqiu(match, template_config)
    Object.assign(style_obj, obj)
  }
  // 7号模板 篮球 让球与大小
  else if (template_id == 7) {
    let obj = compute_style_template_by_match_info_template7_lanqiu(match, template_config)
    Object.assign(style_obj, obj)
  }
  // 18号模板 冠军
  else if (template_id == 18) {
    let obj = compute_style_template_by_match_info_template18(match)
    Object.assign(style_obj, obj)
  }

  // 设置主盘口高度
  style_obj.main_handicap_height = template_config.main_handicap_height
  // 是否显示当前局盘口
  style_obj.is_show_cur_handicap = match.is_show_cur_handicap

  // 如果有当前局盘口 设置当前局盘口高度
  if (style_obj.is_show_cur_handicap) {
    style_obj.cur_handicap_height = template_config.cur_handicap_height
  }

  // 设置卡片总高度 等于主盘口高度 + 当前局盘扣高度 + 附加盘高度 + 角球区域高度 + 赛事间距和边框6px
  style_obj.total_height = style_obj.main_handicap_height + style_obj.cur_handicap_height + style_obj.add_handicap_height + style_obj.tab_play_total_height + 6
  return style_obj
}

/**
 * @description 计算赛事对应模板高度
 * @param { match } 赛事对象 
 * @returns 
 */
export const compute_style_template_by_match_height = (match) => {
  if (!match) return
  const { csid, mid, is_show_league } = match

  // 对应模板默认配置
  let template_config = lodash.get(MATCH_LIST_TEMPLATE_CONFIG, `template_${csid}_config.match_template_config`)

  let is_show_tab_play = compute_show_tab_play(match)

  // 赛事样式对象
  let match_style_obj = {
    // 是否显示次要玩法
    is_show_tab_play,
    // 次要玩法是否折叠
    is_fold_tab_play: is_show_tab_play ? compute_fold_tab_play(match) : false,
    //次要玩法盘口高度
    tab_play_total_height: is_show_tab_play ? get_tab_play_height(mid, csid) : 0,
    // 是否需要动态计算高度
    is_dynamic_compute_height: template_config?.is_dynamic_compute_height,
    // 联赛标题高度
    show_league_height: is_show_league ? template_config?.show_league_height : 0,
    // 卡片总高度
    card_total_height: 0,
    // 是否显示该赛事卡片
    is_show_card: true,
    // 卡片 id
    csid
  }

  // 如果没有赛事信息
  if (!match || !match.mid) {
    return match_style_obj
  }

  // 0号模板设置次要玩法数据
  if (csid == 0) {
    let obj = compute_style_template_by_match_info_template1_zuqiu(match, match_style_obj)
    Object.assign(match_style_obj, obj)
  }
  // 7号模板 篮球 让球与大小
  else if (csid == 7) {
    // let obj = compute_style_template_by_match_info_template7_lanqiu(match, template_config)
    // Object.assign(match_style_obj, obj)
  }
  // 18号模板 冠军
  else if (csid == 18) {
    // let obj = compute_style_template_by_match_info_template18(match)
    // Object.assign(match_style_obj, obj)
  }

  return {
    mid,
    total_height: compute_match_total({ ...template_config, ...match_style_obj })
    // total_height: 0.31
  }
}

/**
 * 计算赛事卡片总高度
 * @param {match_style_obj} 卡片配置 
 */
const compute_match_total = (match_style_obj) => {
  let height = Object.values(match_style_obj).filter(t => typeof t === 'number').reduce((a, b) => a + b, 0)
  return height
  // return px_2_rem(height)
}

/**
 * 是否显示次要玩法
 * @param {match} 赛事对象 
 */
const compute_show_tab_play = (match) => {
  const { cosCorner = false, cosOvertime = false, cosPenalty = false, cosPromotion = false, cosBold = false, cosOutright = false, cosPunish = false, hpsAdd = false, 
    cos15Minutes = false, cos5Minutes = false } = match;
  return cosCorner || cosOvertime || cosPenalty || cosPromotion || cosBold || cosOutright || cosPunish || hpsAdd || cos15Minutes || cos5Minutes
}

/**
 * 次要玩法是否折叠
 * @param {match} 赛事对象 
 */
const compute_fold_tab_play = (match) => {
  return lodash.get(MatchListCardData.all_card_obj['mid_' + match.mid], 'is_fold_tab_play', false)
}