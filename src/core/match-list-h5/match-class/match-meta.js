
/**
 * @description 赛事 元数据处理
 */
import { ref } from 'vue'
import lodash from 'lodash'
import { uid } from "quasar";
import axios_debounce_cache from "src/core/http/debounce-module/";
import { api_common, api_match_list, api_match, api_home, api_analysis } from "src/api/index.js";
import BaseData from 'src/core/base-data/base-data.js'
import UserCtr from 'src/core/user-config/user-ctr.js'
import MatchFold from 'src/core/match-fold/index.js'
import MatchCollect from 'src/core/match-collect/index.js'
import { MenuData } from "src/output/project/index.js"
import MatchUtils from 'src/core/match-list-h5/match-class/match-utils';
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { PageSourceData, GlobalAccessConfig, ServerTime, axios_loop } from "src/output/index.js";
import { MATCH_LIST_TEMPLATE_CONFIG } from "src/core/match-list-h5/match-card/template"
import { useMittEmit, MITT_TYPES, project_name } from "src/output/module/constant-utils.js"
import {
  MatchDataWarehouse_ouzhou_PC_in_play_List_Common as MatchDataBaseInPlayH5,
  MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, MatchDataWarehouse_ouzhou_PC_hots_List_Common as MatchDataBaseHotsH5,
  MatchDataWarehouse_ouzhou_PC_five_league_List_Common as MatchDataBaseFiveLeagueH5, MatchDataWarehouse_ouzhou_PC_l5mins_List_Common as MatchDataBasel5minsH5,
} from 'src/output/module/match-data-base.js'
import { nextTick } from 'licia';

class MatchMeta {

  constructor() {
    this.init()
    // 联赛 id 对应的 mids
    this.tid_map_mids = {}
    // 接口取消标识
    this.axios_cancel = {}
    // 接口 timer
    this.axios_debounce_timer = null
    // 获取赔率定时器
    this.axios_get_hps_timer = null
    // 赛事新增防抖
    this.debounce_add_match = lodash.debounce(this.handle_ws_add_match, 2500)
    // 赛事移除防抖
    this.debounce_remove_match = lodash.debounce(this.handle_ws_remove_match, 1500)
    // 获取赔率防抖
    this.debounce_get_hps = lodash.debounce(this.handle_ws_get_hps, 2000)
  }

  init() {
    // 当前页面数据mids集合
    this.match_mids = []
    // 早盘下的 mids
    this.zaopan_mids = []
    // 赛事全量mids
    this.complete_mids = []
    // 赛事全量数据
    this.complete_matchs = []
    // 列表渲染数据
    this.current_matchs = []
    // 上一次滚动得距离
    this.prev_scroll = 0
    // 其他仓库的全量赛事
    this.other_match_mids = []
    this.other_complete_matchs = []
    // 其他仓库的全量赛事mids
    this.other_complete_mids = []
    // 当前接口 标识
    this.current_http_key = ''
    // 传入参数
    this.http_params = {
      md: ''
    }
    // 是否ws触发
    this.is_ws_trigger = false
    // 防抖定时器
    this.debounce_timer = null
    // 重置收藏对象
    MatchCollect.clear_collect_info()
  }

  /**
   * @description 设置 赛事 元数据
   * @param { Number } md 时间
   */
  async set_origin_match_data(params = {}) {
    const { md = '', is_match = true } = params
    this.init()
    let menu_lv_v1 = ''
    let menu_lv_v2 = ''
    let menu_lv_v1_sl = []
    let menu_lv_v2_sl = []
    if (project_name == 'yazhou-h5') {
      // 菜单 ID 对应的 元数据赛事 mids
      menu_lv_v1 = lodash.get(MenuData.current_lv_1_menu, 'mi')
      menu_lv_v2 = lodash.get(MenuData.current_lv_2_menu, 'mi')
      menu_lv_v1_sl = lodash.get(MenuData.current_lv_1_menu, 'sl')
      menu_lv_v2_sl = lodash.get(MenuData.current_lv_2_menu, 'sl')
    } else {
      // 菜单 ID 对应的 元数据赛事 mids   
      menu_lv_v1 = MenuData.current_lv_1_menu_i
      menu_lv_v2 = MenuData.current_lv_2_menu_i
      menu_lv_v1_sl = MenuData.get_menu_lvmi_list(menu_lv_v1)
      menu_lv_v2_sl = MenuData.get_menu_lv_2_mi_list(menu_lv_v2)
    }

    // 清除上一轮赛事
    this.clear_match_info()

    // 电竞、赛果、冠军 return
    if (MenuData.is_esports() || MenuData.is_results() || MenuData.is_kemp()) return

    // 冠军
    // if (MenuData.is_kemp()) return this.get_champion_match()

    // 获取真实数据
    this.http_params.md = md

    // 是否需要开赛、未开赛归类
    is_match && this.get_target_match_data({ md, is_clear: true })

    // 滚球全部
    if (+menu_lv_v1 === 1 && menu_lv_v2 == 0) return this.get_origin_match_mids_by_mis(menu_lv_v1_sl)

    // 今日 & 早盘
    if ([2, 3].includes(+menu_lv_v1)) return this.get_origin_match_mids_by_mis(menu_lv_v2_sl)

    // 对应 球种 mi 
    if (typeof menu_lv_v2 !== 'string') return

    this.get_origin_match_mids_by_mi(menu_lv_v2)
  }

  /**
   * @description 获取 对应 全部赛事 mids
   * @remarks 滚球全部、今日对应球种（滚球 + 早盘）
   */
  get_origin_match_mids_by_mis(sl) {
    const length = lodash.get(sl, 'length', 0)
    if (length < 1) return
    const match_mids_list = []
    sl.forEach(t => {
      const mids = this.get_match_mids_by_mi(t.mi)
      mids && match_mids_list.push(...mids)
    })
    const mids = lodash.uniq(match_mids_list)
    this.zaopan_mids = mids
    this.get_origin_match_by_mids(mids)
  }

