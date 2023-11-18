
/**
 * @description 赛事 元数据处理
 */
import { ref } from 'vue'
import lodash from 'lodash'
import { api_common, api_match_list, api_match } from "src/api/index.js";
import BaseData from 'src/core/base-data/base-data.js'
import MatchPage from 'src/core/match-list-h5/match-class/match-page'
import UserCtr from 'src/core/user-config/user-ctr.js'
import MatchFold from 'src/core/match-fold'
import MatchCollect from 'src/core/match-collect'
import MatchUtils from 'src/core/match-list-h5/match-class/match-utils';
import PageSourceData from "src/core/page-source/page-source.js";
import VirtualList from 'src/core/match-list-h5/match-class/virtual-list'
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';
import { MATCH_LIST_TEMPLATE_CONFIG } from "src/core/match-list-h5/match-card/template"
import { useMittEmit, MITT_TYPES,project_name, MenuData,
  MatchDataWarehouse_H5_List_Common as MatchDataBaseH5, MatchDataWarehouse_ouzhou_PC_hots_List_Common as MatchDataBaseHotsH5,
  MatchDataWarehouse_ouzhou_PC_five_league_List_Common as MatchDataBaseFiveLeagueH5, MatchDataWarehouse_ouzhou_PC_l5mins_List_Common as MatchDataBasel5minsH5, 
} from 'src/core'

class MatchMeta {

  constructor() {
    this.init()
  }

  init () {
    // 当前页面数据mids集合
    this.match_mids = []
    // 早盘下的 mids
    this.zaopan_mids = []
    // 联赛 id 对应的 mids
    this.tid_map_mids = {}
    // 赛事全量mids
    this.complete_mids = []
    // 赛事全量数据
    this.complete_matchs = []
    // 上一次滚动得距离
    this.prev_scroll = null
    // 是否需要赛事归类操作
    this.is_classify = false
    // 日期
    this.params_md = ''
    // 赛事仓库
    this.warehouse_type = ''
    // 其他仓库的全量赛事
    this.other_match_mids = []
    this.other_complete_matchs = []
    // 其他仓库的全量赛事mids
    this.other_complete_mids = []
    // 重置折叠对象
    MatchFold.clear_fold_info()
    // 重置收藏对象
    MatchCollect.clear_collect_info()
  }

  /**
   * @description 设置 赛事 元数据
   * @param { Number } md 时间
   */
  async set_origin_match_data(md) {
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

    this.params_md = md

    // // 刷新页面 二级菜单丢失， 暂时放在这里 获取真实数据
    this.get_target_match_data()

    // 滚球全部
    if (+menu_lv_v1 === 1 && menu_lv_v2 == 0) return this.get_origin_match_mids_by_mis(menu_lv_v1_sl)

    // 今日 & 早盘
    if ([2,3].includes(+menu_lv_v1)) return this.get_origin_match_mids_by_mis(menu_lv_v2_sl)
   
    // 对应 球种 mi 
    if (typeof menu_lv_v2 !== 'string') return
    // 电竞、赛果 return
    if (MenuData.is_export() || MenuData.is_results()) return

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
    const mids = lodash.uniq(match_mids_list)
    this.zaopan_mids = mids
    this.get_origin_match_by_mids(mids)
  }

