
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
  set_origin_match_data() {
    // 菜单 ID 对应的 元数据赛事 mids
    const menu_lv_v2 = MenuData.get_current_sub_menuid()
    //如果是数组表面 二级菜单 可能有 全部 选项
    if (lodash.isArray(menu_lv_v2)) {
      this.get_origin_match_mids_by_mis(menu_lv_v2, 30)
    } else {
      // 对应 球种 mi 
      if (typeof menu_lv_v2 !== 'string') return
      this.get_origin_match_mids_by_mis([menu_lv_v2], 15)
    }
  }
  /**
   * @description 根据 mi 获取对应的 mids
   * @param { menu_lv_sl } Array 二级菜单
   * @param { num } mids获取数量
   */
  get_origin_match_mids_by_mis(menu_lv_sl, num = 100) {
    const length = lodash.get(menu_lv_sl, 'length')
    if (length < 1) return
    const match_by_mids = []
    menu_lv_sl.forEach(mi => {
      const mids = this.get_match_mids_by_mi(mi)
      mids && match_by_mids.push(...mids)
    })
    // TODO: 需要去除 .slice(0, 30)
    this.match_mids = match_by_mids.slice(0, num)
    this.get_origin_match_by_mids(this.match_mids)
  }

  /** 暂时没有用这个方法了 因为一个方法足以
   * @description 根据 mi 获取对应的 mids
   * @param { mi } 二级菜单  
   */
  // get_origin_match_mids_by_mi(mi) {
  //   // 当前菜单下的 mids 集合
  //   const match_by_mids = this.get_match_mids_by_mi(mi)
  //   const length = lodash.get(match_by_mids, 'length')
  //   if (length < 1) return
  //   // TODO: 需要去除 .slice(0, 15)
  //   this.match_mids = [...new Set(match_by_mids.slice(0, 15))]
  //   this.get_origin_match_by_mids(this.match_mids)
  // }
  /**
   * @description 根据 mi 获取元数据 mids
   * @param {*} mi 
   */
  get_match_mids_by_mi(mi) {
    const mi_tid_mids_res = lodash.get(BaseData, 'mi_tid_mids_res')
    if (mi_tid_mids_res.length < 1) return []
    const mid_obj = mi_tid_mids_res[mi]
    if (!mid_obj) return
    const match_by_mids = []
    Object.values(mid_obj).forEach(item => {
      item.forEach((t) => { //获取mids
        match_by_mids.push(...t.mids)
      })
    })
    return match_by_mids
  }

  /**
   * @description 根据 mids 获取对应的赛事数据
   * @param { mid } 二级菜单
   */
  get_origin_match_by_mids(mids) {
    // 赛事全量数据
    const mids_arr = lodash.get(BaseData, 'mids_arr', [])
    if (mids_arr.length < 1) return
    const match_list = mids.map(t => {
      return lodash.find(mids_arr, (l) => l.mid === t)
    })
    this.set_match_default_template(match_list)
  }

  /**
   * @description 设置赛事默认模板 输出最终赛事完整数据 更新仓库
   * @param { list } 赛事集合
   */
  set_match_default_template(list) {
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
  get_match_default_template(t, template) {
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
  get_basketball_default_template(t, template) {
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
  get_match_default_template_config(csid) {
    return lodash.get(MATCH_LIST_TEMPLATE_CONFIG, `template_${csid}_config`, {})
  }

  /**
   * @description 计算菜单 ID
   * @param {*} id 
   * @returns 
   */
  compute_menu_key(id) {
    return lodash.get(this.origin_menu[`${id}1`], 'h', '40003')
  }

  /**
   * @description 设置赛事默认属性
   * @param { list } 赛事数据 
   */
  set_match_default_properties(list = []) {
    const length = lodash.get(list, 'length')
    if (length < 1) return
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
      Object.assign(t, {
        is_show_tab_play,
        is_fold_tab_play,
        is_show_league,
      })
    })
    this.handle_submit_warehouse(list)
  }

  /**
   * @description 筛选对应热门赛事
   * @param { tid } 联赛 ID 
   */
  filter_hot_match_by_tid(tid = '') {
    const list = BaseData.base_data_res.matchsList
    const result = list.filter(t => t.tid === tid)
    this.set_match_default_properties(result)
  }

  /**
   * @description 更新对应赛事
   * @param { list } 赛事数据 
   */
  handle_update_match_info(list) {
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
  handle_submit_warehouse(list, type = 'mids') {
    // 设置仓库渲染数据
    MatchDataBaseH5.set_list(list)
    // 计算卡片高度, 需要在赔率接口之前调用， 避免卡片抖动
    MatchListCardClass.run_process_when_need_recompute_container_list_step_two_match_list_wrapper_height()
    // 订阅赛事，获取赛事赔率
    MatchPage.subscription()
  }
}

export default new MatchMeta()