  /** 
   * @description 根据 mi 获取对应的 mids
   * @param { mi } 二级菜单  
   */
  get_origin_match_mids_by_mi(mi) {
    // 当前菜单下的 mids 集合
    const match_mids_list = this.get_match_mids_by_mi(mi)
    this.get_origin_match_by_mids(match_mids_list)
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
   * @description 元数据处理 根据 mids 获取对应的赛事数据 
   * @param { mids } 赛事 mids
   */
  get_origin_match_by_mids(mids) {
    const result_mids = lodash.uniq(mids)
    const length = lodash.get(result_mids, 'length', 0)
    // 显示空数据页面  this.set_page_match_empty_status({ state: true });
    if (length < 1) return this.set_show_skeleton_state(true)
    // 重置折叠对象
    // MatchFold.clear_fold_info()
    // 赛事全量数据
    const match_list = result_mids.map((t, index) => {
      // 获取对应赛事数据
      const match = BaseData.resolve_base_info_by_mid(t)
      // 获取赛事模板参数
      const template = this.set_match_default_template(match)
      // 设置赛事默认参数
      const params = this.set_match_default_properties(match, index, result_mids)
      // 赛事最终数据
      const target = Object.assign(match, template, params, { custom_tid: 'origin' })
      // 球种名称
      const csna = BaseData?.menus_i18n_map[`${100 + Number(match.csid)}`]
      // 联赛名称
      const tn = BaseData?.tids_map[`tid_${match.tid}`]?.tn
      // 赛事其他操作
      this.match_assistance_operations(target, index)
      return { ...target, tn, csna, is_meta: true, estimateHeight: MatchUtils.get_default_estimateHeight(match) }
    })
    // 设置 元数据计算 流程
    MatchResponsive.set_is_compute_origin(true)
    // 元数据不作为最终渲染数据 所以不走虚拟计算
    // 元数据只作用域切换菜单时快速显示， 最终显示还是根据接口来
    this.match_mids = lodash.uniq(mids.slice(0, 10))
    this.set_match_mids(result_mids.slice(0, 10), match_list, false)
    // this.set_match_mids(result_mids.slice(0, 10), match_list.slice(0, 10), false)
  }

  /**
   * @description 设置赛事默认模板 输出最终赛事完整数据 更新仓库
   * @param { match } 赛事对象
   */
  set_match_default_template(match) {
    const csid = lodash.get(match, 'csid')
    const template_config = this.get_match_default_template_config(csid)
    if (!template_config) return
    // 主要玩法默认参数
    const hps = template_config[`template_${csid}_main`]
    let handicap = ''
    if (+csid === 2) {
      handicap = this.get_basketball_default_template(match, template_config)
    } else {
      handicap = this.get_match_default_template(match, template_config)
    }
    return {
      hps,
      ...handicap
    }
  }

  /**
   * @description 获取 赛事 默认次要玩法
   * @param { list } 赛事集合
   * @param { template } 赛事默认模板
   */
  get_match_default_template(t, template) {
    const id = [1, 2].includes(+t.csid) ? t.csid : 1
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
    const id = [1, 2].includes(+csid) ? csid : 1
    return lodash.get(MATCH_LIST_TEMPLATE_CONFIG, `template_${id}_config`, {})
  }

  /**
   * @description 设置赛事默认属性
   * @param { match } 赛事对象
   * @param { index } 赛事对应下标
   */
  set_match_default_properties(match, index, mids) {
    // this.delete_default_field(match)
    // 是否展示联赛标题
    const is_show_league = MatchUtils.get_origin_match_is_show_league(index, mids)
    const is_show_no_play = MatchUtils.get_match_is_show_no_play(index, mids)
    // 获取赛事的让球方 0未找到让球方 1主队为让球方 2客队为让球方
    const handicap_index = MatchUtils.get_handicap_index_by(match);
    const { home_score, away_score } = MatchUtils.get_match_score(match)
    const { home_red_score, away_red_score, home_yellow_score, away_yellow_score } = MatchUtils.get_match_red_yellow_card(match)
    return {
      source_index: index,
      is_show_no_play,
      is_show_league,
      away_score,
      home_score,
      home_red_score,
      away_red_score,
      home_yellow_score,
      away_yellow_score,
      handicap_index
    }
  }

  /**
   * @description 删除 赛事 默认字段
   */
  delete_default_field (t) {
    const match = MatchDataBaseH5.get_quick_mid_obj(t.mid)
    if (!match) return
    // 开赛 未开赛  标识
    delete match.start_flag
    // 全部联赛标识
    delete match.source_index
  }

  /**
   * @description 赛事操作
   * @param { match } 赛事对象
   */
  match_assistance_operations(match, index, flag = true) {
    const { tid, csid, mid, ms } = match
    // 初始化赛事折叠
    // MatchFold.set_match_mid_fold_obj(match)
    MatchResponsive.set_show_match_info(`mid_${match.mid}`, index < 20 ? true : false)
    
    // 球种数量
    MatchResponsive.set_default_ball_seed_count(match)
    const key = MatchFold.get_match_fold_key(match)
    if (!(key in MatchFold.match_mid_fold_obj.value)) MatchFold.set_match_mid_fold_obj(match)
    // 初始化赛事折叠

    const fold_key = MatchFold.get_fold_key(match)

    //  初始化全部球种折叠状态
    if (!(fold_key in MatchFold.ball_seed_csid_fold_obj.value)) MatchFold.set_ball_seed_csid_fold_obj(fold_key)
    // 进行中
    if (!(fold_key in MatchFold.progress_csid_fold_obj.value) && [1, 110].includes(+ms)) MatchFold.set_progress_csid_fold_obj(fold_key)
    // 未开赛
    if (!(fold_key in MatchFold.not_begin_csid_fold_obj.value) && [1, 110].includes(+ms)) MatchFold.set_not_begin_csid_fold_obj(fold_key)

    // 获取模板默认高度
    const template_config = this.get_match_default_template_config(csid)
    // 虚拟列表计算
    VirtualList.set_match_mid_map_base_info(match, template_config.match_template_config)

    // 球种 默认玩法 
    if (!this.is_ws_trigger) MatchResponsive.reset_match_hpid_by_csid(csid)

  }

  /**
   * @description 不走元数据情况 获取 match_mids
   * @param { list } 赛事数据 
   */
  get_match_mids(list) {
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return this.set_page_match_empty_status({ state: true });
    const match_mids_list = list.map(t => {
      return t.mid
    })
    this.set_match_mids(match_mids_list, list)
  }
  /**
   * @description 复刻版 根据当前菜单全部赛事 处理热门联赛 tid 需要缓存
   * @param { Array } list 当前菜单所有赛事  "1": "滚球",  "2": "今日", "3": "早盘", "6": "串关"
   * @remarks:  欧冠：欧洲冠军联赛
   *            英超：英格兰超级联赛
   *            意甲：意大利甲级联赛
   *            西甲：西班牙甲级联赛
   *            德甲：德国甲级联赛
   *            法甲：法国甲级联赛
   *            中超：中国超级联赛
   */
  handler_popular_leagues_by_all (list) {
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return
    const menu_csid = lodash.get(MenuData, 'menu_csid', 0)
    const menu_type = lodash.get(MenuData, 'current_lv_1_menu_i', 2)
    const search_tab_i_tid = lodash.get(MenuData, 'search_tab_i_tid', '')
    // 非 今日、滚球、早盘、串关下的足球，不处理
    if (menu_csid !== 1 || ![1,2,3,6].includes(menu_type) || search_tab_i_tid) return
    const popular_leagues = {
      'european_league': { key: '欧洲冠军联赛', 'tids': [] },
      'english_league': { key: '英格兰超级联赛', 'tids': [] },
      'serie_league': { key: '意大利甲级联赛', 'tids': [] },
      'spanish_league': { key: '西班牙甲级联赛', 'tids': [] },
      'german_league': { key: '德国甲级联赛', 'tids': [] },
      'french_league': { key: '法国甲级联赛', 'tids': [] },
      'china_league': { key: '中国超级联赛', 'tids': [] },
    }
    list.forEach(match => {
      const { tid = '', tn = '' } = match
      Object.values(popular_leagues).forEach(value => {
        const { key, tids = [] } = value
        if (tn.indexOf(key) > -1) {
          const index = tids.findIndex(t => t === tid)
          if (index === -1) tids.push(tid)
        }
      })
    })
    MatchResponsive.set_popular_league(popular_leagues)
  }

  /**
   * @description 早盘 下根据时间来筛选
   * @param { time } 所选择的时间
   */
  filter_match_by_time(time) {
    // 所有日期
    this.clear_match_info()
    VirtualList.clear_virtual_info()
    let target_mids = []
    if (!time) {
      target_mids = lodash.uniq(this.zaopan_mids)
    } else {
      if (time === 0) return
      const hour_12 = 12 * 60 * 60 * 1000
      const arr_mids = []
      this.zaopan_mids.forEach(t => {
        const match = BaseData.resolve_base_info_by_mid(t)
        match && (Number(match.mgt) > Number(time) - hour_12) && (Number(match.mgt) < Number(time) + hour_12) && arr_mids.push(t)
      })
      target_mids = lodash.uniq(arr_mids)
    }
    this.get_origin_match_by_mids(target_mids)
  }

  /**
   * @description 根据关键字搜索赛事
   */
  filter_match_by_name(str) {
    const keyword = str.replace(/^\s+|\s+$/g, '')
    if (!keyword) return this.set_origin_match_data()
    const length = lodash.get(this.complete_matchs, 'length', 0)
    if (length === 0) return this.set_page_match_empty_status({ state: true });
    const result = []
    this.complete_matchs.forEach(t => {
      if (t?.man.indexOf(keyword) !== -1 || t?.mhn.indexOf(keyword) !== -1 || t?.tn.indexOf(keyword) !== -1) result.push(t)
    })
    const r_length = lodash.get(result, 'length', 0)
    if (r_length === 0) return this.set_page_match_empty_status({ state: true })
    this.handler_match_list_data({ list: result, type: 1, is_virtual: true })
  }

  /**
   * @description 设置 tid 映射 mids;  避免初始渲染慢， 所以放在 有需要的时候在设置； 比如 热门页面
   * @param {*} list 
   */
  set_tid_map_mids() {
    const list = lodash.get(BaseData.base_data_res, 'matchsList', [])
    list.forEach(t => {
      const tid_info = this.tid_map_mids[`tid_${t.tid}`]
      if (tid_info) {
        tid_info.mids.push(t.mid)
      } else {
        this.tid_map_mids[`tid_${t.tid}`] = {
          tid: t.tid,
          mids: [t.mid]
        }
      }
    })
  }

  /**
   * @description 筛选对应热门赛事
   * @param { tid } 联赛 ID 
   */
  filter_hot_match_by_tid(tid = '') {
    this.set_show_skeleton_state(true)
    tid = tid || MenuData.search_tab_i_tid;
    const tid_info = this.tid_map_mids[`tid_${tid}`]
    this.get_target_match_data({ tid })
    if (!tid_info) return
    const mids = this.tid_map_mids[`tid_${tid}`].mids
    if (mids.length < 1) return
    this.get_origin_match_by_mids(mids)
  }

  /**
   * 
   * @description 获取赛事请求参数
   * @returns { Object }
   */
  get_base_params(euid) {
    // match中 hpsFlag 都为0 除开冠军或电竞冠军; 赛事列表冠军或者电竞冠军/赛果不需要hpsFlag
    const hpsFlag = MenuData.is_kemp() || MenuData.get_menu_type() == 28 ? "" : 0
    const current_lv_1_menu_i = lodash.get(MenuData, 'current_lv_1_menu_i')
    const type = MenuData.menu_id_map(current_lv_1_menu_i) ? MenuData.menu_id_map(current_lv_1_menu_i) : current_lv_1_menu_i

    return {
      cuid: UserCtr.get_uid(), // 508895784655200024
      euid: euid ? euid : MenuData.get_euid(lodash.get(MenuData, 'current_lv_2_menu_i')),
      // 一级菜单筛选类型 1滚球 2 今日 3早盘 400冠军  6串关
      type,
      //排序	 int 类型 1 按热门排序 2 按时间排序
      sort: UserCtr.sort_type,
      // sort: PageSourceData.sort_type,
      //标准版和简版 1为新手版  2为标准版
      device: ['', 'v2_h5', 'v2_h5_st'][UserCtr.standard_edition],
      hpsFlag
    };
  }

  /**
   * @description 获取冠军赛事； 元数据接口暂时未提供所以走老逻辑， 后续会提供
   */
  async get_champion_match() {
    // MatchFold.clear_fold_info()
    MatchDataBaseH5.clear()
    const menu_lv_v2 = MenuData.current_lv_2_menu_i;
    const euid = lodash.get(BaseData.mi_info_map, `mi_${menu_lv_v2}.h5_euid`, '40602')
    const http_key = `champion_${euid}`
    this.set_current_http_key(http_key)
    const target_params = {
      euid,
      "cuid": UserCtr.get_uid(),
      "type": 100,
      "sort": UserCtr.sort_type,
      "device": ['', 'v2_h5', 'v2_h5_st'][UserCtr.standard_edition]
    }
    this.set_show_skeleton_state(true)
    const res = await this.handler_axios_loop_func({ http: api_common.post_match_full_list, params: target_params, key: 'post_match_full_list' })
    if (!this.is_current_http_key(http_key)) return
    const code = lodash.get(res, 'code', 0)
    if (+code !== 200) {
      this.set_show_limiting_toast_tips(code)
      this.set_page_match_empty_status({ state: true, type: code == '0401038' ? 'noWifi' : 'noMatch' });
      return []
    }
    const list = lodash.get(res, 'data', [])
    if (list.length < 1) {
      this.set_page_match_empty_status({ state: true, type: 'noMatch' });
      return []
    }
    MatchCollect.get_collect_match_data(list)
    this.handle_custom_matchs(list)
  }

  /**
   * @description 获取冠军赛果
   */
  async get_champion_match_result() {
    this.clear_match_info()
    const md = lodash.get(MenuData.result_menu_api_params, 'md')
    const { start_time, end_time } = MatchUtils.get_match_time_start_time(md)
    const http_key = `10000_${md}`
    this.set_current_http_key(http_key)
    if (!md) return []
    const params = this.get_base_params()
    delete params.hpsFlag
    const target_params = {
      ...params,
      type: 28,
      orderBy: 1,
      category: 1,
      euid: "10000",
      md: String(start_time),
      startTime: String(start_time),
      endTime: String(end_time),
      sportType: 10000,
      isVirtualSport: 1
    }
    this.set_show_skeleton_state(true)
    const res = await this.handler_axios_loop_func({ http: api_analysis.get_champion_match_result_api, params: target_params, key: 'get_champion_match_result_api' })
    if (!this.is_current_http_key(http_key)) return []
    const code = lodash.get(res, 'code', 0)
    if (+code !== 200) {
      this.set_show_limiting_toast_tips(code)
      this.set_page_match_empty_status({ state: true, type: code == '0401038' ? 'noWifi' : 'noMatch' });
      return []
    }
    // 避免接口慢导致的数据错乱
    const list = lodash.get(res, 'data', [])
    let obj = {}
    list.forEach(i => {
      i.tid = i.tournamentId
      i.csid = i.sportId
      i.mid = i.marketId
      i.csna = i.sportName
      if (obj[i.sportId]) {
        obj[i.sportId]++
      } else {
        obj[i.sportId] = 1
      }
    })
    list.forEach(i => {
      i._total = obj[i.sportId]
    })
    const length = lodash.get(list, 'length', 0)
    if (length < 1) {
      this.set_page_match_empty_status({ state: true });
      return []
    }
    // const matchs = MatchUtils.handler_champion_match_classify_by_sport_id(list)
    return this.handler_match_list_data({ list: list, type: 2, is_virtual: false })
  }

  /**
   * @description 赛果不走元数据， 直接掉接口 不需要走模板计算以及获取赔率，需要虚拟列表计算
   */
  async get_results_match({ tid = '' } = {}) {
    this.clear_match_info()
    const md = lodash.get(MenuData.result_menu_api_params, 'md')
    const euid = lodash.get(MenuData.result_menu_api_params, 'sport')
    const params_tid = tid || MenuData.search_tab_tid
    // 电竞的冠军
    const category = MenuData.result_menu_lv1_mi ? 0 : 1
    const http_key = `results_${euid}_${md}`
    this.set_current_http_key(http_key)
    if (!md) return []
    const params = this.get_base_params()
    const target_params = {
      ...params,
      category,
      tid:params_tid,
      md: String(md),
      showem: 1, // 新增的参数 区分电子赛事
      euid: euid && String(euid),
      type: euid ==="0"? 29 : 28,//我的投注 euid为0
    }
    this.set_show_skeleton_state(true)
    const res = await this.handler_axios_loop_func({ http: api_common.get_match_result_api, params: target_params, key: 'get_match_result_api' })
    const code = lodash.get(res, 'code', 0)
    if (!this.is_current_http_key(http_key) || +code !== 200) {
      this.set_show_limiting_toast_tips(code)
      this.set_page_match_empty_status({ state: true, type: res.code == '0401038' ? 'noWifi' : 'noMatch' });
      return []
    }
    // 避免接口慢导致的数据错乱
    const list = lodash.get(res, 'data', [])
    const length = lodash.get(list, 'length', 0)
    if (length < 1) {
      this.set_page_match_empty_status({ state: true });
      return []
    }
    return this.handler_match_list_data({ list: list, type: 2, is_virtual: false })
  }

  /**
   * @description vr赛果
   */
  async get_virtual_results_match(tid) {
    this.clear_match_info()
    const md = lodash.get(MenuData.result_menu_api_params, 'md')
    const { start_time, end_time } = MatchUtils.get_match_time_start_time(md)
    // vr 
    const target_params = {
      batchNo:"",
      endTime: String(end_time),
      isVirtualSport:1,
      page:{ size: 100, current: 1 },
      sportType:MenuData.current_lv_2_menu?.sport_id,
      startTime: String(start_time),
      tournamentId:tid //||"79430600606371842"
    }
    this.set_show_skeleton_state(true)
    const res = await this.handler_axios_loop_func({ http: api_common.get_virtual_result, params: target_params, key: 'get_virtual_result' })
    // vr 马 狗 
    // const res = await api_common.get_virtual_result({"sportType":"1011","startTime":1703520000000,"endTime":1703606399000,"isVirtualSport":1,"page":{"size":100,"current":1},"tournamentId":"23622704245395458","batchNo":""})
    const code = lodash.get(res, 'code', 0)
    if (+code !== 200) {
      this.set_show_limiting_toast_tips(code)
      this.set_page_match_empty_status({ state: true, type: code == '0401038' ? 'noWifi' : 'noMatch' });
      return []
    }

    const list = lodash.get(res.data, 'records', [])
    list.forEach((match) => {
      if (!match.mid && match.matchId) {
        match.mid = match.matchId;
      }
    });
    
    const length = lodash.get(list, 'length', 0)
    if (length < 1) {
      this.set_page_match_empty_status({ state: true });
      return []
    }
    // const matchs = MatchUtils.handler_champion_match_classify_by_sport_id(list)
    return this.handler_match_list_data({ list: list, type: 2, is_virtual: false })
  }

  /**
   * @description 获取电竞赛事； 元数据接口暂时未提供所以走老逻辑， 后续会提供
   */
  async get_esports_match() {
    this.clear_match_info()
    VirtualList.clear_virtual_info()
    // 兼容复刻版电竞冠军
    const md = lodash.get(MenuData.current_lv_3_menu, 'field1', "");
    const menuType = lodash.get(MenuData.current_lv_3_menu, 'menuType', "");
    const is_kemp = menuType == '100';
    // 电竞的冠军
    const category = MenuData.get_menu_type() === 100 || is_kemp ? 2 : 1
    // 复刻版 lodash.get(MenuData.current_lv_2_menu, 'csid'； 欧洲版 lodash.get(MenuData, 'menu_csid', 100)
    const csid = lodash.get(MenuData.current_lv_2_menu, 'csid') || lodash.get(MenuData, 'menu_csid', 100)
    const params = this.get_base_params()
    const http_key = `exports_${csid}_${md}`
    this.set_current_http_key(http_key)
    const target_params = {
      ...params,
      md: is_kemp ? '' : md,
      csid,
      category,
      "type": 3000,
    }
    this.set_show_skeleton_state(true)
    const res = await this.handler_axios_loop_func({ http: api_common.post_esports_match, params: target_params, key: 'post_esports_match' })
    if (!this.is_current_http_key(http_key)) return
    const code = lodash.get(res, 'code', 0)
    if (+code !== 200) {
      this.set_show_limiting_toast_tips(code)
      this.set_page_match_empty_status({ state: true, type: code == '0401038' ? 'noWifi' : 'noMatch' });
      return []
    }
    const list = lodash.get(res, 'data', [])
    MatchCollect.get_collect_match_data(list)

    return is_kemp ? this.handle_custom_matchs(list) : this.handler_match_list_data({ list: list })
  }

  /**
  * @description 赛事详情精选赛事列表
  */
  async get_details_result_match() {
    const res = await api_analysis.get_result_match_care_list({
      sportId: lodash.get(PageSourceData.get_route_parmas(), 'csid', 1),
      cuid: UserCtr.get_uid(),
    })
    if (+res.code !== 200) return this.set_page_match_empty_status({ state: true });
    const list = lodash.get(res, 'data', [])
    return this.handler_match_list_data({ list: list, is_virtual: false, type: 1, source: 'details' })
  }

  /**
   * @description 获取实际渲染赛事
   * @param { Boolean } 是否需要进行 开赛 / 未开赛归类, is_error 是否限频或者接口报错
   *  app-h5: 需要
   *  ouzhou-h5 不需要
   *  yazhou-h5 需要
   */
  async get_target_match_data({ scroll_top = 0, md = '', is_error = false, tid = '', is_clear = false }) {
    // 有的项目菜单类不存在 data_time
    const data_time = String(md || MenuData?.data_time || this.http_params.md)
    // 球种 euid
    const params_tid = tid || MenuData.search_tab_tid
    const euid = MenuData.get_euid(lodash.get(MenuData, 'current_lv_2_menu_i'))
    this.http_params.md = md
    const params = this.get_base_params()
    const http_key = `${euid}_${md}_${tid}`
    if (!is_error) this.set_current_http_key(http_key)
    const other_params = { category: 1 }
    // tid 有值 则 加上 tid
    params_tid &&  Object.assign(other_params, { tid: params_tid })
    tid &&  Object.assign(other_params, { tid })
    // data_time 有值 则 加上 md
    data_time && Object.assign(other_params, { md: data_time })
    const target_params = {
      ...params,
      ...other_params
    }
    if (params_tid && !this.is_ws_trigger) this.set_show_skeleton_state(true)
    // 取消上一次的  限频重新请求逻辑
    this.axios_cancel['match'] && this.axios_cancel['match']()
    const res = await this.handler_axios_loop_func({ http: api_common.post_match_full_list, params: target_params, key: 'post_match_full_list', axios_key: "match"  })
    if (!this.is_current_http_key(http_key) || MenuData.is_collect() || MenuData.is_esports()) return
    const code = lodash.get(res, 'code', 0)
    const list = lodash.get(res, 'data', [])
    const length = lodash.get(list, 'length', 0)
    if (code === '0401038') {
      this.set_show_limiting_toast_tips(code)
      if (this.match_mids.length < 1) return this.set_page_match_empty_status({ state: true, type: 'noWifi' });
      return []
    }
    // 接口报错不对页面进行处理， 渲染元数据； 只当接口返回空数据时才处理
    if (length < 1) return this.set_page_match_empty_status({ state: true });
    // 处理足球下的热门联赛
    this.handler_popular_leagues_by_all(list)
    // 处理收藏赛事
    MatchCollect.get_collect_match_data(list)
    // 复刻版下的新手版 和 赛果 不需要  虚拟计算
    const is_virtual = !(project_name === 'app-h5' && (MenuData.is_results() || UserCtr.standard_edition == 1))
    // 时间 热门相互切换 会导致 is_show_league 不对 需要 清一下 仓库
    if (!is_virtual || is_clear) MatchDataBaseH5.clear()
    this.handler_match_list_data({ list: list, scroll_top, is_virtual, type: !is_virtual ? 2 : 1 })

    // 模拟删除赛事
    // setInterval(() => {
    //   let randomNumber = Math.floor(Math.random() * 3)
    //   const item  = this.complete_matchs.splice(randomNumber, 1)
    //   console.log(randomNumber, item)
    //   this.is_ws_trigger = true
    //   this.handler_match_list_data({ list: this.complete_matchs, scroll_top: this.prev_scroll, merge: 'cover', type: 2 })
    // }, 7000)
  }

  /**
   *@description 获取 to events 赛事
   *@param {csid}
   */
  get_top_events_match(csid) {
    // 菜单没数据先写死
    const params = {
      euid: "30199",
      sort: 1,
      apiType: 1,
      orpt: -1,
      csid,
      cuid: UserCtr.get_uid(),
    }
    api_match.post_fetch_match_list(params).then((res) => {
      if (+res.code !== 200) return this.set_page_match_empty_status({ state: true });
      const data = lodash.get(res, 'data', [])
      // 一期只做  足球、篮球、网球、冠军
      this.handler_match_list_data({ list: data, scroll_top: this.prev_scroll, merge: 'cover', type: 2 })
    })
  }

  /**
   * @description 获取欧洲版联赛数量统计
   */
  async get_ouzhou_leagues_data(date) {
    const res = await api_match_list.get_leagues_list({
      sportId: MenuData.menu_csid ? Number(MenuData.menu_csid) : 1,
      // sportId: 1,
      selectionHour: date
    })
    if (res.code === '0400500') return
    const list = lodash.get(res, 'data', [])
    if (Array.isArray(list) && list.length > 0 && list !== null) {
      MatchCollect.get_collect_match_data()
    }
    return list
  }

  /**
 * @description 获取缓存的欧洲首页热门赛事
 * @returns 
 */
  get_default_ouzhou_home_hots() {
    // const http_key = `ouzhou_h5_hots`
    // this.set_current_http_key(http_key)
    const res = localStorage.getItem('ouzhou_home_hots') && JSON.parse(localStorage.getItem('ouzhou_home_hots'))
    return this.get_ouzhou_home_hots_data(res)
  }

  /**
   * @description 获取欧洲版首页热门赛事
   */
  async get_ouzhou_home_hots() {
    // const http_key = `ouzhou_h5_hots`
    // this.set_current_http_key(http_key)
    const params = {
      euid: "30199",
      sort: 1,
      apiType: 1,
      orpt: -1,
      cuid: UserCtr.get_uid(),
    }
    // const res = await api_match.post_fetch_match_list(params)
    const res = await this.handler_axios_loop_func({ http: api_match.post_fetch_match_list, params, key: 'post_fetch_match_list' })
    return this.get_ouzhou_home_hots_data(res)
  }

  /**
   * @description 获取欧洲版首页热门赛事
   */
  get_ouzhou_home_hots_data(res) {
    // if (!this.is_current_http_key(`ouzhou_h5_hots`)) return []
    if (!res || +res.code !== 200 || res.data.length < 1) return []
    localStorage.removeItem('ouzhou_home_hots')
    localStorage.setItem('ouzhou_home_hots', JSON.stringify(res))
    const hots = lodash.get(res, 'data', [])
    const hots_list = hots.sort((a,b) => +a.csid - +b.csid).slice(0, 5)
    hots_list.map(t => {
      t.match_data_type = 'h5_hots_list'
    })
    const hots_mids = hots_list.map(t => t.mid)
    hots_mids.length && hots_mids.length > 0 && this.set_ws_active_mids({ list: hots_mids, warehouse: MatchDataBaseHotsH5 })

    // 热门赛事数据
    MatchDataBaseHotsH5.set_list(hots_list)
    return hots_list
  }


  /**
   * @description 获取缓存的欧洲首页赛事
   * @returns 
   */
  get_default_ouzhou_home_data() {
    const http_key = `ouzhou_h5`
    this.set_current_http_key(http_key)
    const res = localStorage.getItem('ouzhou_home_data') && JSON.parse(localStorage.getItem('ouzhou_home_data'))
    return this.handle_ouzhou_home_data(res)
  }

  /**
   * @description 获取欧洲版首页热门赛事
   */
  async get_ouzhou_home_data() {
    const http_key = `ouzhou_h5`
    this.set_current_http_key(http_key)
    // const res = await api_match_list.get_home_matches({ type: 1, sort: 2 })
    const res = await this.handler_axios_loop_func({ http: api_match_list.get_home_matches, params: { type: 1, sort: 2 }, key: 'get_home_matches' })
    return this.handle_ouzhou_home_data(res)
  }

  /**
   * @description 获取欧洲版联赛详细比赛
   */
  async get_ouzhou_leagues_list_data(tid, time) {
    const res = await api_match_list.get_leagues_list_match({
      sportId: MenuData.menu_csid ? Number(MenuData.menu_csid) : 1,
      tid: tid,
      selectionHour: time
    })
    if (res.code !== '200') return this.set_page_match_empty_status({ state: true });
    const list = lodash.get(res.data, 'data', [])
    MatchCollect.get_collect_match_data(list)
    this.handler_match_list_data({ list: list, is_virtual: false })
  }

  /**
   * @description 处理欧洲版首页热门赛事
   */
  handle_ouzhou_home_data(res) {
    if (!this.is_current_http_key(`ouzhou_h5`)) return { p15_list: [], hots: [], dataList: [] }
    if (!res || +res.code !== 200) return { p15_list: [], hots: [], dataList: [] }
    localStorage.setItem('ouzhou_home_data', JSON.stringify(res))
    const p15 = lodash.get(res, 'data.p15', [])
    const dataList = lodash.get(res, 'data.dataList', [])

    // 15分钟玩法赛事数据
    const p15_list = MatchUtils.get_ouzhou_15_minute_data(p15)
    // ws 订阅
    const p_15_mids = p15_list.map(t => t.mid)
    p_15_mids.length && p_15_mids.length > 0 && this.set_ws_active_mids({ list: p_15_mids, warehouse: MatchDataBasel5minsH5 })
    MatchDataBasel5minsH5.set_list(p15_list.slice(0, 5))

    // 首页滚球赛事
    const length = lodash.get(dataList, 'length', 0)
    let match_list = []
    if (length > 0) {
      dataList.forEach(t => {
        t.match_data_type = 'h5_in_play_league'
      })
      const arr_list = MatchUtils.handler_match_classify_by_csid(dataList)
      match_list = MatchUtils.get_home_in_play_data(arr_list)
      // this.handler_match_list_data({ list: match_list, type: 2, is_virtual: false })
      this.handler_match_list_data({ list: match_list, warehouse: MatchDataBaseInPlayH5, type: 2, is_virtual: false, merge: 'cover' })
    }
    return { p15_list, dataList: match_list }
  }

  /**
   * @description 获取收藏接口的 euid
   */
  get_collect_euid() {
    const lv_2_menu_i = MenuData.current_lv_2_menu_i
    let mid_list = lodash.get(MenuData, 'collect_list')
    let lv1_mi = lodash.get(MenuData, 'current_lv_1_menu_i')
    let euid = ''
    // 复刻版非冠军收藏
    if (project_name === 'app-h5' && lv_2_menu_i == 50000 && !MenuData.is_kemp()) {
      const menu_list = lodash.get(MenuData, 'menu_list')
      euid = menu_list.map(item => MenuData.get_euid(item.mi + '' + lv1_mi)).join(',')
      // 复刻版冠军收藏
    } else if (project_name === 'app-h5' && lv_2_menu_i == 50000 && MenuData.is_kemp()) {
      const menu_lv_mi_lsit = lodash.get(MenuData, 'menu_lv_mi_lsit')
      euid = menu_lv_mi_lsit.map(item => MenuData.get_euid(item.mi + '')).join(',')
    } else if (lv_2_menu_i == 0) {
      // 根据 菜单id 获取euid
      mid_list.forEach(item => {
        if (BaseData.mi_euid_map_res[item.mi] && BaseData.mi_euid_map_res[item.mi].h) {
          euid += BaseData.mi_euid_map_res[item.mi].h + ','
        }
      })
    } else {
      euid = MenuData.get_euid(lv_2_menu_i + '' + lv1_mi)
    }
    return euid
  }

  /**
   * @description 获取电竞收藏赛事
   */
  async get_esports_collect_match() {
    this.clear_match_info()
    
    const params = this.get_base_params()
    const md = MenuData.data_time && String(MenuData.data_time)

    let csids = ''
    let euid_arr = ''

    // 复刻版获取全部
    if (project_name === 'app-h5') {
      const dianjing_list = lodash.get(BaseData, 'dianjing_sublist', [])
      csids = dianjing_list.map(item => item.csid).join(',')
      euid_arr = dianjing_list.map(item => item.mi && MenuData.get_euid(item.mi + '')).join(',')
    } else {
      csids = MenuData.menu_csid
      euid_arr = MenuData.get_euid(lodash.get(MenuData, 'current_lv_2_menu_i'))
    }

    const target_params = {
      ...params,
      type: 3000,
      csid: csids,
      euid: euid_arr,
      md: md,
      sort: 1
    }
    const http_key = `esport_collect_${euid_arr}_${md}`
    this.set_current_http_key(http_key)
    this.set_show_skeleton_state(true)
    const res = await this.handler_axios_loop_func({ http: api_common.post_esport_collect, params: target_params, key: 'post_esport_collect' })
    if (!this.is_current_http_key(http_key)) return []
    const code = lodash.get(res, 'code', 0)
    const list = lodash.get(res, 'data', [])
    const length = lodash.get(list, 'length', 0)
    if (code !== '200' || length < 1) return this.set_page_match_empty_status({ state: true, type: code == '0401038' ? 'noWifi' : 'noMatch' });
    this.handler_collect_match_list(list)
  }

  /**
   * @description 获取常规赛事收藏赛事
   */
  async get_collect_match() {
    this.clear_match_info()
    const euid = this.get_collect_euid()
    const md = String(MenuData.data_time)
    const params = this.get_base_params(euid)
    delete params.hpsFlag
    const target_params = {
      ...params,
      md,
    }
    const http_key = `collect_${euid}_${md}`
    this.set_current_http_key(http_key)
    if (![3, 6].includes(MenuData.current_lv_1_menu_mi?.value) || !MenuData.data_time) delete target_params.md
    this.set_show_skeleton_state(true)
    const res = await this.handler_axios_loop_func({ http: api_common.get_collect_matches, params: target_params, key: 'get_collect_matches' })
    if (!this.is_current_http_key(http_key)) return
    const code = lodash.get(res, 'code', 0)
    const list = lodash.get(res, 'data', [])
    const length = lodash.get(list, 'length', 0)
    if (+code !== 200 || length < 1) return this.set_page_match_empty_status({ state: true, type: code == '0401038' ? 'noWifi' : 'noMatch' });
    if (MenuData.is_kemp()) {
      // 冠军
      MatchCollect.get_collect_match_data(list)
      this.handle_custom_matchs(list)
    } else {
      this.handler_collect_match_list(list)
    }
  }

  /**
   * @description 处理收藏赛事
   */
  async handler_collect_match_list(list = []) {
    // 频繁切换菜单， 收藏接口比较慢时 会影响其他页面， 故加上判断
    if (!MenuData.is_collect()) return
    const length = lodash.get(list, 'length', 0)
    if (length > 0) {
      const is_virtual = project_name === 'app-h5' ? true : false
      this.handler_match_list_data({ list: list, is_virtual, merge: 'cover' })
      MatchCollect.get_collect_match_data(list)
      // 该赛事是否收藏
      // list.forEach((t) => {
      //   MatchCollect.set_match_collect_state(t, true)
      // })
    } else {
      this.set_page_match_empty_status({ state: true });
    }
  }

  /**
   * @description 获取五大联赛列表
   */
  async get_five_leagues_list() {
    // 四大联赛 tid 写死 西甲 320 英超 180 意甲 239 德甲 276 法甲 79
    // 欧洲版首页五大联赛板块 只查滚球 euid 40203
    // 热门 type 12
    const filterData = {}
    const max = 5
    const tid = ['320', '180', '239', '276', '79']
    const euid = '40203'
    const type = '12'
    const params = this.get_base_params(euid)
    const res = await api_match_list.get_matches_list({
      ...params,
      md: MenuData.data_time,
      tid: tid.toString(),
      euid,
      type
    })
    if (res.code !== '200') return this.set_page_match_empty_status({ state: true });
    const list = lodash.get(res, 'data', [])
    list.forEach(item => {
      const { tid } = item
      item.warehouse_type = 'five_league'
      item.match_data_type = 'h5_five_league'
      if (!filterData[tid]) {
        filterData[tid] = [item]
      } else if (filterData[tid].length < max) {
        filterData[tid].push(item)
      }
    })
    const results = Object.values(filterData).flat()
    this.handler_match_list_data({ list: results, warehouse: MatchDataBaseFiveLeagueH5, type: 2, is_virtual: false })
    return results
  }

  /**
   * @description 设置页面是否为空
   * @param {*} state 
   */
  set_page_match_empty_status(obj) {
    this.set_show_skeleton_state(false)
    const { state = false, type = 'noMatch' } = obj
    useMittEmit(MITT_TYPES.EMIT_IS_SHOW_MASK, false);
    useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, { state: state, type: type });
  }