  /** 
   * @description 根据 mi 获取对应的 mids
   * @param { mi } 二级菜单  
   */
  get_origin_match_mids_by_mi (mi) {
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
    // 显示空数据页面
    if (length < 1) return this.set_page_match_empty_status(true);
    // 赛事全量数据
    const match_list = result_mids.map((t, index) => {
      // 获取对应赛事数据
      const match = BaseData.resolve_base_info_by_mid(t)
      // 获取赛事模板参数
      const template = this.set_match_default_template(match)
      // 设置赛事默认参数
      const params = this.set_match_default_properties(match, index, result_mids)
      // 赛事最终数据
      const target = Object.assign(match, template, params)
      // 赛事其他操作
      this.match_assistance_operations(target)
      return target
    })

    // 元数据不作为最终渲染数据 所以不走虚拟计算
    // 元数据只作用域切换菜单时快速显示， 最终显示还是根据接口来
    this.match_mids = lodash.uniq(mids.slice(0, 20))
    this.set_match_mids(result_mids.slice(0, 20), match_list.slice(0, 20))
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
   * @param { match } 赛事对象
   * @param { index } 赛事对应下标
   */
  set_match_default_properties(match, index, mids) {
    // 是否展示联赛标题
    const is_show_league = MatchUtils.get_match_is_show_league(index, mids)
    const is_show_no_play = MatchUtils.get_match_is_show_no_play(index, mids)
    const { home_score, away_score } = MatchUtils.get_match_score(match)
    return {
      source_index: index,
      is_show_no_play,
      is_show_league,
      away_score,
      home_score
    }
  }

  /**
   * @description 赛事操作
   * @param { match } 赛事对象
   */
  match_assistance_operations (match) {
    const { tid, csid, mid, ms } = match
    // 初始化赛事折叠
    MatchFold.set_match_mid_fold_obj(match)

    const fold_key = MatchFold.get_fold_key(match)

    //  初始化全部球种折叠状态
    if (!(fold_key in MatchFold.ball_seed_csid_fold_obj.value)) MatchFold.set_ball_seed_csid_fold_obj(fold_key)
    // 进行中
    if (!(fold_key in MatchFold.progress_csid_fold_obj.value) && [1,110].includes(+ms)) MatchFold.set_progress_csid_fold_obj(fold_key)
    // 未开赛
    if (!(fold_key in MatchFold.not_begin_csid_fold_obj.value) && [1,110].includes(+ms)) MatchFold.set_not_begin_csid_fold_obj(fold_key)

    // 获取模板默认高度
    const template_config = this.get_match_default_template_config(csid)
    // 虚拟列表计算
    VirtualList.set_match_mid_map_base_info(match, template_config.match_template_config)

  }

  /**
   * @description 不走元数据情况 获取 match_mids
   * @param { list } 赛事数据 
   */
  get_match_mids (list) {
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return this.set_page_match_empty_status(true);
    const match_mids_list = list.map(t => {
      return t.mid
    })
    this.set_match_mids(match_mids_list, list)
  }

  /**
   * @description 早盘 下根据时间来筛选
   * @param { time } 所选择的时间
   */
  filter_match_by_time (time) {
    // 所有日期
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
    const mids = this.tid_map_mids[`tid_${tid}`].mids
    if (mids.length < 1) return 
    this.get_origin_match_by_mids(mids)
  }

  /**
   * 
   * @description 获取赛事请求参数
   * @returns { Object }
   */
  get_base_params (euid) {
    // match中 hpsFlag 都为0 除开冠军或电竞冠军; 赛事列表冠军或者电竞冠军/赛果不需要hpsFlag
    const hpsflag = MenuData.is_kemp() || MenuData.get_menu_type() == 28 ? "" : 0
    const current_lv_1_menu_i = lodash.get(MenuData, 'current_lv_1_menu_i')
    const type = MenuData.menu_id_map(current_lv_1_menu_i) ? MenuData.menu_id_map(current_lv_1_menu_i) : current_lv_1_menu_i
    return {
      cuid: UserCtr.get_cuid(), // 508895784655200024
      euid: euid ? euid : MenuData.get_euid(lodash.get(MenuData, 'current_lv_2_menu_i')),
      // 一级菜单筛选类型 1滚球 2 今日 3早盘 400冠军  6串关
      type,
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
    MatchFold.clear_fold_info()
    const menu_lv_v2 = lodash.get(MenuData.current_lv_2_menu, 'mi')
    const euid = lodash.get(BaseData.mi_info_map, `mi_${menu_lv_v2}.h5_euid`, '40602')
    const res = await api_common.post_match_full_list({
      euid,
      "cuid": UserCtr.get_cuid(),
      "type": 100,
      "sort": PageSourceData.sort_type,
      "device": ['', 'v2_h5', 'v2_h5_st'][UserCtr.standard_edition]
    })
    this.handle_custom_matchs(res)
  }

  /**
   * @description 赛果不走元数据， 直接掉接口 不需要走模板计算以及获取赔率，需要虚拟列表计算
   */
  async get_results_match () {
    const md = lodash.get(MenuData.result_menu_api_params, 'md')
    const euid = lodash.get(MenuData.result_menu_api_params, 'sport')
    // 电竞的冠军
    const category = MenuData.result_menu_lv1_mi ? 0 : 1
    if (!md) return
    const params = this.get_base_params()
    const res = await api_common.get_match_result_api({
      ...params,
      category,
      md,
      type: 28,
      euid: euid,
      showem: 1, // 新增的参数
    })
    if (+res.code !== 200) return
    const list = lodash.get(res, 'data', [])
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return
    this.handler_match_list_data({ list: list, type: 2 })
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
    if (+res.code !== 200) return this.set_page_match_empty_status(true);
    const list = lodash.get(res, 'data', [])
    this.handler_match_list_data({ list: list })
  }

  /**
   * @description 获取实际渲染赛事
   * @param { Boolean } is_classify 是否需要进行 开赛 / 未开赛归类
   *  app-h5: 需要
   *  ouzhou-h5 不需要
   *  yazhou-h5 需要
   */
  async get_target_match_data (is_classify = false) {
    const params = this.get_base_params()
    const res = await api_common.post_match_full_list({ 
      ...params,
      md: this.params_md
     })
    if (+res.code !== 200) return
    const list = lodash.get(res, 'data', [])
    const length = lodash.get(list, 'length', 0)
    if (length < 1) return this.set_page_match_empty_status(true);
    // 获取赛 事收藏状态 该接口还没发到试玩
    MatchCollect.get_collect_match_data()
    this.handler_match_list_data({ list: list, is_classify })
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
      cuid: UserCtr.get_cuid(),
    }
    api_match.post_fetch_match_list(params).then((res) => {
      if (+res.code !== 200) return
      const list = lodash.get(res, 'data', [])
      this.handler_match_list_data({ list: list })
    })
  }

  /**
   * @description 获取欧洲版首页热门赛事
   */
  async get_ouzhou_home_data () {
    const res = await api_match_list.get_home_matches({ type: 1 })
    const p15 = lodash.get(res, 'data.p15', [])
    const hots = lodash.get(res, 'data.hots', [])
    const dataList = lodash.get(res, 'data.dataList', [])
    if (+res.code !== 200) return { p15_list: [], hots: [], dataList: [] }
    // 15分钟玩法赛事数据
    const p15_list = this.assemble_15_minute_data(p15)
    MatchDataBasel5minsH5.set_list(p15_list)
    // 热门赛事数据
    MatchDataBaseHotsH5.set_list(hots)
    // 首页滚球赛事
    const length = lodash.get(dataList, 'length', 0)
    let match_list = []
    if (length > 0) {
      match_list = MatchUtils.get_home_in_play_data(dataList)
      this.handler_match_list_data({ list: match_list, type: 2, is_virtual: false })
    }
    return { p15_list, hots, dataList: match_list }
  }

  /**
   * @description 获取最近一组15分玩法数据
   * @param {*} payload 正在比赛的数据
   */
    assemble_15_minute_data = (payload) => {
      return payload.map((item) => {
        const { ms, mst } = item
        const { title, isLock } = MatchUtils.get_match_15_minute_stage(ms, mst)
        return {
          title,
          isLock,
          ...item,
          icon: String(Number(item.csid ) + 100)
        }
      })
    }

  /**
   * @description 获取收藏赛事
   */
  async get_collect_match () {
    const mid = MenuData.current_lv_2_menu_i
    let mid_list = lodash.get(MenuData,'collect_list')
    let lv1_mi = lodash.get(MenuData,'current_lv_1_menu_i')
    let euid = ''
    if(mid == 0){
      // 根据 菜单id 获取euid
      mid_list.forEach(item => {
        if(BaseData.mi_euid_map_res[item.mi] && BaseData.mi_euid_map_res[item.mi].h){
          euid += BaseData.mi_euid_map_res[item.mi].h + ','
        }
      })
    }else{
      euid = MenuData.get_euid(mid+''+lv1_mi)
    }
    const params = this.get_base_params(euid)
    const res = await api_common.get_collect_matches(params)
    if (res.code !== '200') return this.set_page_match_empty_status(true);
    const list = lodash.get(res, 'data', [])
    this.handler_match_list_data({ list: list, is_virtual: false })
  }

  /**
   * @description 获取五大联赛列表
   */
  async get_five_leagues_list () {
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
    if (res.code !== '200') return this.set_page_match_empty_status(true);
    const list = lodash.get(res, 'data', [])
    list.forEach(item => {
      const { tid } = item
      item.warehouse_type = 'five_league'
      if (!filterData[tid]) {
        filterData[tid] = [item]
      } else if (filterData[tid].length < max) {
        filterData[tid].push(item)
      }
    })
    const results = Object.values(filterData).flat()
    // this.handler_match_list_data({ list: results, warehouse: 'five_league' })
    return results
  }

  /**
   * @description 设置页面是否为空
   * @param {*} state 
   */
  set_page_match_empty_status (state) {
    useMittEmit(MITT_TYPES.EMIT_MAIN_LIST_MATCH_IS_EMPTY, state);
  }

   /**
   * @description 设置是否需要赛事归类
   * @param { Boolean } val 
   */
  set_is_classify (val) {
    this.is_classify = val
  }

  /**
   * @description 处理收藏页数据
   * @param { type } 1: 联赛 2 赛事
   */
  set_collect_match (match, type) {
    const { mid, tid } = match
    let target_mids = []
    if (type === 1) {
      const matchs = this.complete_matchs.filter(t => t.tid === tid)
      const mids = matchs.map(item => item.mid)
      target_mids = this.match_mids.filter(t => !mids.includes(t))
    } else {
      target_mids = this.match_mids.filter(t => t !== mid)
    }
    this.match_mids = target_mids
    const Base_warehouse  = this.get_base_warehouse()
    Base_warehouse.upd_data_version()
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

    const target_list = MatchUtils.handler_match_classify_by_csid(list).filter((t) => t.mid)

    const custom_match_mids = target_list.map(t => t.mid)

    this.complete_matchs = target_list
    this.complete_mids = lodash.uniq(custom_match_mids)
    this.match_mids = lodash.uniq(custom_match_mids)

    target_list.forEach((t, i) => {
      Object.assign(t, {
        is_show_league: i === 0 ? true : target_list[i].tid !== target_list[i - 1].tid
      })
      this.match_assistance_operations(t)
    })
    // 不需要调用赔率接口
    const Base_warehouse  = this.get_base_warehouse()
    Base_warehouse.set_list(target_list)
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

    const { list, type = 1, is_virtual = true, is_classify = false, warehouse = '' } = config

    // if (warehouse) this.warehouse_type = warehouse

    // 清除联赛下得赛事数量
    if (['five_league'].includes(warehouse)) {
      MatchResponsive.clear_other_ball_seed_league_count()
    } else {
      MatchResponsive.clear_ball_seed_league_count()
    }

    const length = lodash.get(list, 'length', 0)
    if (length < 1) return this.set_page_match_empty_status(true);
    // 赛事全量数据
    const match_list = list.map((match, index) => {
      // 设置联赛下的赛事数量， 不能是虚拟计算过后得
      if (['five_league'].includes(warehouse)) {
        MatchResponsive.set_other_ball_seed_league_count(match)
      } else {
        MatchResponsive.set_ball_seed_league_count(match)
      }
      // 设置赛事默认参数
      const params = this.set_match_default_properties(match, index, list.map(t => t.mid))
      const is_show_ball_title = MatchUtils.get_match_is_show_ball_title(index, list)
      Object.assign(match, params, {
        is_show_ball_title,
        is_show_league: index === 0 ? true : list[index].tid !== list[index - 1].tid
      })
      //  赛事操作
      this.match_assistance_operations(match)
      return match
    })

    let target_data = list
    if (is_classify) {
      // 赛事归类(开赛-未开赛) 里面包含了球种归类
      target_data = MatchUtils.handler_match_classify_by_ms(match_list).filter((t) => t.mid)
    } else {
      // 球种归类
      const arr_data = MatchUtils.handler_match_classify_by_csid(target_data)
      // 联赛归类
      target_data = MatchUtils.handler_match_classify_by_tid(arr_data).filter((t) => t.mid)
    }
    const result_mids = target_data.map(t => t.mid)
   
    if (['five_league'].includes(warehouse)) {
      this.other_complete_matchs = target_data
      this.other_complete_mids = lodash.uniq(result_mids)
    } else {
      this.complete_matchs = target_data
      this.complete_mids = lodash.uniq(result_mids)
    }
   
    if (!is_virtual) {
      if (!['five_league'].includes(warehouse)) this.match_mids = lodash.uniq(result_mids)
      // 欧洲版首页热门赛事
      this.on_submit_matchs(type, match_list.filter((t) => t.mid)) 
    } else {
      // 计算所需渲染数据
      this.compute_page_render_list(0, type) 
    }

    // 重置数据为空状态
    this.set_page_match_empty_status(false)

  }

  /**
   * @description 元数据 处理 设置 match_mids
   * @param { mids } 全量 赛事 mids 
   * @param { match_list } 全量 赛事 match
   */
  set_match_mids (mids = [], match_list = [], is_compute = true) {

    // 清除联赛下得赛事数量
    MatchResponsive.clear_ball_seed_league_count()

    // 赛事归类开赛、未开赛
    const target_data = this.is_classify ? MatchUtils.handler_match_classify_by_ms(match_list).filter((t) => t.mid) : match_list
    // 过滤赛事 
    this.complete_mids = mids
    this.complete_matchs = target_data.map((t, index) => {
      // 设置联赛下的赛事数量， 不能是虚拟计算过后得
      MatchResponsive.set_ball_seed_league_count(t)
      // is_show_ball_title 和顺序有关 得放在最终赋值处
      const is_show_ball_title = MatchUtils.get_match_is_show_ball_title(index, target_data)
      return { ...t, is_show_ball_title }
    })

    const length = lodash.get(this.complete_matchs, 'length', 0)
    this.set_page_match_empty_status(length > 0 ? false : true);

    // 计算所需渲染数据
    is_compute ? this.compute_page_render_list() : this.on_submit_matchs(2, this.complete_matchs)

  }


  /**
   * @description 计算所需渲染数据
   */
  compute_page_render_list (scrollTop = 0, type = 1) {
    // 计算当前页所需渲染数据
    const scroll_top = scrollTop === 0 ? this.prev_scroll : scrollTop
    this.prev_scroll = scroll_top

    // 菜单 ID 对应的 元数据赛事 mids
    const menu_lv_v1 = MenuData.current_lv_1_menu_i
    const menu_lv_v2 = MenuData.current_lv_2_menu_i
    // 冠军  或者  电竞冠军 或者   赛果虚拟体育  ，赋值全部数据， 不走下边计算逻辑
    if ([400, 300].includes(menu_lv_v1) || (menu_lv_v1 == 28 && [1001, 1002, 1004, 1011, 1010, 1009, 100].includes(menu_lv_v2)) ) {
      return
     }

    // 虚拟列表所需渲染数据
    const match_datas = VirtualList.compute_current_page_render_list(scroll_top)

    // 当前渲染的 mids
    if (!['five_league'].includes(this.warehouse_type)) {
      this.match_mids = match_datas.map(t =>  t.mid)
    }
    
    this.on_submit_matchs(type, match_datas)
  
  }

  /**
   * @description 获取赛事赔率
   * @param { mids } mids
   */
  async get_match_base_hps_by_mids (mids = []) {
    if (this.match_mids.length < 1 && mids.length < 1) return
    const match_mids = this.match_mids.join(',')
    // 冠军不需要调用
    if (MenuData.is_export()) return
    // 竞足409 不需要euid
    const params = {
      mids: mids.length > 0 ? mids : match_mids,
      cuid: UserCtr.get_uid(),
      sort: PageSourceData.sort_type,
      euid: MenuData.is_jinzu() ? "" : MenuData.get_euid(lodash.get(MenuData, 'current_lv_2_menu_i')),
      device: ['', 'v2_h5', 'v2_h5_st'][UserCtr.standard_edition],
    };
    let res = ''
    // 赛果
    if (MenuData.is_export()) {
      res = await api_common.get_esports_match_by_mids(params)
    } else {
      res = await api_common.get_match_base_info_by_mids(params)
    }
    if (!res) return
    const { code, data } = res
    if (+code !== 200) return
    const list = MatchPage.get_obj(data)
    // 设置仓库渲染数据
    this.handle_update_match_info(list, 'cover')
  }

  /**
   * @description 提交元数据更新仓库
   * @param { list } 赛事数据
   */
  on_submit_matchs (type, list) {
    // 不获取赔率
    if (type === 2) return this.handle_update_match_info(list)

    // 获取赔率
    if (type === 1) return this.handle_submit_warehouse(list)
  }


  /**
   * @description ws 指令处理
   * @param {*} cmd 
   */
  handle_ws_directive (cmd) {
    // 调用 matchs  接口
    if (['C901', 'C801', 'C302', 'C109', 'C104'].includes(cmd)) {
      this.get_target_match_data()
    }
    // 调用 mids  接口
    if (['C303', 'C114'].includes(cmd)) {
      this.get_match_base_hps_by_mids()
    }
  }


  /**
   * @description 更新对应赛事
   * @param { list } 赛事数据 
   * @param { type } 接口请求时， 以接口数据为准， 反之已上一次的数据为准 避免赔率闪动
   */
  handle_update_match_info(list, type) {
    const Base_warehouse  = this.get_base_warehouse()
    console.log('Base_warehouse', Base_warehouse)
    // 合并前后两次赛事数据
    list = lodash.map(list, t => {
      MatchResponsive.get_ball_seed_methods(t)
      const match = MatchDataBaseH5.get_quick_mid_obj(t.mid)
      const target = type === 'cover' ? Object.assign({}, match, t) : Object.assign({}, t, match)
      return target
    })
    // 设置仓库渲染数据
    MatchDataBaseH5.set_list(list)
  }

  /**
   * @description 提交更新仓库
   * @param { list } 赛事数据
   */
  handle_submit_warehouse(list) {
    const Base_warehouse  = this.get_base_warehouse()
    // MatchDataBaseH5.clear()
    // 设置仓库渲染数据
    MatchDataBaseH5.set_list(list)
    // 获取赛事赔率
    this.get_match_base_hps_by_mids()
  }
  /**
   * @description 获取仓库
   * @param { type } 仓库类型， 取值为赛事  warehouse_type
   */
  get_base_warehouse (type = '') {
    console.log('this.warehouse_type:', this.warehouse_type)
    const source = type ? type : this.warehouse_type
    const config = {
      // 五大联赛仓库
      'five_league': MatchDataBaseFiveLeagueH5
    }
    return source ? config[source] : MatchDataBaseH5
  }
}

export default new MatchMeta()