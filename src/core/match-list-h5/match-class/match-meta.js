
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
    // 早盘下的 mids
    this.zaopan_mids = []
    // 联赛 id 对应的 mids
    this.tid_map_mids = {}
    // 新的菜单到旧的菜单的映射关系  接口返回值
    this.origin_menu = mi_euid_mapping_default.data
    // ms 1： 滚球 2： 今日； 3： 早盘;  
  }

  /**
   * @description 设置 赛事 元数据
   * @param { mi } 菜单类型
   */
  set_origin_match_data() {
    // 菜单 ID 对应的 元数据赛事 mids
    const menu_lv_v1 = lodash.get(MenuData.current_lv_1_menu, 'mi')
    const menu_lv_v2 = lodash.get(MenuData.current_lv_2_menu, 'mi')
    const menu_lv_v1_sl = lodash.get(MenuData.current_lv_1_menu, 'sl')
    const menu_lv_v2_sl = lodash.get(MenuData.current_lv_2_menu, 'sl')
    // 滚球全部
    if (+menu_lv_v1 === 1 && !menu_lv_v2) return this.get_origin_match_mids_by_mis(menu_lv_v1_sl)

    // 今日 & 早盘
    if ([2,3].includes(+menu_lv_v1)) return this.get_origin_match_mids_by_mis(menu_lv_v2_sl)
   
    // 对应 球种 mi 
    if (typeof menu_lv_v2 !== 'string') return
    this.get_origin_match_mids_by_mi(menu_lv_v2)
  }
  /**
   * @description 获取 对应 全部赛事 mids
   * @remarks 滚球全部、今日对应球种（滚球 + 早盘）
   */
  get_origin_match_mids_by_mis (sl) {
    const length = lodash.get(sl, 'length', 0)
    if (length < 1) return
    const match_mids_list = []
    sl.forEach(t => {
      const mids = this.get_match_mids_by_mi(t.mi)
      mids && match_mids_list.push(...mids)
    })
    // TODO: 需要去除 .slice(0, 10)
    this.zaopan_mids = [...new Set(match_mids_list)]
    this.set_match_mids(match_mids_list, 10)
  }

  /** 暂时没有用这个方法了 因为一个方法足以
   * @description 根据 mi 获取对应的 mids
   * @param { mi } 二级菜单  
   */
  get_origin_match_mids_by_mi (mi) {
    // 当前菜单下的 mids 集合
    const match_mids_list = this.get_match_mids_by_mi(mi)
    const length = lodash.get(match_mids_list, 'length', 0)
    if (length < 1) return
    this.set_match_mids(match_mids_list, 8)
  }

  /**
   * @description 根据 mi 获取元数据 mids
   * @param {*} mi 
   */
  get_match_mids_by_mi(mi) {
    const mi_tid_mids_res = lodash.get(BaseData, 'mi_tid_mids_res')
    if (!mi_tid_mids_res) return []
    const mid_obj = mi_tid_mids_res[mi]
    if (!mid_obj) return
    const arr = []
    Object.values(mid_obj).forEach(t => {
      arr.push(...t)
    })
    if (arr.length < 1) return
    const match_mids_list = []
    arr.forEach((t, i) => {
      match_mids_list.push(...t.mids)
    })
    return match_mids_list
  }

  /**
   * @description 根据 mids 获取对应的赛事数据
   * @param { mid } 二级菜单
   */
  get_origin_match_by_mids(mids) {
    // 赛事全量数据
    const match_list = mids.map(t => {
      return BaseData.resolve_base_info_by_mid(t)
    })
    this.set_match_default_template(match_list)
  }

  /**
   * @description 设置赛事默认模板 输出最终赛事完整数据 更新仓库  目前只处理了 1-足球; 2-篮球
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
    const id = [1,2].includes(+t.csid) ? t.csid : 1
    return {
      ...template[`template_${id}`]
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
    return { hpsAdd }
  }

  /**
   * @description 获取赛事默认模板
   * @param { csid } 球种id
   * @returns Object 球种默认模板配置
   */
  get_match_default_template_config(csid) {
    const id = [1,2].includes(+csid) ? csid : 1
    return lodash.get(MATCH_LIST_TEMPLATE_CONFIG, `template_${id}_config`, {})
  }

  /**
   * @description 设置赛事默认属性
   * @param { list } 赛事数据 
   */
  set_match_default_properties(list = []) {
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return
    // 是否展示联赛标题
    let is_show_league = false
    // 是否显示次要玩法
    let is_show_tab_play = false
    // 是否折叠
    let is_fold_tab_play = false

    list.forEach((t, i) => {
      is_show_league = i === 0 ? true : list[i].tid !== list[i - 1].tid
      Object.assign(t, {
        is_show_tab_play,
        is_fold_tab_play,
        is_show_league,
      })
    })
    this.handle_submit_warehouse(list)
  }

  /**
   * @description 不走元数据情况 获取 match_mids
   * @param { list } 赛事数据 
   */
  get_match_mids (list) {
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return []
    this.match_mids = list.map(t => {
      return t.mid
    })
  }

  /**
   * @description 早盘 下根据时间来筛选
   * @param { time } 所选择的时间
   */
  filter_match_by_time (time) {
    // 所有日期
    let target_mids = []
    if (!time) {
      target_mids = [...new Set((this.zaopan_mids).slice(0, 10))]
    } else {
      if (time === 0) return
      const hour_12 = 12 * 60 * 60 * 1000
      const arr_mids = []
      this.zaopan_mids.forEach(t => {
        const match = BaseData.resolve_base_info_by_mid(t)
        match && (Number(match.mgt) > Number(time) - hour_12) && (Number(match.mgt) < Number(time) + hour_12) && arr_mids.push(t)
      })
      target_mids = [...new Set((arr_mids).slice(0, 8))]
    }
    this.set_match_mids(target_mids)
  }

  /**
   * @description 设置 tid 映射 mids;  避免初始渲染慢， 所以放在 有需要的时候在设置； 比如 热门页面
   * @param {*} list 
   */
  set_tid_map_mids () {
    const list = lodash.get(BaseData.base_data_res, 'matchsList', [])
    list.forEach(t => {
      const tid_info = this.tid_map_mids[`tid_${t.tid}`]
      if (tid_info) {
        tid_info.mids.push(t.mid)
      } else {
        this.tid_map_mids[`tid_${t.tid}`] = {
          tid: t.tid,
          mids: [ t.mid ]
        }
      }
    })
  }

  /**
   * @description 筛选对应热门赛事
   * @param { tid } 联赛 ID 
   */
  filter_hot_match_by_tid (tid = '') {
    const tid_info = this.tid_map_mids[`tid_${tid}`]
    if (!tid_info) return
    const tid_mids = this.tid_map_mids[`tid_${tid}`].mids
    if (tid_mids.length < 1) return 
    this.set_match_mids(tid_mids)
  }

  /**
   * @description 设置 match_mids
   * @param { mids } 赛事 mids 
   */
  set_match_mids (mids = [], num = 10) {
    console.log(new Set(mids))
    this.match_mids = [...new Set(mids.slice(0, num))]
    this.get_origin_match_by_mids(this.match_mids)
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