/**
 * @description 赛事收藏
 */
import { ref } from 'vue'
import { api_common } from "src/api/index.js";
import UserCtr from 'src/core/user-config/user-ctr.js'
import MenuData from "src/core/menu-h5/menu-data-class.js"
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from 'src/core'

class MatchCollect {
  constructor () {
    // 联赛收藏对象
    this.league_tid_collect_obj = ref({})
    // 赛事收藏对象
    this.match_mid_collect_obj = ref({})
    // 赛事收藏对象
    this.match_collect_obj = { 1: [], 2: [], 3: [] }
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
    // 联赛 是否 收藏
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
    const match_key = `collect_mid_${match.mid}`
    // 赛事 是否 收藏
    Object.assign(this.match_mid_collect_obj.value, {
      [match_key]: { match_collect: is_collect }
    })
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
    const { mid } = match
    const match_key = `collect_mid_${mid}`
    const match_collect = lodash.get(this.match_mid_collect_obj.value, `${match_key}.match_collect`, false)
    return match_collect
  }
  /**
   * @description 获取 赛事 收藏数据
   * @returns 
   */
  get_collect_matche_data () {
    return new Promise((resolve, reject) => {
      api_common.get_new_collect_matches({
        matchType: 0,
        cuid: UserCtr.get_cuid()
      }).then(res => {
        if(lodash.get(res,'code') == 200){
          const data = lodash.get(res,'data');
          Object.assign(this.match_collect_obj, { ...data })
        }
      }).finally(() => resolve())
    })
  }
  /**
   * @description 处理置收藏状态
   * @param { match } 赛事对象
   * @remarks: 根据 collectMatchesPB， tids 有值，则根据 tid 及 exclude 判断， tids 没值 则根据 mids 判断
   */
  handle_collect_state (match) {
    const map_menu = { 100: 2, 3000: 3 }
    const menu_lv_v1 = lodash.get(MenuData.current_lv_1_menu, 'mi')
    const match_type = lodash.get(map_menu, `${menu_lv_v1}`, 1)
    const collect_obj = lodash.get(this.match_collect_obj, `${match_type}`)
    const { tid, mid } = match
    let league_collect_state = false
    let match_collect_state = false
    if (collect_obj) {
      const { mids = [], exclude = [], tids = [] } = collect_obj
      // 根据 tid 是否是收藏赛事
      league_collect_state = tids.includes(+tid)
      if (tids.length > 0) {
        // 该联赛是否收藏
        this.set_league_collect_state(tid, league_collect_state)
        if (league_collect_state && exclude.length > 0) {
          // 根据剔除的数据，继续判断该赛事的收藏状态
          const exclude_obj = _.find(exclude, e => e.tids === +tid)
          if (exclude_obj) {
            const length = _.get(exclude_obj.mids, 'length', 0)
            match_collect_state = !(length > 0 && exclude_obj.mids.includes(+mid))
          }
        }
      } else if (mids.length > 0) {
        match_collect_state = mids.includes(+mid)
      }
    }
    // 该联赛是否收藏
    if (!`collect_tid_${tid}` in this.league_tid_collect_obj.value) this.set_league_collect_state(tid, league_collect_state)
    // 该赛事是否收藏
    this.set_match_collect_state(match, match_collect_state)
  }
}

export default new MatchCollect()