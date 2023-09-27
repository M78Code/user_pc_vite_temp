/**
 * 这里是处理次要玩法的逻辑  
 */

import { other_play_name_to_playid } from 'src/core/constant/config/data-class-ctr/index.js';

/**
   * @Description 设置其他玩法选中索引    更新玩法模板及数据
   * @param {undefined} undefined
  */
const set_match_play_current_index = (match,play_key) => {
    let tab_play_keys = match.tab_play_keys.split(',')
    // 设置选中的玩法索引
    match.play_current_index = tab_play_keys.findIndex( key => key == play_key)
    // 设置选中的玩法key
    match.play_current_key = play_key
    // 保存当前选中的玩法
    this.other_play_current_play['mid_'+match.mid] = play_key
  }

/**
   * @Description 设置其他玩法tab标题
   * @param {object} match 赛事对象
  */
const set_tab_play_keys = (match) => {
    let tab_play_keys = []
    let play_keys = Object.keys(other_play_name_to_playid)
    _.each(play_keys,key=>{
      let status_key = 'cos'+key.slice(3)
      let status =  match[status_key]
      //15分钟次要玩法前端强制关闭
      let cos15min_status = !(status_key === 'cos15Minutes' && match.hSpecial == 6)
      //5分钟次要玩法前端强制关闭状态
      let cos5min_status = !(status_key === 'cos5Minutes' && match.hSpecial5min == 6)
      if( status && cos15min_status  && cos5min_status){
          tab_play_keys.push(key)
      }
    })
    match.tab_play_keys = tab_play_keys.join(',')
    // 是否有其他玩法
    match.has_other_play = tab_play_keys.length > 0
    // 当前选中的其他的玩法
    let cur_other_play = this.other_play_current_play['mid_'+match.mid] || tab_play_keys[0]
    //玩法关闭时选择第一个
    if(!tab_play_keys.includes(cur_other_play)){
      cur_other_play = tab_play_keys[0]
    }
    // 设置其他玩法选中索引
    set_match_play_current_index(match,cur_other_play)
  }
  /**
   * @Description 切换其他玩法
   * @param {string} mid 赛事id
  */
  const switch_other_play = (mid,play_key) => {
    let match = this.mid_obj['mid_'+mid] || {}
    set_match_play_current_index(match,play_key)
    let {tpl_id} =  match
    let template_name = `template_${tpl_id}`
    let other_handicap_list = this.clone_arr(match_list_play_config[template_name][play_key])
    if(play_key === 'hpsBold'){
      other_handicap_list = this.get_21_bold_template(match);
      match = {}
    }
    if(play_key === 'hps5Minutes'){
      other_handicap_list = this.get_5minutes_template({tpl_id});
      match = {}
    }
    let type = play_key == 'hps15Minutes' ? 4 : 1
    other_handicap_list = this.merge_template_data({match,handicap_list:other_handicap_list,type,play_key})
    this.coverage_match_data({other_handicap_list}, mid)
    window.vue.$root.$emit(window.vue.emit_cmd.EMIT_API_BYMIDS, {mids:[mid]});
  }
  
  /**
   * @Description 获取其他玩法请求参数
   * @param {array} mids 赛事ID数组
  */
  const get_tab_param_build = (mids) =>{
    let tabs = []
    mids.forEach( mid => {
      let match = this.mid_obj['mid_'+mid] || {}
      // 有其他玩法
      if(match.has_other_play){
        // 添加玩法ID
        tabs.push({
          mid,
          playId:other_play_name_to_playid[this.other_play_current_play['mid_'+mid]]
        })
      }
    })
    return tabs
  }