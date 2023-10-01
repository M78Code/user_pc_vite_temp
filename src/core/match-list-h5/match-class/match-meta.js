
/**
 * @description 赛事 元数据处理
 */

import lodash from 'lodash'
import BaseData from 'src/core/base-data/base-data.js'
import MatchPage from 'src/core/match-list-h5/match-class/match-page'
import MenuData from "src/core/menu-h5/menu-data-class.js"
import MatchListCardClass from '../match-card/match-list-card-class'
import { MATCH_LIST_TEMPLATE_CONFIG } from "src/core/match-list-h5/match-card/template"
import mi_euid_mapping_default from "src/core/base-data/config/mi-euid-mapping.json"
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from 'src/core'
class MatchMeta {

  constructor() {
    // 当前页面数据mids集合
    this.match_mids = [],
    // 新的菜单到旧的菜单的映射关系  接口返回值
    this.origin_menu = mi_euid_mapping_default.data
    // ms 1： 滚球 2： 今日； 3： 早盘;  
  }

  
  /**
   * @description 设置 赛事 元数据
   * @param { mi } 菜单类型 目前只处理了足球
   */
  set_origin_match_data () {
    const mi = lodash.get(MenuData.current_lv_2_menu, 'mi')
    if (typeof mi !== 'string') return
    // 菜单 ID 对应的 赛事 mids
    const mi_tid_mids_res = lodash.get(BaseData, 'mi_tid_mids_res')
    if (mi_tid_mids_res.length < 1) return
    // 当前菜单的 mid 详情
    const mid_obj = mi_tid_mids_res[mi]
    if (!mid_obj) return
    const arr = []
    Object.values(mid_obj).forEach(t => {
      arr.push(...t)
    })
    if (arr.length < 1) return
    // 当前菜单下的 mids 集合
    const match_by_mids = []
    arr.forEach(t => {
      match_by_mids.push(...t.mids)
    })
    this.handle_origin_match_data(match_by_mids)
  }

  /**
   * @description 根据 mid 获取对应的赛事数据
   * @param { mids } 赛事id集合
   */
  handle_origin_match_data (mids) {
    // 赛事全量数据
    const mids_arr = lodash.get(BaseData, 'mids_arr', [])
    if (mids_arr.length < 1) return
    if (mids.length < 1) return
    const match_list = mids.map(t => {
      return lodash.find(mids_arr, (l) => l.mid === t)
    })
    this.set_match_default_template(match_list)
  }

  /**
   * @description 设置赛事默认模板 输出最终赛事完整数据 更新仓库
   * @param { list } 赛事集合
   */
  set_match_default_template (list) {
    const data_list = list.map(t => {
      const csid = lodash.get(t, 'csid')
      const template_config = this.get_match_default_template_config(csid)
      if (!template_config) return
      // 主要玩法默认参数
      const hps = template_config[`template_${csid}_main`]
      let handicap = ''
      if (+csid === 2) {
        handicap = this.get_basketball_default_template(t, template_config)
      } else {
        handicap = this.get_match_default_template(t, template_config)
      }
      return {
        ...t,
        hps,
        ...handicap
      }
    })
    this.set_match_default_properties(data_list)
  }

  /**
   * @description 获取 赛事 次要玩法
   * @param { list } 赛事集合
   * @param { template } 赛事默认模板
   */
  get_match_default_template (t, template) {
    const csid = lodash.get(t, 'csid')
    return {
      ...template[`template_${csid}`]
    }
  }

  /**
   * @description 获取 篮球 赛事 2号 次要玩法
   * @param { template }  赛事默认模板  
   *  mmp: "1": "上半场",
   *       "2": "下半场",
   *       "13": "第一节",
   *       "14": "第二节",
   *       "15": "第三节",
   *       "16": "第四节",
   */
  get_basketball_default_template (t, template) {
    const mmp = lodash.get(t, 'mmp')
    const hpsAdd = template[`template_2`][`cur_handicap_list_${mmp}`]
    return {
      hpsAdd
    }
  }

  /**
   * @description 获取赛事默认模板
   * @param { csid } 球种id
   * @returns Object 球种默认模板配置
   */
  get_match_default_template_config (csid) {
    return lodash.get(MATCH_LIST_TEMPLATE_CONFIG, `template_${csid}_config`, {})
  }

  /**
   * @description 计算菜单 ID
   * @param {*} id 
   * @returns 
   */
  compute_menu_key (id) {
    return lodash.get(this.origin_menu[`${id}1`], 'h', '40003')
  }

  /**
   * @description 设置赛事默认属性
   * @param { list } 赛事数据 
   */
  set_match_default_properties (list = []) {
    const length = lodash.get(list, 'length')
    if (length < 1) return
    const result = []
    // 是否展示联赛标题
    let is_show_league = false
    // 是否显示次要玩法
    let is_show_tab_play = false
    // 是否折叠
    let is_fold_tab_play = false
    
    list.forEach((t, i) => {
      if (i === 0) {
        is_show_league = true
      } else {
        is_show_league = list[i].tid !== list[i - 1].tid
      }
      i < 20 && result.push(t.mid)
      Object.assign(t, {
        is_show_tab_play,
        is_fold_tab_play,
        is_show_league,
      })
    })
    this.match_mids = [...new Set(result)]
    this.handle_submit_warehouse(list)
  }

  /**
   * @description 更新对应赛事
   * @param { list } 赛事数据 
   */
  handle_update_match_info (list) {
    list = lodash.map(list, t => {
      const match = MatchDataBaseH5.get_quick_mid_obj(t.mid)
      return Object.assign({}, match, t)
    })
    // 设置仓库渲染数据
    MatchDataBaseH5.set_list(list)
    // 计算卡片高度, 需要在赔率接口之前调用， 避免卡片抖动
    MatchListCardClass.run_process_when_need_recompute_container_list_step_two_match_list_wrapper_height()
  }

  /**
   * @description 提交更新仓库
   * @param { list } 赛事数据
   * @param { type } 是否获取赔率
   */
  handle_submit_warehouse (list, type = 'mids') {
    // 设置仓库渲染数据
    MatchDataBaseH5.set_list(list)
    // 计算卡片高度, 需要在赔率接口之前调用， 避免卡片抖动
    MatchListCardClass.run_process_when_need_recompute_container_list_step_two_match_list_wrapper_height()
    // 订阅赛事，获取赛事赔率
    MatchPage.subscription()
  }
}

export default new MatchMeta()