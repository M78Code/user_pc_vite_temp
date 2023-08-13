/*
 * @Author: Cable
 * @Date: 2021-09-07 12:45:16
 * @Description: 列表基础数据仓库  只保存主客队信息和赛事logo基础数据  一天拉一次接口更新数据
 */

import { api_match } from "src/public/api/index.js";

class MatchListBasicDataClass {
  /**
   * @description: 构造函数
   * @return {undefined} undefined
   */
  constructor(){
     // 所有赛事对象
    this.mid_obj = {
      // 'mid_123':{}
    }

  }
  /**
   * @Description 初始化
   * @param {Object} view Vue实例
   * @return {undefined} undefined
  */
  init(){
    // 上次更新时间
    let last_update_time = localStorage.getItem('match_list_basic_update_time') || 0
    let now_time = new Date().getTime()
    // 距离上次更新时间差
    let time_difference = now_time - last_update_time
    // 距离上次更新大于1天 更新数据
    if(time_difference > 86400000){
      this.get_simple_matches()
    }else{
      // 获取本地数据
      let match_json = localStorage.getItem('match_list_basic_json')
      if(match_json){
        let match_list = JSON.parse(match_json)
        this.match_list_to_mid_obj(match_list)
      }
    }
  }

  /**
   * @Description 调用接口获取列表基础数据
   * @param {undefined} undefined
   * @return {undefined} undefined
  */
  get_simple_matches(){
    // 非首次加载必要接口 延迟3秒调用接口
    setTimeout(() => {
      api_match.get_simple_matches().then( res => {
        let match_list = _.get(res,'data.data') || []
        if(_.get(match_list,length) > 0){
          this.match_list_to_mid_obj(match_list)
          // 列表数据转成json保存本地
          let match_json = JSON.stringify(match_list)
          localStorage.setItem('match_list_basic_json',match_json)
          let now_time = new Date().getTime()
          localStorage.setItem('match_list_basic_update_time',now_time)
        }
      })
    },1000)
  }
  /**
   * @Description 将列表转成mid_obj对象
   * @param {Array} match_list
   * @return {undefined} undefined
  */
  match_list_to_mid_obj(match_list){
    let mid_obj = {}
    match_list.forEach( match => {
      mid_obj['mid_'+match.mid] = match
    })
    this.mid_obj = mid_obj
  }
}

const match_list_basic_data = new MatchListBasicDataClass()

export default match_list_basic_data
