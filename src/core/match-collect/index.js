/**
 * @description 赛事收藏
 */
import { ref } from 'vue'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from 'src/core'

class MatchCollect {
  constructor () {
    // 联赛收藏对象
    this.league_tid_collect_obj = ref({})
    // 赛事收藏对象
    this.match_mid_collect_obj = ref({})
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
}

export default new MatchCollect()