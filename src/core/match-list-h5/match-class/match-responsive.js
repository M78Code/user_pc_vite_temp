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
    // 球种下联赛对应的数量
    this.ball_seed_league_count = ref({})
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
}

export default new MatchResponsive()