  /**
   * @description 限频提示
   * @param {*} code 
   */
  set_show_limiting_toast_tips (code = '') {
    if (code == '0401038' && this.match_mids.length < 1) useMittEmit(MITT_TYPES.EMIT_SHOW_TOAST_CMD, `${i18n_t('msg.msg_nodata_22')}`)
  }

  /**
   * @description 设置骨架图的显示状态
   * @param {*} val 
   */
  set_show_skeleton_state (val) {
    useMittEmit(MITT_TYPES.EMIT_SHOW_SKELETON_DIAGRAM, val)
  }

  /**
  * @description 设置是否需要赛事归类
  * @param { Boolean } val 
  */
  get_is_classify() {
    let is_classify = false
    if (project_name === 'app-h5') {
      // 滚球不需要
      if (MenuData.is_scroll_ball() || MenuData.is_zaopan()) {
        is_classify = false
      } else if (MenuData.is_today() || MenuData.is_mix() || MenuData.is_esports()) {
        // 今日、串关需要 开赛、未开赛归类
        is_classify = true
      }
    } else {
      is_classify = false
    }
    return is_classify
  }

  set_current_euid(val) {
    this.current_euid = val
  }

  /**
   * @description 处理收藏页数据
   * @param { type } 1: 联赛 2 赛事
   */
  set_collect_match(match, type) {
    const { mid, tid } = match
    let target_matchs = []
    if (type === 1) {
      target_matchs = this.complete_matchs.filter(t => t.tid !== tid)
      // const mids = matchs.map(item => item.mid)
      // target_matchs = this.match_mids.filter(t => !mids.includes(t))
    } else {
      target_matchs = this.complete_matchs.filter(t => t.mid !== mid)
    }
    this.clear_match_info()
    // this.match_mids = target_mids
    this.handler_match_list_data({ list: target_matchs, is_virtual: false, merge: 'cover', type: 2 })
  }

