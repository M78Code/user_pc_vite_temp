
/**
 * @description 赛事 元数据处理
 */

import lodash from 'lodash'
import { api_common } from "src/api/index.js";
import BaseData from 'src/core/base-data/base-data.js'
import MatchPage from 'src/core/match-list-h5/match-class/match-page'
import MenuData from "src/core/menu-h5/menu-data-class.js"
import UserCtr from 'src/core/user-config/user-ctr.js'
import MatchFold from 'src/core/match-fold'
import MatchCollect from 'src/core/match-collect'
import PageSourceData from "src/core/page-source/page-source.js";
import MatchListCardClass from '../match-card/match-list-card-class'
import { MATCH_LIST_TEMPLATE_CONFIG } from "src/core/match-list-h5/match-card/template"
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, useMittEmit, MITT_TYPES } from 'src/core'

class MatchMeta {

  constructor() {
    // 当前页面数据mids集合
    this.match_mids = [],
    // 早盘下的 mids
    this.zaopan_mids = []
    // 联赛 id 对应的 mids
    this.tid_map_mids = {}
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
    // 冠军
    if (MenuData.is_export()) return
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
    // 过滤赛事
    const match_result = match_list.filter((t) => t.mid)
    this.set_match_default_template(match_result)
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
  async set_match_default_properties(list = []) {
    // 获取赛事收藏状态 该接口还没发到试玩
    // await MatchCollect.get_collect_matche_data()

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

      this.match_assistance_perations(t)
      
    })
    this.handle_submit_warehouse(list)
  }

  /**
   * @description 赛事辅助操作
   * @param { match } 赛事对象
   */
  match_assistance_perations (match) {
    const { tid, csid } = match
    // 初始化赛事折叠
    MatchFold.set_match_mid_fold_obj(match)
    // 初始化球种折叠状态
    if (!(`csid_${csid}` in MatchFold.ball_seed_csid_fold_obj.value)) MatchFold.set_ball_seed_csid_fold_obj(csid)

    // 赛事收藏处理
    MatchCollect.handle_collect_state(match)
    // // 初始化赛事收藏
    // MatchCollect.set_match_collect_state(t)
    // // 初始化联赛收藏状态
    // MatchCollect.set_league_collect_state(t.tid)
  }

  /**
   * @description 不走元数据情况 获取 match_mids
   * @param { list } 赛事数据 
   */
  get_match_mids (list) {
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return []
    const match_mids_list = list.map(t => {
      return t.mid
    })
    this.match_mids = [...new Set(match_mids_list.slice(0, 10))]
    this.handle_submit_warehouse(list)
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
   * 
   * @description 获取赛事请求参数
   * @returns { Object }
   */
  get_base_params (euid) {
    // match中 hpsFlag 都为0 除开冠军或电竞冠军; 赛事列表冠军或者电竞冠军/赛果不需要hpsFlag
    const hpsflag = MenuData.is_kemp() || MenuData.get_menu_type() == 28 ? "" : 0
    return {
      cuid: UserCtr.get_cuid(),
      euid: euid ? euid : lodash.get(MenuData, 'current_lv_2_menu.mi'),
      // 一级菜单筛选类型 1滚球 2 即将开赛 3今日赛事 4早盘 11串关
      type: lodash.get(MenuData, 'current_lv_1_menu.mi'),
      //排序	 int 类型 1 按热门排序 2 按时间排序
      sort: PageSourceData.sort_type,
      //标准版和简版 1为新手版  2为标准版
      device: ['', 'v2_h5', 'v2_h5_st'][UserCtr.standard_edition],
      hpsflag
    };
  }

  /**
   * @description 获取冠军赛事； 元数据接口暂时未提供所以走老逻辑， 后续会提供
   */
  async get_champion_match() {
    const menu_lv_v2 = lodash.get(MenuData.current_lv_2_menu, 'mi')
    const euid = lodash.get(BaseData.mi_info_map, `mi_${menu_lv_v2}.h5_euid`, '40602')
    const res = await api_common.post_match_full_list({
      "cuid": UserCtr.get_cuid(),
      euid,
      "type": 100,
      "sort": PageSourceData.sort_type,
      "device": ['', 'v2_h5', 'v2_h5_st'][UserCtr.standard_edition]
    })
    this.handle_custom_matchs(res)
  }

  /**
   * @description 赛果不走元数据， 直接掉接口 不需要走模板计算以及获取赔率
   * @param { md } 三级菜单 事件
   */
  async get_results_match () {
    const md = lodash.get(MenuData.current_lv_3_menu, 'field1')
    // 电竞的冠军
    const category = MenuData.get_menu_type() === 100 ? 2 : 1
    if (!md) return
    const params = this.get_base_params()
    const res = await api_common.get_match_result_api({
      ...params,
      category,
      "md": md
    })
    this.handle_custom_matchs(res)
  }

  /**
   * @description 获取电竞赛事； 元数据接口暂时未提供所以走老逻辑， 后续会提供
   */
  async get_esports_match() {
    // 电竞的冠军
    const category = MenuData.get_menu_type() === 100 ? 2 : 1
    const csid = lodash.get(MenuData.current_lv_2_menu, 'csid')
    const md = lodash.get(MenuData.current_lv_3_menu, 'field1', "")
    const params = this.get_base_params()
    const res = await api_common.post_esports_match({
      ...params,
      md,
      csid,
      category,
      "type":3000,
    })
    this.handle_custom_matchs(res)
  }

  /**
   * @description 处理非元数据赛事, 不需要走 模版计算以及获取赔率
   * @param { res } 接口返回对象
   */
  handle_custom_matchs (res) {
    if (+res.code !== 200) return
    const list = lodash.get(res, 'data', [])
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return
    const result_list = list.slice(0, 10)
    const custom_match_mids = result_list.map(t => {
      return t.mid
    })
    this.match_mids = [...new Set(custom_match_mids.slice(0, 10))]
    result_list.forEach((t, i) => {
      Object.assign(t, {
        is_show_league: i === 0 ? true : result_list[i].tid !== result_list[i - 1].tid
      })
      this.match_assistance_perations(t)
    })
    MatchDataBaseH5.set_list(result_list)
  }

  /**
   * @description 设置 match_mids
   * @param { mids } 赛事 mids 
   */
  set_match_mids (mids = [], num = 10) {
    // 显示空数据页面
    if (mids.length < 1) return useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, true);
    this.match_mids = [...new Set(mids.slice(0, num))]
    // useMittEmit(MITT_TYPES.EMIT_MENU_ANIMATION);
    this.get_origin_match_by_mids(this.match_mids)
    // 空数据页面重置
    useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, false);
  }

  /**
   * @description 更新对应赛事
   * @param { list } 赛事数据 
   */
  handle_update_match_info(list) {
    list = lodash.map(list, t => {
      const match = MatchDataBaseH5.get_quick_mid_obj(t.mid)
      // 覆写次要玩法折叠参数
      // MatchFold.set_match_mid_fold_obj()
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