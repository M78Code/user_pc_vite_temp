/*
 * @Author: cable
 * @Date: 2022-04-04 17:13:55
 * @Description: 菜单停留时间统计  统计今日足球 今日篮球停留时间  发送埋点
 */

import utils from "src/public/utils/utils.js"
import { store } from "src/store/index.js"
const menu_stay_time = {
  // 菜单页面变化时间 数组
  menu_change_time_arr:[],
  /**
   * @Description 添加一个菜单或页面变化的时间 
   * @param {undefined} undefined
  */
  add_menu_change_time(){
    // 当前路由加菜单ID
    let page = `${window.vue.$route.name}_${$menu.menu_data.cur_level2_menu}`
    let last = _.last(this.menu_change_time_arr) || {}
    if(last.page != page){
      this.menu_change_time_arr.push({
        page,
        time:new Date().getTime()
      })
    }
  },
  /**
   * @Description 统计各个菜单停留时间  每秒执行一次 
   * @param {undefined} undefined
  */
  run_count:0,
  statistical_stay_time(){
    this.run_count++
    if(this.run_count % 2 == 0) return
    let today_key = (new Date().Format('_yyyyMMdd')) + store.getters.get_user.userName
    // 当前页面
    let cur_page = {
      page:`${window.vue.$route.name}_${$menu.menu_data.cur_level2_menu}`,
      time:new Date().getTime()
    }
    this.menu_change_time_arr.push(cur_page)
    // 各个页面总停留时间对象
    let stay_time_obj = {}
    // 获取本地保存的统计时间
    let json = localStorage.getItem('stay_time_obj')
    if(json){
      stay_time_obj = JSON.parse(json)
    }
    if(!stay_time_obj[today_key]){
      stay_time_obj[today_key] = {
        home_3020101:0,
        home_3020102:0
      }
    }
    let keys = Object.keys(stay_time_obj[today_key])
    let pre_item = {
      page:''
    }
    // 遍历所有菜单改变时间对象
    this.menu_change_time_arr.forEach( item => {
      if(keys.includes(pre_item.page)){
        stay_time_obj[today_key][pre_item.page] += item.time - pre_item.time
      }
      pre_item = item
    })
    this.menu_change_time_arr = [cur_page]
    localStorage.setItem('stay_time_obj',JSON.stringify(stay_time_obj))
    this.send_zhuge(stay_time_obj[today_key])
  },
  /**
   * @Description 发送诸葛埋点事件 
   * @param {undefined} undefined
  */
  send_zhuge(stay_time_obj){
    // 今日时间key值
    let today_key = (new Date().Format('_yyyyMMdd')) + store.getters.get_user.userName
    // 是否发送过埋点事件对象
    let is_send_stay_time = {}
    let json = localStorage.getItem('is_send_stay_time')
    if(json){
      is_send_stay_time = JSON.parse(json)
    }
    // 遍历统计时间
    _.each(stay_time_obj, (time,key) => {
      time = time / 1000
      let eventLabel,send_stay_time_key,stay_time_str;
      if(key == 'home_3020101'){
        eventLabel = 'PC_今日_足球_页面停留'
      }else if(key == 'home_3020102'){
        eventLabel = 'PC_今日_篮球_页面停留'
      }
      if(time > 1200){
        send_stay_time_key = `${today_key}_${key}_1200`
        stay_time_str = '1200S+'
      }
      else if(time > 600){
        send_stay_time_key = `${today_key}_${key}_600`
        stay_time_str = '600S-1200S'
      }
      else if(time > 180){
        send_stay_time_key = `${today_key}_${key}_180`
        stay_time_str = '180S-600S'
      }
      else if(time > 61){
        send_stay_time_key = `${today_key}_${key}_61`
        stay_time_str = '61S-180S'
      }
      else if(time > 31){
        send_stay_time_key = `${today_key}_${key}_31`
        stay_time_str = '31S-60S'
      }
      else if(time > 6){
        send_stay_time_key = `${today_key}_${key}_6`
        stay_time_str = '6S-30S'
      }
      else if(time > 1){
        send_stay_time_key = `${today_key}_${key}_1`
        stay_time_str = '1S-5S'
      }
      // 符合条件并且未发送过埋点 发送一次埋点事件
      if(eventLabel && send_stay_time_key && !is_send_stay_time[send_stay_time_key]){
        utils.send_zhuge_event(eventLabel, {"停留时长分布": stay_time_str,"停留时长":parseInt(time)});
        is_send_stay_time[send_stay_time_key] = true
      }
    })
    localStorage.setItem('is_send_stay_time',JSON.stringify(is_send_stay_time))
  }
};
export default menu_stay_time;