  /**
  * @description 处理非元数据赛事, 不需要走 模版计算以及获取赔率
  * @param { res } 接口返回对象
  */
  handle_custom_matchs(list) {
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return

    const target_data = MatchUtils.generate_match_classify_tid(list)

    const target_list = MatchUtils.handler_match_classify_by_csid(target_data).filter((t) => t.mid)
    const custom_match_mids = target_list.map(t => t.mid)

    this.complete_matchs = lodash.uniqBy(target_list, 'mid')
    this.complete_mids = lodash.uniq(custom_match_mids)
    this.match_mids = lodash.uniq(custom_match_mids)

    this.compute_current_matchs()

    // 重置折叠对象
    // MatchFold.clear_fold_info()
    MatchResponsive.clear_ball_seed_count()
    MatchResponsive.clear_ball_seed_league_count()

    target_list.forEach((t, i) => {
      this.match_assistance_operations(t, i)
      Object.assign(t, {
        is_meta: false,
        estimateHeight: MatchUtils.get_default_estimateHeight(t),
        is_show_league: MatchUtils.get_match_is_show_league(i, target_list)
      })
    })
    // 不需要调用赔率接口
    MatchDataBaseH5.set_list(target_list)
    this.set_page_match_empty_status({ state: false });
  }

  /**
   * @description 非元数据处理
   * @param { list } 赛事 list
   * @param { type } 是否获取赔率
   * @param { is_virtual } 是否走虚拟计算
   * @param { is_classify } 是否进行开赛、未开赛归类
   * @param { warehouse } 仓库类型 示例 因欧洲版首页同时存在2个类别赛事， 折叠、收藏 不能相互影响
   */
  handler_match_list_data(config) {

    const { list = [], type = 1, is_virtual = true, warehouse = MatchDataBaseH5, scroll_top = 0, merge = '', source = '' } = config

    const is_classify = this.get_is_classify()

    // 重置元数据计算流程
    MatchResponsive.set_is_compute_origin(false)

    // 清除联赛下得赛事数量
    if (this.is_other_warehouse(warehouse.name_code)) {
      MatchResponsive.clear_other_ball_seed_league_count()
    } else {
      MatchResponsive.clear_ball_seed_league_count()
    }
    MatchResponsive.clear_ball_seed_count()

    const length = lodash.get(list, 'length', 0)

    if (length < 1) return this.set_page_match_empty_status({ state: true });

    // 生成新的 联赛 归类 id
    let target_data = MatchUtils.generate_match_classify_tid(list)
    if (is_classify) {
      // 赛事归类(开赛-未开赛) 里面包含了球种归类、联赛归类
      target_data = MatchUtils.handler_match_classify_by_ms(list).filter((t) => t.mid)
    } else {
      target_data = MatchUtils.handler_match_classify_by_csid(list).filter((t) => t.mid)
      // 球种归类
      // const result_data = MatchUtils.handler_match_classify_by_csid(list).filter((t) => t.mid)
      // 联赛归类
      // target_data = MatchUtils.handler_match_classify_by_tid(result_data)
    }

    // 重置折叠对象
    // MatchFold.clear_fold_info()

    // 赛事全量数据
    const match_list = target_data.map((match, index) => {
      // 设置联赛下的赛事数量， 不能是虚拟计算过后得
      if (this.is_other_warehouse(warehouse.name_code)) {
        MatchResponsive.set_other_ball_seed_league_count(match)
      } else {
        MatchResponsive.set_ball_seed_league_count(match)
      }

      // 设置赛事默认参数
      const params = this.set_match_default_properties(match, index, target_data.map(t => t.mid))

      //  赛事操作
      this.match_assistance_operations(match, index)

      Object.assign(match, params, {
        is_meta: false,
        estimateHeight: MatchUtils.get_default_estimateHeight(match),
        is_show_league: MatchUtils.get_match_is_show_league(index, target_data),
        is_show_secondary_play: MatchUtils.get_match_is_show_secondary_play(match),
        is_show_ball_title: MatchUtils.get_match_is_show_ball_title(index, target_data),
        is_show_border_radius: MatchUtils.get_is_show_border_radius(index, target_data),
      })
      return match
    })

    // 最终赛事数据
    const matchs_data = lodash.uniqBy(match_list, 'mid')
    const result_mids = matchs_data.map(t => t.mid)

    if (this.is_other_warehouse(warehouse.name_code)) {
      this.other_complete_matchs = matchs_data
      this.other_complete_mids = result_mids
    } else {
      this.complete_matchs = matchs_data
      this.complete_mids = result_mids
    }

    // base-virtual-list 所需数据
    this.compute_current_matchs()

    // 复刻版 base-virtual-list 组件 不需要走下面的逻辑
    if (project_name !== 'app-h5') {
      if (!is_virtual) {
        // 清除虚拟计算信息
        VirtualList.clear_virtual_info()
        this.match_mids = lodash.uniq(result_mids)
        if (type === 2) {
          // 不获取赔率  type 删除收藏赛事 需要以最新的为准 提交仓库需设置 merge: 'cover'
          this.handle_update_match_info({ list: matchs_data, warehouse, merge: merge })
        } else if (type === 1) {
          // 获取赔率
          this.handle_submit_warehouse({ list: matchs_data, warehouse })
        }
      } else {
        // 计算所需渲染数据
        this.compute_page_render_list({ scrollTop: scroll_top, merge, type })
      }
    }

    // 赛果详情
    if (source === 'details') this.handle_submit_warehouse({ list: matchs_data, warehouse })

    // 重置数据为空状态
    this.set_page_match_empty_status({ state: false })

    return matchs_data
  }

