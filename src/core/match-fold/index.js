/**
 * @description 赛事折叠
 */

import lodash from 'lodash'
import { ref } from 'vue'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { MenuData } from 'src/output';

class MatchFold {
  constructor () {
    // 全部球种折叠状态
    this.all_csid_fold_status = ref(true)
    // 球种折叠对象
    this.ball_seed_csid_fold_obj = ref({})
    // 赛事折叠对象
    this.match_mid_fold_obj = ref({})
    // 进行中球种折叠对象
    this.progress_csid_fold_obj = ref({})
    // 未开赛球种折叠对象
    this.not_begin_csid_fold_obj = ref({})
    // 联赛折叠信息，用于 新增赛事时 卡片状态跟随当前联赛 折叠状态
    this.custom_tid_fold_info = ref({})
  }
  /**
   * @description 设置折叠映射对象
   * @param { match } 赛事对象
   */
  set_match_mid_fold_obj (match) {
    if (!match) return
    const { custom_tid = '' } = match
    const key = this.get_match_fold_key(match)
    // 次要玩法头部是否显示
    const show_tab = this.compute_show_tab_play(match)
    // 当前赛事折叠状态， 需要根据 当前联赛 的状态来确定 `${start_flag}_${custom_tid}`
    const show_card = lodash.get(this.custom_tid_fold_info.value, `${custom_tid}`, true)
    Object.assign(this.match_mid_fold_obj.value, {
      [key]: {
        show_tab,
        // 赛事区域
        show_card,
        // 次要玩法内容区
        show_tab_content: false
      }
    })
  }
  /**
   * @description 获取 通个联赛 的折叠状态
   */
  set_custom_tid_fold_info (match, value) {
    const { custom_tid = '' } = match
    if (!custom_tid) return
    Object.assign(this.custom_tid_fold_info.value, {
      [`${custom_tid}`]: value
    })
  }
  /**
   * @description h5 设置球种折叠映射对象
   * @param { flag } 展开/ 折叠
   */
  set_ball_seed_csid_fold_obj (csid_key, flag = true) {
    const state = this.get_default_fold_state_by_csid(flag)
    Object.assign(this.ball_seed_csid_fold_obj.value, {
      [csid_key]: state
    })
    // console.log(this.ball_seed_csid_fold_obj.value)
  }
  // 进行中球种折叠映射对象
  set_progress_csid_fold_obj (csid_key, flag = true) {
    const state = this.get_default_fold_state_by_csid(flag)
    Object.assign(this.progress_csid_fold_obj.value, {
      [csid_key]: state
    })
  }
  // 未开赛球种折叠映射对象
  set_not_begin_csid_fold_obj (csid_key, flag = true) {
    const state = this.get_default_fold_state_by_csid(flag)
    Object.assign(this.not_begin_csid_fold_obj.value, {
      [csid_key]: state
    })
  }
  // 获取默认的球种折叠对象
  get_default_fold_state_by_csid (flag) {
    // const state = PROJECT_NAME === 'ouzhou-h5'
    // return flag !== undefined ? flag : state
    return flag
  }
 
  /**
   * @description 联赛折叠
   * @param { match } 赛事对象
   * @param { type } 0 全部；1 进行中； 2 未开赛
   */
  set_league_fold (match, type) {
    // 赛事 mids
    const { custom_tid, csid, warehouse_type } = match
    let list = []
    if (['five_league'].includes(warehouse_type)) {
      list = lodash.get(MatchMeta, 'other_complete_matchs', [])
    } else {
      list = lodash.get(MatchMeta, 'complete_matchs', [])
    }
    list.forEach(item => {
      if (!item || item.custom_tid !== custom_tid) return
      const key = this.get_match_fold_key(item)
      const show_card = !lodash.get(this.match_mid_fold_obj.value, `${key}.show_card`, false)
      // 设置联赛折叠状态
      this.set_custom_tid_fold_info(item, show_card)
      // 全部
      if (!type) return this.set_match_fold(key, { show_card })
      // 进行中
      if ([1,3].includes(type) && [1,110].includes(+item.ms)) return this.set_match_fold(key, { show_card })
      // 未开赛
      if ([2,4].includes(type) && ![1,110].includes(+item.ms)) return this.set_match_fold(key, { show_card })
    })
    if (csid) {
      let flag = true
      Object.values(this.match_mid_fold_obj.value).forEach(item => {
        if (!item.show_card) flag = false
      })
      this.set_ball_seed_csid_fold_obj(flag)
    }
  }
  /**
   * @description 球种折叠
   * @param { obj } 赛事信息
   * @param { type } 0 全部；1 进行中； 2 未开赛
   * @param { is_fold_all } true 全部折叠 false 只折叠该赛种
   */
  set_ball_seed_match_fold (obj, type, is_fold_all = false) {
    
    // 赛事 mids
    let status = ''
    const csid_key = this.get_fold_key(obj)
    if (!type) {
      status = this.ball_seed_csid_fold_obj.value[csid_key]
    } else if (type === 1) {
      status = this.progress_csid_fold_obj.value[csid_key]
    } else if (type === 2) {
      status = this.not_begin_csid_fold_obj.value[csid_key]
    }
    const matchs = lodash.get(MatchMeta, 'complete_matchs', [])
    matchs.forEach(item => {
      if (!is_fold_all && (!item || item.csid != obj.csid)) return
      const key = this.get_match_fold_key(item)
      // 设置联赛折叠状态
      this.set_custom_tid_fold_info(item, !status)
      // 全部
      if (!type) return this.set_match_fold(key, { show_card: !status })
      // 进行中
      if (type === 1 && [1,110].includes(+item.ms)) return this.set_match_fold(key, { show_card: !status })
      // 未开赛
      if (type === 2 && ![1,110].includes(+item.ms)) return this.set_match_fold(key, { show_card: !status })
    })
    // 全部
    if (!type) return this.set_ball_seed_csid_fold_obj(csid_key, !status)
    // 进行中
    if (type === 1) return this.set_progress_csid_fold_obj(csid_key, !status)
    // 未开赛
    if (type === 2) return this.set_not_begin_csid_fold_obj(csid_key, !status)

  }

