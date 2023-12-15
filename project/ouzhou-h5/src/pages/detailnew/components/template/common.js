import { reactive } from "vue";
import { set_bet_obj_config } from "src/core/bet/class/bet-box-submit.js"
import DefaultTemplate from './DefaultTemplate.vue';
import TemplateColumn from './TemplateColumn.vue';
import Template14 from './Template14.vue';
import Template18 from './Template18.vue';

const hideTitle = [0,18]
const innerTitle = [12,14]
const templates = new Map([[4,TemplateColumn],[6,TemplateColumn],[14,Template14],[18,Template18]])

const rowHpid = '106,107'

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
    const {hpt} = oddInfo
    if(oddInfo.hpt == 0){
      if(oddInfo.title.length){
        return 'fill'
      }
    }else if(hpt == 3){
      if(!common.haveTitle(oddInfo)){
        return 'column'
      }
    }else if(oddInfo.hpt == 18){
      return 'fill'
    }
    return 'default'
  },
  /**
   * @param {TYPES.OddInfo} oddInfo
   * @returns {TYPES.OlItemType}
   */
  getOlTypeOfTemplate4(oddInfo){
    if(oddInfo.hpid == '344'){
      return 'column'
    }
    return 'default'
  },
  /** 是否显示投注项标题
   * @param {TYPES.OddInfo} oddInfo 
   * @returns {Boolean}
   */
  showTitle(oddInfo){
    if(hideTitle.includes(oddInfo.hpt)||innerTitle.includes(oddInfo.hpt)){
      return false
    }
    return true
  },
  /** 是否显示投注项内联标题
   * @param {TYPES.OddInfo} oddInfo 
   * @returns {Boolean}
   */
  showInnerTitle(oddInfo){
    return innerTitle.includes(oddInfo.hpt)
  },
  /**
   * 
   * @param {TYPES.OddInfo} oddInfo 
   * @returns {{title:boolean,innerTitle:boolean,olType:TYPES.OlItemType}}
   */
  getTemplateState(oddInfo){
    return {
      title: common.showTitle(oddInfo),
      innerTitle: common.showInnerTitle(oddInfo),
      olType: common.getOlType(oddInfo),
    }
  },
  /**
   * @param {TYPES.OddInfo} oddInfo 
   * @returns {Boolean}
   */
  haveTitle(oddInfo){
    const len = oddInfo.title.length
    return len > 1 && len <= 4
  },
  computedTemplate(hpt){
    if(templates.has(hpt)){
      return templates.get(hpt)
    }
    return DefaultTemplate
  }
}

export default common