  /**
   * @description 元数据 处理 设置 match_mids
   * @param { mids } 全量 赛事 mids 
   * @param { match_list } 全量 赛事 match
   */
  set_match_mids(mids = [], match_list = [], is_compute = true) {

    // 清除联赛下得赛事数量
    MatchResponsive.clear_ball_seed_count()
    MatchResponsive.clear_ball_seed_league_count()
    

    // 是否需要开赛、未开赛归类
    const is_classify = this.get_is_classify()

    // 赛事归类开赛、未开赛
    const target_data = is_classify ? MatchUtils.handler_match_classify_by_ms(match_list).filter((t) => t.mid) : match_list.filter((t) => t.mid)
    // 过滤赛事 
    this.complete_mids = mids
    this.complete_matchs = target_data.map((t, index) => {
      // 设置联赛下的赛事数量， 不能是虚拟计算过后得
      // MatchResponsive.set_ball_seed_league_count(t)
      // is_show_ball_title 和顺序有关 得放在最终赋值处
      const is_show_ball_title = MatchUtils.get_match_is_show_ball_title(index, target_data)
      return {
        ...t,
        is_show_ball_title
      }
    })
    this.compute_current_matchs()

    const length = lodash.get(this.complete_matchs, 'length', 0)
    this.set_page_match_empty_status({ state: length > 0 ? false : true });

    // 计算所需渲染数据 or 不获取赔率
    is_compute ? this.compute_page_render_list({ scrollTop: 0 }) : this.handle_update_match_info({ list: this.complete_matchs, merge: 'cover' })

  }

