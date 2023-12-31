import lodash from 'lodash'
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";
import { MatchDataWarehouse_PC_List_Common as MatchListData } from 'src/output/module/match-data-base.js';
import { MenuData } from 'src/output/project/index.js'
import MatchListCardData from "./match-card/module/match-list-card-data-class";
import { load_data_state } from './match-list-composition'
class MatchListScrollClass {
  constructor() {
    this.init()
  }

  init() {
    // 列表滚动条scrollTop
    this.scroll_top = 0
    this.fetch_match_list_time = 0
    // 列表加载时间记录
    this.list_loading_time_record =  []
    // 可视区域赛事ID
    this.show_mids = [],
    // 当前是否是首页 且是否有15分钟和特色赛事卡片 的高度
    this.special_offset = 0
  }

  /**
     * @Description 设置列表滚动条scrollTop 
     * @param {undefined} undefined
    */
  set_scroll_top(scroll_top){
    this.scroll_top = parseInt(scroll_top)
  }

  /**
   * @Description 设置可视区域赛事ID 
   * @param {undefined} undefined
  */
  set_show_mids(mids){
    let old_mids = this.show_mids.join(',')
    if(old_mids != mids.join(',')){
      // 将老的可视区域赛事id 设置为不活跃
      MatchListData.set_inactive_mids(this.show_mids)
      // 将新的可视区域赛事id 设置为活跃
      MatchListData.set_active_mids(mids)
      this.show_mids_change()
    }
    this.show_mids = mids
  }
  /**
   * @Description 添加可视赛事ID 
   * @param {string} mid 赛事ID
   * @param {undefined} undefined
  */
  add_show_mid(mid){
    mid = String(mid)
    if(!this.show_mids.includes(mid)){
      this.show_mids.push(mid)
      this.show_mids_change()
    }
  }
  /**
   * @Description 移除可视赛事ID 
   * @param {string} mid 赛事ID
   * @param {undefined} undefined
  */
  remove_show_mid(mid){
    mid = String(mid)
    let index = this.show_mids.findIndex(item => item == mid)
    if(index > -1){
      this.show_mids.splice(index,1)
      this.show_mids_change()
    }
  }
  /**
   * @Description 清空可视赛事ID 
   * @param {undefined} undefined
  */
  clear_show_mid(){
    this.show_mids = []
  }
  /**
   * @Description 可视赛事ID改变 
   * @param {undefined} undefined
  */
  show_mids_change(){
    if (MenuData.is_kemp() || MenuData.is_common_kemp() || load_data_state.value != 'data') return
    useMittEmit(MITT_TYPES.EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE)
    // lodash.debounce(useMittEmit(MITT_TYPES.EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE), 400, { leading: true, trailing: true })
    //生产 bymids限蘋目前设置每秒3次， 滚动节流不能超过1秒3次  滚动产生的bymids调用不走全局节流逻辑
    // lodash.debounce(useMittEmit(MITT_TYPES.EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE), 400, { leading: true, trailing: true })
  }
  /**
   * @Description 初始化列表加载时间 
   * @param {undefined} undefined
  */
  init_loading_time_record(){
    if(lodash.get(window, 'env.config.DOM_ID_SHOW')) {
      let list_loading_time_record = sessionStorage.getItem('list_loading_time_record')
      if(list_loading_time_record){
        this.list_loading_time_record = JSON.parse(list_loading_time_record)
      }
    }
  }
  /**
   * 设置当前的页面是否有特殊高度
   */
  set_special_offset(special_height, is_add) {
    // 如果是叠加在原来的高度上  加等special_height
    if (is_add) {
      this.special_offset += special_height;
    } else {
      this.special_offset = special_height
    }
    MatchListCardData.set_list_version()
  }

  /**
   * @Description 开始loading
   * @param {undefined} undefined
  */
  start_loading(){
    if(lodash.get(window, 'env.config.DOM_ID_SHOW')) {
      // 最多只保存5条记录
      if(this.list_loading_time_record.length >= 5){
        this.list_loading_time_record.splice(4,1)
      }
      this.list_loading_time_record.unshift({
        duration:0,
        start: new Date().Format('yyyy-MM-dd hh:mm:ss'),
        end:'',
        start_time: new Date().getTime(),
        end_time: 0,
      })
    }
  }
  /**
   * @Description 结束loading 
   * @param {undefined} undefined
  */
  end_loading(){
    if(lodash.get(window, 'env.config.DOM_ID_SHOW')) {
      let last_record = this.list_loading_time_record[0] || {}
      // 如果存在开始记录 才修改 
      if(last_record.end_time == 0){
        last_record.end_time = new Date().getTime()
        last_record.end = new Date().Format('yyyy-MM-dd hh:mm:ss')
        last_record.duration = last_record.end_time - last_record.start_time
        sessionStorage.setItem('list_loading_time_record',JSON.stringify(this.list_loading_time_record))
      }
    }
  }
}

export default new MatchListScrollClass()
