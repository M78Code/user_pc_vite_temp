import lodash from 'lodash'
import { useMittEmit, MITT_TYPES } from "src/core/mitt/index.js";

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
    this.show_mids = ['3532454', '3532450', '3532445', '240143662858637314']
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
    this.show_mids = mids
    if(old_mids != mids.join(',')){
      this.show_mids_change()
    }
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
    useMittEmit(MITT_TYPES.EMIT_MiMATCH_LIST_SHOW_MIDS_CHANGE)
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
