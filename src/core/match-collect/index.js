/**
 * @description 赛事收藏
 */
import { ref } from 'vue'
import { api_common } from "src/api/index.js";
import UserCtr from 'src/core/user-config/user-ctr.js'
import MatchCtr from "src/core/match-list-h5/match-class/match-ctr.js";
import { MenuData} from "src/output/module/menu-data.js"
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from 'src/output/module/match-data-base.js'

class MatchCollect {
  constructor () {
    // 是否获取过收藏
    this.is_get_collect = false
    // 联赛收藏对象
    this.league_tid_collect_obj = ref({})
    // 赛事收藏对象
    this.match_mid_collect_obj = ref({})
    // 赛事收藏信息
    this.match_collect_obj = { 1: [], 2: [], 3: [] }
  }

  handle_match_collect (value) {
    const { mid,tid } = value
      const match_state = this.get_match_collect_state(value)
      // console.log('handle_match_collecthandle_match_collecthandle_match_collect', match_state)
      api_common.add_or_cancel_tournament({
        mid,
        cf: match_state ? 0 : 1,
        cuid: UserCtr.get_uid()
      }).then(res => {
        if(res && res.code == '200' && MenuData.is_collect()){
          useMittEmit(MITT_TYPES.EMIT_COLLECT_MATCH_OZ);
        }
        if (+res.code !== 200) return
      })
      // 收藏页手动处理数据
      MenuData.is_collect() && MatchMeta.set_collect_match(value, 2)
      this.set_match_collect_state(value, !match_state)
  }

  /**
   * @description 设置联赛收藏状态
   * @param { match } 赛事对象 
   * @param { is_collect } 收藏 or 取消收藏 
   */
  handle_league_collect_state (tid) {
    // 联赛收藏状态
    const league_collect = !this.get_league_collect_state(tid)
    this.set_league_collect_state(tid, league_collect)
    // 赛事 mids
    const match_mids = lodash.get(MatchMeta, 'match_mids', [])
    match_mids.forEach(mid => {
      // 获取赛事对象信息
      const match = MatchDataBaseH5.get_quick_mid_obj(mid)
      if (!match || match.tid !== tid) return
      // 赛事收藏状态
      this.set_match_collect_state(match, league_collect)
    })
  }
  /**
   * @description 设置联赛收藏对象
   * @param { match } 赛事对象 
   * @param { is_collect } 收藏 or 取消收藏 
   */
  set_league_collect_state (tid, is_collect = false) {
    if (!tid) return
    const league_key = `collect_tid_${tid}`
    Object.assign(this.league_tid_collect_obj.value, {
      [league_key]: { league_collect: is_collect }
    })
  }
  /**
   * @description 设置赛事收藏对象
   * @param { match } 赛事对象 
   * @param { is_collect } 收藏 or 取消收藏 
   */
  set_match_collect_state (match, is_collect = false) {
    if (!match) return
    const match_key = typeof match === 'string' ? `collect_mid_${match}` : `collect_mid_${match.mid}`
    // 赛事 是否 收藏
    Object.assign(this.match_mid_collect_obj.value, {
      [match_key]: { match_collect: is_collect }
    })
    // console.log(match)
    // console.log('set_match_collect_stateset_match_collect_stateset_match_collect_stateset_match_collect_state', this.match_mid_collect_obj.value)
  }
  /*
   * @description 获取联赛收藏状态
   * @param { tid } 赛事 tid
   */
  get_league_collect_state (tid) {
    const league_key = `collect_tid_${tid}`
    const league_collect = lodash.get(this.league_tid_collect_obj.value, `${league_key}.league_collect`, false)
    return league_collect
  }
  /*
   * @description 获取赛事收藏状态
   * @param { match } 赛事 对象
   */
  get_match_collect_state (match) {
    const { mid = '' } = match
    const match_key = `collect_mid_${mid}`
    const match_collect = lodash.get(this.match_mid_collect_obj.value, `${match_key}.match_collect`, false)
    return match_collect
  }

  /**
   * @description 获取 赛事 收藏数据
   * @params list 赛事数据
   * @returns 
   */
  get_collect_match_data (list = []) {
    return new Promise((resolve, reject) => {
      api_common.get_new_collect_matches({
        matchType: 0,
        cuid: UserCtr.get_uid()
      }).then(res => {
        if(lodash.get(res,'code') == 200){
          this.clear_collect_info()
          const data = lodash.get(res,'data');
          Object.assign(this.match_collect_obj, { ...data })
          // Object.keys(data).forEach(key => {
          //   const item = data[key]
          //   if (item.tids && item.tids.length > 0) {
          //     item.tids.forEach(i => {
          //       this.set_league_collect_state(i, true)
          //     })
          //   }
          //   if (item.mids && item.mids.length > 0) {
          //     item.mids.forEach(i => {
          //       this.set_match_collect_state(i, true)
          //     })
          //   }
          // })
          // console.log('get_new_collect_matchesget_new_collect_matches', this.match_mid_collect_obj.value, this.league_tid_collect_obj.value)
          this.set_is_get_collect(true)
          list && list.length > 0 && list.forEach(match => {
            this.handle_collect_state(match)
          })
          resolve()
        }
      })
    })
  }
  /**
   * @description 处理置收藏状态
   * @param { match } 赛事对象
   * @remarks: 1. 根据 collectMatchesPB， tids 有值，则根据 tid 及 exclude 判断
   *           2. mids 均需要判断
   */
  handle_collect_state (match) {
    this.match_collect_obj.value
    const map_menu = { 100: 2, 3000: 3 }
    const menu_lv_v1 = lodash.get(MenuData.current_lv_1_menu, 'mi')
    const match_type = lodash.get(map_menu, `${menu_lv_v1}`, 1)
    // console.log('handle_collect_statehandle_collect_statehandle_collect_state', match_type, MenuData)
    const collect_obj = lodash.get(this.match_collect_obj, `${match_type}`)
    const { tid, mid } = match
    let league_collect_state = false
    let match_collect_state = false
    if (collect_obj) {
      const { mids = [], exclude = [], tids = [] } = collect_obj
      // 根据 tid 是否是收藏赛事
      league_collect_state = tids.includes(tid)
      if (league_collect_state) match_collect_state = true
      if (tids.length > 0) {
        if (league_collect_state && exclude.length > 0) {
          // 根据剔除的数据，继续判断该赛事的收藏状态
          const exclude_obj = lodash.find(exclude, e => e.tids === tid)
          if (exclude_obj) {
            const length = lodash.get(exclude_obj.mids, 'length', 0)
            match_collect_state = !(length > 0 && exclude_obj.mids.includes(mid))
          }
        }
      }
      if (mids.length > 0 && mids.includes(mid)) {
        match_collect_state = true
      }
    }
    // 该联赛是否收藏
    this.set_league_collect_state(tid, league_collect_state)
    // 该赛事是否收藏
    this.set_match_collect_state(match, match_collect_state)
  }
  /**
   * @description 重置收藏对象
   */
  clear_collect_info () {
    // this.league_tid_collect_obj.value = {}
    // this.match_mid_collect_obj.value = {}
    // this.match_collect_obj = { 1: [], 2: [], 3: [] }
  }

  /**
   * @description 设置是否获取过收藏
   * @param {} val 
   */
  set_is_get_collect (val) {
    this.is_get_collect = val
  }
}

export default new MatchCollect()