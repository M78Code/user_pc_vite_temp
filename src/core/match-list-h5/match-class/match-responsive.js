import { ref } from 'vue'

/**
 * @description 赛事页面级别的 响应式参数
 */

class MatchResponsive {
  constructor () {
    this.init()
  }
  init () {
    this.match_hpid = ref('1')
    // 球种对应的数量
    this.ball_seed_count = ref({})
    // 球种对应的下拉玩法  ouzhou-h5 
    this.ball_seed_play_methods = ref({})
    // 联赛对应的数量
    this.ball_seed_league_count = ref({})
    // 其他仓库联赛对应的数量
    this.ball_other_seed_league_count = ref({})
  }

  /**
   * @description 设置 hpid
   * @param {String} hpid 
   */
  set_match_hpid (hpid) {
    this.match_hpid.value = hpid
  }

  /**
   * @description 设置对应球种的key
   * @param {string} key 
   * @param {number} length 
   */
  set_ball_seed_count (key, length) {
    Object.assign(this.ball_seed_count.value, {
      [key]: length
    })
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
    const { tid, warehouse_type = '' } = match
    const key = warehouse_type ? `${warehouse_type}_tid_${tid}` : `tid_${tid}`
    return key
  }
}

export default new MatchResponsive()