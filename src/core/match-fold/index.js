/**
 * @description 赛事折叠
 */

import lodash from 'lodash'
import { ref } from 'vue'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from 'src/core'

class MatchFold {
  constructor () {
    // 球种折叠对象
    this.ball_seed_csid_fold_obj = ref({})
    // 赛事折叠对象
    this.match_mid_fold_obj = ref({})
    // 进行中球种折叠对象
    this.progress_csid_fold_obj = ref({})
    // 未开赛球种折叠对象
    this.not_begin_csid_fold_obj = ref({})
  }
  /**
   * @description 设置折叠映射对象
   * @param { match } 赛事对象
   */
  set_match_mid_fold_obj (match) {
    if (!match) return
    const key = this.get_match_fold_key(match)
    // 次要玩法头部是否显示
    const show_tab = this.compute_show_tab_play(match)
    Object.assign(this.match_mid_fold_obj.value, {
      [key]: {
        show_tab,
        // 赛事区域
        show_card: true,
        // 次要玩法内容区
        show_tab_content: false
      }
    })
  }
  /**
   * @description h5 设置球种折叠映射对象
   * @param { match } 赛事对象
   * @param { falg } 展开/ 折叠
   */
  set_ball_seed_csid_fold_obj (csid, falg = true) {
    Object.assign(this.ball_seed_csid_fold_obj.value, {
      [`csid_${csid}`]: falg
    })
    // console.log(this.ball_seed_csid_fold_obj.value)
  }
  // 进行中球种折叠映射对象
  set_progress_csid_fold_obj (csid, falg = true) {
    Object.assign(this.progress_csid_fold_obj.value, {
      [`csid_${csid}`]: falg
    })
  }
  // 未开赛球种折叠映射对象
  set_not_begin_csid_fold_obj (csid, falg = true) {
    Object.assign(this.not_begin_csid_fold_obj.value, {
      [`csid_${csid}`]: falg
    })
  }
  /**
   * @description 联赛折叠
   * @param { tid } 联赛 tid
   */
  set_league_fold (tid) {
    // 赛事 mids
    const match_mids = lodash.get(MatchMeta, 'complete_mids', [])
    match_mids.forEach(mid => {
      const match = MatchDataBaseH5.get_quick_mid_obj(mid)
      if (!match || match.tid !== tid) return
      const key = this.get_match_fold_key(match)
      const show_card = !lodash.get(this.match_mid_fold_obj.value, `${key}.show_card`, false)
      this.set_match_fold(key, { show_card })
    })
  }
  /**
   * @description 球种折叠
   * @param { csid } 球种 csid 
   * @param { type } 0 全部；1 进行中； 2 未开赛
   */
  set_ball_seed_match_fold (csid, type) {
    // 赛事 mids
    let status = ''
    if (!type) status = this.ball_seed_csid_fold_obj.value[`csid_${csid}`]
    if (type === 1) status = this.progress_csid_fold_obj.value[`csid_${csid}`]
    if (type === 2) status = this.not_begin_csid_fold_obj.value[`csid_${csid}`]
    const match_mids = lodash.get(MatchMeta, 'complete_mids', [])
    match_mids.forEach(mid => {
      const match = MatchDataBaseH5.get_quick_mid_obj(mid)
      if (!match || match.csid !== csid) return
      const key = this.get_match_fold_key(match)
      // 全部
      if (!type) return this.set_match_fold(key, { show_card: !status })
      // 进行中
      if (type === 1 && [1,110].includes(+match.ms)) return this.set_match_fold(key, { show_card: !status })
      // 未开赛
      if (type === 2 && ![1,110].includes(+match.ms)) return this.set_match_fold(key, { show_card: !status })
    })
    // 全部
    if (!type) return this.set_ball_seed_csid_fold_obj(csid, !status)
    // 进行中
    if (type === 1) return this.set_progress_csid_fold_obj(csid, !status)
    // 未开赛
    if (type === 2) return this.set_not_begin_csid_fold_obj(csid, !status)
  }
  /**
   * @description 设置赛事次要玩法是否展开
   * @param { match } 赛事对象 
   */
  set_match_tab_content (match) {
    const key = this.get_match_fold_key(match)
    const show_tab_content = !lodash.get(this.match_mid_fold_obj.value, `${key}.show_tab_content`, false)
    this.set_match_fold(key, { show_tab_content  })
  }
  /**
   * @description 获取对象折叠的  key
   * @param { match } 赛事对象 
   * @returns string
   */
  get_match_fold_key (match) {
    const { mid, tid } = match
    return `${tid}_${mid}`
  } 
  /**
   * @description 设置赛事折叠
   * @param { key } 赛事折叠对象的 key  
   * @param { obj } 折叠参数 
   */
  set_match_fold (key, obj) {
    const fold_obj = lodash.get(this.match_mid_fold_obj.value, `${key}`)
    if (!fold_obj) return console.error('折叠操作：该赛事未初始化')
    Object.assign(fold_obj, { ...obj })
    // console.log(this.match_mid_fold_obj.value)
  }
  // 清除球种折叠对象
  clear_ball_seed_csid_fold_obj () {
    this.ball_seed_csid_fold_obj.value = {}
  }
  // 清除赛事折叠对象
  clear_match_mid_fold_obj () {
    this.match_mid_fold_obj.value = {}
  }
  // 清除所有折叠对象
  clear_fold_info () {
    this.clear_ball_seed_csid_fold_obj()
    this.clear_match_mid_fold_obj()
  }
  /**
   * 是否显示次要玩法
   * @param {match} 赛事对象 
   */
  compute_show_tab_play = (match) => {
    const { compose = false, cos15Minutes = false, cosBold = false, cosCorner = false, cosOutright = false, cosOvertime = false, cosPenalty = false, cosPromotion = false, 
      cosPunish = false } = match;
    return compose || cos15Minutes || cosBold || cosCorner || cosOutright || cosOvertime || cosPenalty || cosPromotion || cos15Minutes || cosPunish
  }
}

export default new MatchFold()