  /**
   * @description 计算所需渲染数据
   */
  compute_page_render_list(config) {

    const { scrollTop = 0, type = 1, is_scroll = true, merge = '', warehouse = MatchDataBaseH5 } = config

    // 计算当前页所需渲染数据
    const scroll_top = is_scroll ? scrollTop : this.prev_scroll

    this.prev_scroll = scroll_top

    // 菜单 ID 对应的 元数据赛事 mids
    const menu_lv_v1 = MenuData.current_lv_1_menu_i
    const menu_lv_v2 = MenuData.current_lv_2_menu_i
    // 冠军  或者  电竞冠军 或者   赛果虚拟体育  ，赋值全部数据， 不走下边计算逻辑
    if ([400, 300].includes(menu_lv_v1) || (menu_lv_v1 == 28 && [1001, 1002, 1004, 1011, 1010, 1009, 100].includes(menu_lv_v2))) {
      return
    }

    // 虚拟列表所需渲染数据
    const match_datas = VirtualList.compute_current_page_render_list(scroll_top)

    // 欧洲版首页 五大联赛 当前渲染的 mids
    this.match_mids = match_datas.map(t => t.mid)

    // 不获取赔率
    if (type === 2) return this.handle_update_match_info({ list: match_datas, warehouse, merge })

    // 获取赔率
    if (type === 1) return this.handle_submit_warehouse({ list: match_datas, warehouse })

  }