  /**
   * @description 折叠全部赛事
   */
  handler_fold_all_matchs_csid () {
    const matchs = lodash.get(MatchMeta, 'complete_matchs', [])
    if (matchs.length < 1) return
    const status = this.all_csid_fold_status.value
    matchs.forEach(item => {
      if (!item) return
      const key = this.get_match_fold_key(item)
      this.set_match_fold(key, { show_card: !status })
    })
    this.all_csid_fold_status.value = !this.all_csid_fold_status.value
  }

  set_all_csid_fold_status (val) {
    this.all_csid_fold_status.value = val
  }

  /**
   * @description 设置赛事次要玩法高度
   * @param { match } 赛事对象 
   */
  set_match_tab_content (match) {
    const key = this.get_match_fold_key(match)
    const show_tab_content = !lodash.get(this.match_mid_fold_obj.value, `${key}.show_tab_content`, false)
    this.set_match_fold(key, { show_tab_content  })
  }

  /**
   * @description 设置赛事次要玩法是否有次要玩法
   * @param { match } 赛事对象 
   */
  set_match_show_tab (match) {
    const key = this.get_match_fold_key(match)
    const show_tab = !lodash.get(this.match_mid_fold_obj.value, `${key}.show_tab`, false)
    this.set_match_fold(key, { show_tab  })
  }
  /**
   * @description 获取对象折叠的  key
   * @param { match } 赛事对象 
   * @returns string
   */
  get_match_fold_key (match) {
    const { mid, custom_tid, warehouse_type = '', start_flag = '' } = match
    return warehouse_type ? `${warehouse_type}_${custom_tid}_${mid}` : `${custom_tid}_${mid}`
    // return warehouse_type ? `${warehouse_type}_${custom_tid}_${mid}_${start_flag}` : `${custom_tid}_${mid}_${start_flag}`
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
  }
  /**
   * @description 获取折叠对象的key
   */
  get_fold_key (match) {
    const { csid, warehouse_type = '' } = match
    const csid_key = warehouse_type ? `${warehouse_type}_csid_${csid}` : `csid_${csid}`
    return csid_key
  }
  // 清除联赛折叠信息
  clear_custom_tid_fold_info () {
    this.custom_tid_fold_info.value = {}
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
    this.clear_custom_tid_fold_info()
    //全部联赛 折叠
    this.set_all_csid_fold_status(true)
    //已开赛 折叠
    this.progress_csid_fold_obj.value={}
    //未开赛折叠
    this.not_begin_csid_fold_obj.value={}
  }
  /**
   * 是否显示次要玩法
   * @param {match} 赛事对象 
   */
  compute_show_tab_play = (match) => {

    // 复刻版 3184 需求 只做足球
    if (match.csid != 1) return false

    const { compose = false, cos15Minutes = false, cosBold = false, cosCorner = false, cosOutright = false, cosOvertime = false, cosPenalty = false, 
      cosPromotion = false, cosPunish = false, hpsAdd = [], cds = '', mbmty = '' } = match;
    
    let is_show = compose || cos15Minutes || cosBold || cosCorner || cosOutright || cosOvertime || cosPenalty || cosPromotion || cos15Minutes || 
    cosPunish || hpsAdd.length > 0

    // 电子篮球 不显示次要玩法 对应 BUG 44554
    if(['B03', 'BE'].includes(cds) && mbmty === 2) is_show = false

    return is_show
  }
}

export default new MatchFold()