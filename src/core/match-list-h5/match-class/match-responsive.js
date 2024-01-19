import { ref } from 'vue'
import { use_sports_play_title } from 'src/output/module/constant-utils.js'
import { MenuData } from "src/output/index";

/**
 * @description 赛事页面级别的 响应式参数
 */

class MatchResponsive {
  constructor () {
    this.init()
  }
  init () {
    // 是否元数据计算
    this.is_compute_origin = ref(false)
    // 赛事默认 hpid
    this.match_hpid_info = ref({})
    // 球种对应的数量
    this.ball_seed_count = ref({})
    // 球种对应的下拉玩法  ouzhou-h5 
    this.ball_seed_play_methods = ref({})
    // 联赛对应的数量
    this.ball_seed_league_count = ref({})
    // 其他仓库联赛对应的数量
    this.ball_other_seed_league_count = ref({})
    // 投注项
    this.active_odd = ref('')
    // 赛事显示、隐藏信息
    this.show_match_info = ref({})
    // 是否 接口 导致的数据变更 是则红升绿降和进球动画 不显示
    this.is_http_update_info = ref(true)
    // 复刻版下的热门联赛
    this.popular_league = ref({})
    // 次要玩法展开映射
    this.secondary_unfold_map = ref({})
    //是否欧洲版联赛详情
    this.is_league_detail = ref(false);
  }

  /**
   * @description 设置欧洲版联赛详情
   * @param {Boolean} val
  */
  set_is_league_detail(val){
    this.is_league_detail.value = val
  }

   /**
   * @description 设置赛事显示、隐藏信息
   * @param {Boolean} val
   */
  set_show_match_info (key, flag) {
    Object.assign(this.show_match_info.value, {
      [key]: flag
    })
  }
  /**
   * @description 设置复刻版下的热门联赛
   * @param {*} val 
   */
  set_popular_league (val) {
    this.popular_league.value = val
  }
  /**
   * @description 重置赛事显示、隐藏信息
   * @param {Boolean} val
   */
  clear_show_match_info() {
    this.show_match_info.value = {}
  }

  /**
   * @description 设置是否计算元数据
   * @param {Boolean} val
   */
  set_is_compute_origin (val) {
    this.is_compute_origin.value = val
  }

  set_is_http_update_info (val) {
    this.is_http_update_info.value = val
  }

  /**
   * @description 设置 hpid
   * @param {String} hpid 
   */
  set_match_hpid (hpid, csid) {
    const key = this.get_hpid_key(csid)
    Object.assign(this.match_hpid_info.value, {
      [key]: hpid
    })
  }

  // 重置球种玩法
  reset_match_hpid_by_csid (csid = '') {
    const sports_play_title = use_sports_play_title()
    const id = csid ? csid : MenuData.menu_csid
    if (!id) return
    const item = sports_play_title[id]
    const key = this.get_hpid_key(csid)
    const hpid = lodash.get(item, '[0].hpid', '1')
    Object.assign(this.match_hpid_info.value, {
      [key]: hpid
    })
  }

  get_hpid_key (csid) {
    const id = csid ? csid : MenuData.menu_csid
    const key = `csid_${id}`
    return key
  }

  /**
   * @description 设置开赛、未开赛对应球种的数量
   * @param {string} key 
   * @param {number} length 
   */
  set_ball_seed_count (key, length) {
    Object.assign(this.ball_seed_count.value, {
      [key]: length
    })
  }

  /**
   * @description 设置次要玩法展开映射
   */
  set_secondary_unfold_map (val) {
    this.secondary_unfold_map.value = val
  }

  /**
   * @description 重置次要玩法展开映射
   */
  clear_secondary_unfold_map () {
    this.secondary_unfold_map.value = {}
  }

   /**
   * @description 设置球种的 数量
   * @param {Object} match 
   */
   set_default_ball_seed_count (match) {
    const { csid } = match
    const key = `default_csid_${csid}`
    if (this.ball_seed_count.value[key]) {
      this.ball_seed_count.value[key]++
    } else {
      Object.assign(this.ball_seed_count.value, {
        [key]: 1
      })
    }
  }

  /**
   * @description 重置球种的 数量
   */
  clear_ball_seed_count () {
    this.ball_seed_count.value = {}
  }

  /**
   * @description 获取球种下拉玩法
   */
  get_ball_seed_methods (match) {
    const { hps, csid } = match
    if (hps && hps.length > 0 && hps[0].hl && hps[0].hl[0] && hps[0].hl[0].ol) this.set_ball_seed_play_methods(`hps_csid_${csid}`, hps)
  }

  /**
   * @description 设置对应球种的玩法
   * @param {string} key 
   * @param {Array} value 
   */
  set_ball_seed_play_methods (key, value) {
    !this.ball_seed_play_methods.value[key] && Object.assign(this.ball_seed_play_methods.value, {
      [key]: value
    })
  }

  /**
   * @description 设置联赛对应的数量
   * @param { match } 赛事对象 
   */
  set_ball_seed_league_count (match) {
    const key = this.get_league_count_key(match)
    if (this.ball_seed_league_count.value[key]) {
      this.ball_seed_league_count.value[key]++
    } else {
      Object.assign(this.ball_seed_league_count.value, {
        [key]: 1
      })
    }
  }
  /**
   * @description 清除联赛对应的数量
   */
  clear_ball_seed_league_count () {
    this.ball_seed_league_count.value = {}
  }

  /**
   * @description 设置联赛对应的数量
   * @param { match } 赛事对象 
   */
  set_other_ball_seed_league_count (match) {
    const key = this.get_league_count_key(match)
    if (this.ball_other_seed_league_count.value[key]) {
      this.ball_other_seed_league_count.value[key]++
    } else {
      Object.assign(this.ball_other_seed_league_count.value, {
        [key]: 1
      })
    }
  }
  /**
   * @description 清除联赛对应的数量
   */
  clear_other_ball_seed_league_count () {
    this.ball_other_seed_league_count.value = {}
  }

  /**
   * @description 联赛key
   */
  get_league_count_key (match) {
    const { custom_tid, warehouse_type = '' } = match
    const key = warehouse_type ? `${warehouse_type}_tid_${custom_tid}` : `tid_${custom_tid}`
    return key
  }

  set_active_odd (val) {
    this.active_odd.value = val
  }

  clear_active_odd () {
    this.active_odd.value = ''
  }
}

export default new MatchResponsive()