  /**
   * @description 计算当前赛事数据
   */
  compute_current_matchs() {
    const complete_matchs = lodash.get(this, 'complete_matchs', [])
    // 折叠对象
    const fold_data = MatchFold.match_mid_fold_obj.value
    this.current_matchs = complete_matchs.filter((match) => {
      const { mid, is_show_league } = match
      if (!mid) return false
      // 赛事折叠信息
      const fold_key = MatchFold.get_match_fold_key(match)
      // 赛事是否显示
      const show_card = lodash.get(fold_data[fold_key], `show_card`)
      // 默认高度
      match.estimateHeight = MatchUtils.get_default_estimateHeight(match)
      // if (is_show_league || show_card) this.current_matchs.push(match)
      return is_show_league || show_card
    })
  }

  /**
   * @description 是否其他仓库
   * @param {string} name  仓库 nameCode
   * @returns Boolean
   */
  is_other_warehouse(name) {
    return ['MatchDataWarehouse_ouzhou_PC_five_league_List_Common'].includes(name)
  }

  /**
   * @description 重置 prev_scroll 
   */
  set_prev_scroll(val) {
    this.prev_scroll = val
  }

  /**
   * @description 设置 ws 改变标志
   */
  set_is_ws_trigger(val) {
    this.is_ws_trigger = val
  }

  /**
   * @description 设置ws激活的 赛事mids
   */
  set_ws_active_mids({ list = [], warehouse = MatchDataBaseH5 }) {
    warehouse.set_active_mids([])
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return
    if (MenuData.is_results() && PageSourceData.route_name != 'match_result') return
    const mids = list.map(t => t.mid)
    nextTick(() => {
      warehouse.set_active_mids(mids)
    })
  }

  /**
   * @description 设置激活的 赛事mids
   */
  set_current_match_mids(mids = []) {
    this.match_mids = mids
  }

  /**
   * @description 清除赛事信息
   */
  clear_match_info() {
    this.match_mids = []
    this.complete_matchs = []
    this.current_matchs = []
    this.complete_mids = []
  }

  /**
   * @description 更新 是否 接口 导致的数据变更
   */
  update_is_http_update_info () {
    let timer = setTimeout(() => {
      MatchResponsive.set_is_http_update_info(false)
      clearTimeout(timer)
      timer = null
    }, 1500)
  }

  /**
   * @description: 0未开始 1滚球阶段 2暂停 7延迟 10比赛中断 110即将开赛  3结束 4关闭 5取消 6比赛放弃 8未知 9延期            
   * @param {Number} ms 赛事状态
   * @return {Boolean}
   */
  is_valid_match(ms) {
    return [0, 1, 2, 7, 10, 110].includes(+ms); //有效状态包括未开赛与进行中
  }

  /**
   * @description 当前 接口标识， 防止 同一个接口 请求，但参数不同时， 被接口较慢返回的影响
   * @return { String }  value  标识
   */
  set_current_http_key (value) {
    this.current_http_key = value
  }

  /**
   * @description 当前 接口标识，是否同一个
   * @return { String }  value  标识
   */
  is_current_http_key (value) {
    return this.current_http_key === value
  }

  /**
   * @description 接口限频或者报错 执行3次
   * @param {*} param0 
   * @returns 
   */
  handler_axios_loop_func (axios_params = {}) {
    const { http = '', params = '', key = '', axios_key = 'match', code = ["0401038"], timers = 2500 } = axios_params
    if (!http) return
    return new Promise((resolve, reject) => {
      const http_info = {
        // axios api对象
        axios_api: http,
        // axios api对象参数
        params: params,
        // 唯一key值
        key: key,
        // 错误状态码
        error_codes: code,
        // axios中then回调方法
        fun_then: (res) => {
          resolve(res)
        },
        // axios中catch回调方法
        fun_catch: (e) => {
          console.error(e)
          resolve({ code: '0401038' })
        },
        fun_finally: () => { },
        // 最大循环调用次数(异常时会循环调用),默认3次
        max_loop: 3,
        // 异常调用时延时时间,毫秒数,默认1000
        timers: timers,
      };
      // 执行
      // axios_loop(http_info);
      // axios_loop(http_info);
      Object.assign(this.axios_cancel, {
        [axios_key]: axios_loop(http_info)
      })
    })
  }

  /**
   * @description: 页脚菜单事件
   * @param {Object} obj 选中的页脚项目对象
   * @return {Undefined} Undefined
   */
  footer_event(obj) {
    switch (obj.text) {
      // 活动
      case "activities":
        console.log('每日活动')
        break;
      // 排序
      case "sortRules":
        this.set_show_skeleton_state(true)
        MatchFold.clear_fold_info()
        this.clear_match_info()
        this.handler_again_matchs()
        useMittEmit(MITT_TYPES.EMIT_GOT_TO_TOP)
        break;
      // 筛选
      case "filter":
        const length = lodash.get(obj.select_list, 'length', 0)
        if (length === 0) return
        const tid = obj.select_list.map(t => t.id).join(',')
        this.handler_again_matchs(tid)
        break;
      // 刷新
      case "footer-refresh":
        this.handler_again_matchs()
        if (PageSourceData.route_name !== 'match_result') {
          useMittEmit(MITT_TYPES.EMIT_RE_STATISTICS_MATCH_COUNT);
        }
        break;
      case "mid-refresh": // 赔率刷新
        this.get_match_base_hps_by_mids({ mids: obj.mid });
        break;
      case "footer-follow":
        if (!obj.before_status) {
          MatchDataBaseH5.clear();
        }
        break;
      default:
        console.log('暂无对应类型')
    }
  }

  /**
   * @deprecated 处理数据
   * @param { String } tid 联赛 ID
   */
  handler_again_matchs(tid = '') {
    if (MenuData.is_collect()) {
      // 收藏页
      if (MenuData.is_esports()) {
        // 电竞收藏
        this.get_esports_collect_match()
      } else {
        // 常规收藏
        this.get_collect_match()
      }
    } else {
      // 非收藏页
      if (MenuData.is_esports()) {
        // 电竞
        this.get_esports_match()
      } else if (MenuData.is_results()) {
        // 赛果
        this.get_results_match({ tid });
      } else if (MenuData.is_kemp()) {
        // 冠军
        this.get_champion_match();
      } else {
        // 常规
        this.get_target_match_data({ tid });
      }
    }
  }

  /**
   * @description 删除赛事不能防抖， 删除赛事会同时同事多个 C102 , 但只有一个状态 为 999 
   */
  handle_remove_match(data) {
    // mhs === 2  || mmp === 999 为关盘 则移除赛事
    const { cd: { mid = '', mhs = 0, mmp = 1, ms = 110 } } = data
    if (mhs == 2 || mmp == '999' || !this.is_valid_match(ms)) {
      // match_mids是可视区域id
      const active_index = this.match_mids.findIndex(t => t === mid)
      // active_index>-1&& this.match_mids.splice(active_index,1)
      const index = this.complete_matchs.findIndex(t => t.mid == mid)
      index > -1 && this.complete_matchs.splice(index, 1)
      if (active_index > -1) {
        if (this.debounce_timer) return
        this.debounce_timer = setTimeout(() => {
          this.is_ws_trigger = true
          // 移除赛事需要重新走虚拟计算逻辑， 不然偏移量不对
          this.handler_match_list_data({ list: this.complete_matchs, scroll_top: this.prev_scroll, merge: 'cover', type: 2 })
          // this.get_target_match_data({ scroll_top: this.prev_scroll, md: this.http_params.md })
          clearTimeout(this.debounce_timer)
          this.debounce_timer = null
        }, 1000)
      }
    }
  }

