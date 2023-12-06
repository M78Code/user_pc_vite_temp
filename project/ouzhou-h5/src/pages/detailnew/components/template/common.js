import { reactive } from "vue";
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"

const other = {
  is_detail: true,
  // 投注类型 “vr_bet”， "common_bet", "guanjun_bet", "esports_bet"
  // 根据赛事纬度判断当前赛事属于 那种投注类型
  bet_type: 'common_bet',
  // 设备类型 1:H5，2：PC,3:Android,4:IOS,5:其他设备
  device_type: 1,
  // 数据仓库类型
  match_data_type: "h5_detail", // h5_detail
  // match_data_type: "h5_list", // h5_detail
  play_name: ''
}

export const state = reactive({
  active: -1
})

const common = {
  /**
   * @param {TYPES.Ol} ol 
   */
  betClick(ol) {
    if (ol.os == 2 || ol._hs == 1) return;
    if(state.active == ol.oid){
      state.active = -1
    }else {
      state.active = +ol.oid
    }
    
    const { oid, _hid, _hn, _mid } = ol
    set_bet_obj_config({
      oid, _hid, _hn, _mid
    }, other)
  },
  setPlayName(name){
    other.play_name = name
  },
  /**
   * @param {TYPES.OddInfo} oddInfo
   * @returns {TYPES.OlItemType}
   */
  getOlType(oddInfo){
    if(oddInfo.hpt == 0){
      if(oddInfo.title.length){
        return 'fill'
      }
    }

    return 'default'
  }
}

export default common