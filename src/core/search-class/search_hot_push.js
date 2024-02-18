/*
 * @Author: Cable
 * @Date: 2020-09-04 14:35:38
 * @Description: 搜索热推赛事
 */

import { api_search } from "src/api/index.js";
import lodash from "lodash";

export const scroll_to_match = {mid:0}

export default class SearchHotPush {
  // 热推赛事名称
  hot_push_name = ''
  /**
   * @description: 构造函数
   * @param {Object} view Vue实例
   * @return {undefined} undefined
   */
  constructor(view) {
    // 视图对象
    this.view = view
    this.interval_id2 = setTimeout(()=>{
      this.get_hot_push()
    },1000)
    // this.start_timer()
  }
  /**
   * @Description 启动定时器 
   * @param {undefined} undefined
  */
  // start_timer(){
  //   this.interval_id = setInterval(() => {
  //     this.get_hot_push()
  //   },30000)
  // }
  /**
  * @Description:获取搜索热推赛事
  * @return {undefined} undefined
  */
  get_hot_push(){
    api_search.get_hot_push().then( res => {
      let data = lodash.get(res,'data.data') || {}
      if(lodash.get(res,'data.code') == 200 && data.showTime){
        // 远程服务器时间
        let remote_time = new Date() * 1 - this.view.$store.getters.get_timestamp.local_time + this.view.$store.getters.get_timestamp.remote_time 
        let ymd = (new Date()).Format("yyyy-MM-dd");
        let show_time_arr = data.showTime.split('-')
        let show_start_time = new Date(`${ymd} ${show_time_arr[0]}`) * 1
        let show_end_time = new Date(`${ymd} ${show_time_arr[1]}`) * 1
        // 如果生效时间在范围内  并且展示时间在范围内  
        if(remote_time >= data.effectiveTimeStart && remote_time <= data.effectiveTimeEnd && remote_time >= show_start_time && remote_time <= show_end_time){
          this.hot_push_name = data.word
          this.data = data
          this.is_hot_push = true
          return
        }
      }
      // TODO:
      // this.hot_push_name = i18n_t('common.search')
      this.is_hot_push = false
    }).catch(err => {
      console.error(err)
      // TODO:
      // this.hot_push_name = i18n_t('common.search')
      this.is_hot_push = false
    });
  }
  /**
   * @Description 跳转详情 
   * @param {undefined} undefined
  */
  go_to_details(){
    const { matchId, isChampion, tid, csid } = this.data || {}
    if(!this.is_hot_push || !matchId){
      this.view.show_search()
      return
    } 
    // 如果是冠军
    if(isChampion == 1){
      let menu_arr = this.data.menuId.split(',')
      menu_arr.shift()
      window.$menu.specialMenuChoose(menu_arr)
      scroll_to_match.mid = matchId
      this.view.useMittEmit('scroll_to_hot_push_match', matchId)
    }else{
      this.view.$router.push({
        name: 'details',
        params: {
          mid: matchId,
          tid,
          csid
        }
      })
    }
  }
  /**
   * @Description 销毁 
   * @param {undefined} undefined
  */
  destroy(){
    clearInterval(this.interval_id)
    clearTimeout(this.interval_id2)
  }
}