  /**
   * @description ws 指令处理
   * @param {*} cmd 
   */
  handle_ws_directive({ cmd = '', data = {} }) {
    if (!['C109', 'C303', 'C114', 'C101', 'C102', 'C104', 'C901'].includes(cmd)) return
    // console.log('--------wswswswswswsws-cmd:', cmd, data)
    // 赛事新增
    if (['C109'].includes(cmd)) {
      const { cd = [] } = data
      if (cd.length < 1) return
      const item = cd.find(t => t.csid == MenuData.menu_csid)
      // 调用 matchs  接口
      if (item) {
        this.is_ws_trigger = true
        if (MenuData.is_kemp()) {
          // this.get_champion_match()
        } else {
          this.debounce_add_match()
          // this.get_target_match_data({ scroll_top: this.prev_scroll, md: this.http_params.md })
        }
      }
    }
    // 赛事移除
    if (['C101', 'C102', 'C104', 'C901'].includes(cmd)) {
      const { cd: { mid = '', mhs = 0, mmp = 1, ms = 110 } } = data
      if (mhs == 2 || mmp == '999' || !this.is_valid_match(ms)) {
        // match_mids是可视区域id
        const active_index = this.match_mids.findIndex(t => t === mid)
        // active_index>-1&& this.match_mids.splice(active_index,1)
        const index = this.complete_matchs.findIndex(t => t.mid == mid)
        index > -1 && this.complete_matchs.splice(index, 1)
        if (active_index > -1) this.debounce_remove_match()
      }
    }
    // 调用 mids 接口
    if (['C114', 'C303'].includes(cmd)) {
      const { mid = '' } = data.cd || {};
      let _mids = String(mid).split(',')
      if (_mids.some((_mid) => this.match_mids.includes(_mid))) this.handle_ws_get_hps(cmd === 'C303' ? 3000 : 2000)
      // if (_mids.some((_mid) => this.match_mids.includes(_mid))) this.debounce_get_hps(cmd === 'C303' ? 5000 : 2000)
    }
  }
  // 赛事新增
  handle_ws_add_match () {
    this.is_ws_trigger = true
    // 清除获取赔率
    // this.debounce_get_hps.cancel()
    clearTimeout(this.axios_get_hps_timer)
    this.axios_get_hps_timer = null
    this.get_target_match_data({ scroll_top: this.prev_scroll, md: this.http_params.md })
  }
  // 删除赛事
  handle_ws_remove_match () {
    this.is_ws_trigger = true
    this.handler_match_list_data({ list: this.complete_matchs, scroll_top: this.prev_scroll, merge: 'cover', type: 2 })
  }
  // 获取赔率 C303 先 5s  业务那边说他们也控制下， 等他们改了  在改成 2s
  handle_ws_get_hps (delay = 2000) {
    if (this.axios_get_hps_timer) return
    this.axios_get_hps_timer = setTimeout(() => {
      this.get_match_base_hps_by_mids({})
      clearTimeout(this.axios_get_hps_timer)
      this.axios_get_hps_timer = null
    }, delay)
  }
  /**
   * @description 获取赛事赔率
   * @param { mids } mids
   * @param { Object } other 其他参数， 比如 次要玩法拉取
   * @param {  } warehouse 仓库
   */
  async get_match_base_hps_by_mids({ mids = [], other = {}, source = '', warehouse }) {
    // 赛果页不需要获取赔率
    if (MenuData.is_results() && PageSourceData.route_name == 'matchResults') return
    if (this.match_mids.length < 1 && mids.length < 1) return
    const match_mids = this.match_mids.join(',')
    // 冠军不需要调用
    if (MenuData.is_esports()) return
    // 竞足409 不需要euid
    const params = {
      gcuuid: uid(),
      mids: mids.length > 0 ? mids : match_mids,
      cuid: UserCtr.get_uid(),
      sort: UserCtr.sort_type,
      euid: MenuData.is_jinzu() ? "" : MenuData.get_euid(lodash.get(MenuData, 'current_lv_2_menu_i')),
      device: ['', 'v2_h5', 'v2_h5_st'][UserCtr.standard_edition],
    };
    // other 不为空则合并参数
    if (!lodash.isEmpty(other))  Object.assign(params, other)
    // 次要玩法赔率接口删除 euid
    delete params.euid
    // if (source === 'attached') delete params.euid
    //如果是赛果详情精选列表
    if (PageSourceData.route_name == 'match_result') {
      delete params.euid;
      params.versionNewStatus = 'matcheHandpick';
      params.sort = 1;
    }
   
    // 取消上一次的  限频重新请求逻辑
    this.axios_cancel['mids'] && this.axios_cancel['mids']()

    const by_mids_debounce_cache = axios_debounce_cache.get_match_base_info_by_mids;
    if (by_mids_debounce_cache && by_mids_debounce_cache["ENABLED"]) {
      const info = by_mids_debounce_cache.can_send_request({
        ...params,
      });
      if (info?.can_send) {
        //直接发请求    单次数 请求的方法
        this.handler_match_by_mids(params, warehouse)
      } else {
        // 记录timer
        clearTimeout(this.axios_debounce_timer);
        this.axios_debounce_timer = setTimeout(() => {
          //直接发请求    单次数 请求的方法
          this.handler_match_by_mids(params, warehouse)
          this.axios_debounce_timer = null
        }, info?.delay_time || 1000);
      }
    } else {
      //直接发请求    多 次数  循环请求 的方法
      this.handler_match_by_mids(params, warehouse)
    }
  }

  // 赛事赔率请求
  async handler_match_by_mids (params, warehouse = MatchDataBaseH5) {
    let res = ''
    if (MenuData.is_esports()) {
      res = await this.handler_axios_loop_func({ http: api_common.get_esports_match_by_mids, params, key: 'get_esports_match_by_mids', axios_key: "mids" })
    } else {
      res = await this.handler_axios_loop_func({ http: api_common.get_match_base_info_by_mids, params, key: 'get_match_base_info_by_mids', axios_key: "mids" })
    }
    const code = lodash.get(res, 'code', 0)
    const data = lodash.get(res, 'data', [])
    const length = lodash.get(data, 'length', 0)
    if (!res || +code !== 200 || length < 1) return this.update_is_http_update_info()
    MatchResponsive.set_is_http_update_info(true)
    data.forEach(t => {
      // 获取赛事的让球方 0未找到让球方 1主队为让球方 2客队为让球方
      t.handicap_index = MatchUtils.get_handicap_index_by(t)
      t.is_show_secondary_play = MatchUtils.get_match_is_show_secondary_play(t)
      const item = lodash.find(this.complete_matchs, (match) => match.mid === t.mid)
      // 默认高度  match  接口  和  by_mids  接口 有时候 返回的 次要玩法开关不一致 ， 故重计算下
      // MatchFold.set_match_show_tab(t)
      // t.estimateHeight = MatchUtils.get_default_estimateHeight(t)
      if (item) {
        const index = lodash.findIndex(this.complete_matchs, (match) => match.mid === t.mid)
        if (index > -1) this.complete_matchs[index] = Object.assign({}, item, t)
      }
      // 更新 current_matchs
      const c_item = lodash.find(this.current_matchs, (match) => match.mid === t.mid)
      if (c_item) {
        const c_index = lodash.findIndex(this.current_matchs, (match) => match.mid === t.mid)
        if (c_index > -1) this.current_matchs[c_index] = Object.assign({}, c_item, t)
      }
    })
    // 设置仓库渲染数据
    this.handle_update_match_info({ list: data, merge: 'cover', warehouse })
  }

   // 不需要重置的属性
   no_reset_attribute (match, warehouse = MatchDataBaseH5) {
    let result = {}
    const item = warehouse.get_quick_mid_obj(match.mid)
    if (item) {
      Object.assign(result, {
        hps: item.hps || [], // 主赔率
        hps15Minutes: item.hps15Minutes || [], // 15 分钟赔率
        hpsBold: item.hpsBold || [], // 15 波胆赔率
        hpsCompose: item.hpsCompose || [], // 15 特色组合赔率
        hpsCorner: item.hpsCorner || [], // 角球赔率
        hpsOutright: item.hpsOutright || [], // 冠军玩法赔率
        hpsOvertime: item.hpsOvertime || [], // 加时赔率
        hpsPenalty: item.hpsPenalty || [], // 点球大战赔率
        hpsPromotion: item.hpsPromotion || [], // 晋级赔率
        hpsPunish: item.hpsPunish || [], // 罚牌赔率
        hpsAdd: item.hpsAdd || [] // 其他球种赔率
      })
    }
    return result
  }

  /**
   * @description 更新对应赛事
   * @param { list } 赛事数据 
   * @param { type } 接口请求时， 以接口数据为准， 反之已上一次的数据为准 避免赔率闪动
   * @param { warehouse } 仓库类型
   */
  handle_update_match_info(config) {
    MatchResponsive.set_is_http_update_info(true)
    const { list = [], merge = '', warehouse = MatchDataBaseH5 } = config
    // 合并前后两次赛事数据
    const result = lodash.map(list, t => {
      // MatchResponsive.get_ball_seed_methods(t)
      const match = warehouse.get_quick_mid_obj(t.mid)
      let target = {}
      if (merge === 'cover') {
        target = Object.assign({}, match, t)
      } else {
        target = match?.is_meta ? Object.assign({}, match, t) : Object.assign({}, t, match)
      }
      return target
    })
    // ws 订阅
    this.set_ws_active_mids({ list: list, warehouse })
    // 设置仓库渲染数据
    warehouse.set_list(result)
    this.is_ws_trigger = false
    this.update_is_http_update_info()
  }

  /**
   * @description 提交更新仓库
   * @param { list } 赛事数据
   * @param { warehouse } 仓库类型
   */
  handle_submit_warehouse(config) {
    MatchResponsive.set_is_http_update_info(true)
    const { list = [], warehouse = MatchDataBaseH5 } = config
    // ws 订阅
    // this.set_ws_active_mids({ list: list, warehouse })
    // ws 触发的赛事新增 赔率不需要重置
    let result = []
    if (this.is_ws_trigger) {
      result = list.map(t => {
        const hps_data = this.no_reset_attribute(t, warehouse)
        return Object.assign({}, t, hps_data)
      })
    } else {
      result = list
      warehouse.clear()
    }
    // 设置仓库渲染数据
    warehouse.set_list(result)
    this.is_ws_trigger = false
    this.get_match_base_hps_by_mids({ })
  }
  // 销毁
  destroy () {
    clearTimeout(this.debounce_timer)
    clearTimeout(this.axios_debounce_timer)
    clearTimeout(this.axios_get_hps_timer)
    this.debounce_timer = null
    this.axios_debounce_timer = null
    this.axios_get_hps_timer = null
    this.debounce_add_match.cancel()
    this.debounce_remove_match.cancel()
    this.debounce_get_hps.cancel()
  }
}

export default ref(new MatchMeta()).value