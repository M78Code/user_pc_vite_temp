
import lodash from 'lodash'
import store from "src/store-redux/index.js";
import axios_debounce_cache from "src/core/http/debounce-module/axios-debounce-cache"
import { get_esports_match_by_mids, get_match_base_info_by_mids } from "src/api/module/common/index.js";
import PageSourceData from "src/core/page-source/page-source.js";
import { ws_c8_obj_format } from 'src/core/data-warehouse/util/index.js'
import MatchListCardClass from '../match-card/match-list-card-class'
import MatchListParams from '../composables/match-list-params'
import UserCtr from "src/core/user-config/user-ctr.js";
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from 'src/output/module/match-data-base.js'
import {   i18n_t,  useMittEmit, MITT_TYPES } from 'src/output/module/constant-utils.js'
import {  MenuData } from 'src/output/project/index.js'
import { nextTick } from "vue";
import MatchMeta from './match-meta'
import { get_now_server } from 'src/core/utils/common/module/other.js'
import axios_api_loop from "src/core/http/axios-loop.js"
// import { get_handicap_index_by } from 'src/core/match-list-pc/match-handle-data.js'
// import MatchDataBase from "src/core/data-warehouse/match-ctr/match-ctr.js"
class MatchPage {
  //当前调用的赛事列表接口方法
  current_invoke_api_func = null
  //上次调详情的时间点
  prev_invoke_match_details_time = 0
  // 接口出错时，uid的 字符串
  last_uuid = ''
  // 延时器
  sub_list_timeout = null
  // 筛选使用到的定时器
  filter_timer = null
  //mids接口更新数据时钟
  update_match_by_mids_timer = 0

  constructor() {
    this.clear_mixin_timer()
  }

  /**
   * 添加赛事对象前端使用字段 : 让球方
   * @param {Array} match_list
   * @return {Array}  filtered
   */
  match_list_init(match_list) {
    let filtered = [];
    // 当前选中的主菜单 类型，没有则是0
    let main_meu_type = lodash.get(this.get_current_menu, 'main') || 0;
    //附加前端逻辑字段
    match_list.forEach(match => {
      if (main_meu_type != 28) { // 28 赛果
        //ms = 1 为 已开赛 否则未完赛 ms: 3	结束
        if (match.ms == 3) {
          return;
        }
        // 当前选中的日期（串关与早盘）
        let third_menu_type = lodash.get(this.get_current_menu, 'date_menu.menuType');
        if (main_meu_type != 100 && third_menu_type != 100) {
          if (match && match.hps && match.hps.length < 3) {
            // 如果盘口投注项小于3个，则push 进hps
            for (let i1 = match.hps.length; i1 < 3; i1++) {
              match.hps.push({
                hl: [{}]
              });
            }
          }
        }
        if (!match.hps) {
          match.hps = [];
        }
      }
      let assign_obj = { handicap_index: 0 }
      // 如果当前赛事没有mid，有 matchId，则赋值给mid
      if (!match.mid && match.matchId) { match.mid = match.matchId }
      // 获取赛事的让球方 0未找到让球方 1主队为让球方 2客队为让球方
      // assign_obj.handicap_index = get_handicap_index_by(match);
      // 对象浅拷贝
      Object.assign(match, assign_obj);
      // filtered 是 整个方法 return 的变量
      filtered.push(match);
    });
    return filtered;
  }
  /**
   * 投注框获取到最新赔率同步到列表页
   */
  bet_odd_synchronize_handle(data_dict) {
    Object.keys(data_dict).forEach(mid => {
      let syn_match = data_dict[mid];
      if (syn_match.hls && syn_match.hls.length) {
        syn_match.hls.forEach(hl => {
          MatchDataBaseH5.setMatchHsStatus(hl.hid, (hl.hs ? hl.hs : 0), hl.ol);
        });
      }
      MatchDataBaseH5.set_match_odd_list(syn_match);
    });
  }
  /**
   * @description: 移除赛事列表中的赛事数据对象
   * @param {Function} callback 回调函数
   * @return {Undefined} Undefined
   */
  removeMatch(callback) {
    if (callback)
      callback();
    if (!MatchMeta.match_mids.length) {
      this.match_is_empty = true;
    }
  }
  /**
   * @description: 开赛倒计时到达时的回调函数
   * @param {Number} match_id 赛事id
   * @return {Undefined} Undefined
   */
  counting_down_start_ended_on(match_id) {
    this.match_status_changed({ mid: match_id, mmp: 1 });
  }
  /**
   * @description: 删空赛事列表
   * @param {Undefined} Undefined
   * @return {Undefined} Undefined
   */
  del() {
    // MatchDataBaseH5.clear_quick_query_obj()
  }
  /**
   * @description: 页脚菜单事件
   * @param {Object} obj 选中的页脚项目对象
   * @return {Undefined} Undefined
   */
  footer_event(obj) {
    // 每日活动
    if (obj && obj.text == "activities") {
      console.log('每日活动')
    }
    // 排序
    if (obj && obj.text == "sortRules") {
      //TODO DOM滚动到顶部的方法不应该在这里
      // this.scroll_list_wrapper_by(0) 
      // 收藏
      // if(MenuData.is_collect()){
      //   // 电竞收藏
      //   if (MenuData.is_esports()) {
      //     MatchMeta.get_esports_collect_match()
      //   } else {
      //     MatchMeta.get_collect_match()
      //   }
      //   return 
      // }
      //此方法是获取列联表的数据  收藏的不是走此接口所以不能调用这个
      //不然就要把上面的注释解开  
      //排序 其实就是刷新 接口会增加获取数据
      // this.get_match_data_list(); 
      this.footer_refresh_match_list();
      useMittEmit(MITT_TYPES.EMIT_RE_STATISTICS_MATCH_COUNT);
    }
    // 筛选
    else if (obj && obj.text == "filter") {
      //TODO DOM滚动到顶部的方法不应该在这里
      // this.scroll_list_wrapper_by(0)
      this.get_match_data_list(() => {
        clearTimeout(this.filter_timer)
        this.filter_timer = setTimeout(() => {
          if (this.subscription) this.subscription();
          clearTimeout(this.filter_timer)
          this.filter_timer = null
        }, 2000);
      });
    }
    // 页脚刷新事件
    else if (obj && obj.text == "footer-refresh") {
      if (MenuData.is_results()) {
        // 赛果时
        this.get_match_data_list();
      } else {
        this.footer_refresh_match_list();
      }
      if (PageSourceData.route_name !== 'match_result') {
        useMittEmit(MITT_TYPES.EMIT_RE_STATISTICS_MATCH_COUNT);
      }
    }
    // 单纯刷新一个mid,例如十五分钟  或者  5分钟  临界点只刷新对应mid
    else if (obj && obj.text == "mid-refresh") {
      this.get_match_info_upd([obj.mid], false, lodash.get(obj, 'other'));
    }

    else if (obj && obj.text == "footer-follow") {
      //即将改为收藏模式清除赛事列表数据
      if (!obj.before_status) {
        MatchDataBaseH5.clear();
        this.is_data_requesting = true;
      }
    }
  }
  /**
   * @description: 删除收藏赛事列表的赛事
   * @param {String} k 收藏类型赛事('mf')与联赛('tf')
   * @param {Number} index 赛事下标
   * @return {Undefined} Undefined
   */
  del_collect(k, index) {
    const mid = MatchMeta.match_mids[index]
    if (k == "tf") {
      // 冠军收藏时,mid是唯一的,tn不一定有值
      // get_current_menu.date_menu.menuType == 100 电竞冠军
      if (lodash.get(this.get_current_menu, 'date_menu.menuType') == 100) {
        MatchDataBaseH5.remove_match(mid);
      } else {
        const match = MatchDataBaseH5.get_quick_mid_obj(mid)
        let tid = match.tid;
        MatchMeta.match_mids.forEach(item => {
          const match_item = MatchDataBaseH5.get_quick_mid_obj(item)
          if (match_item.tid == tid) {
            MatchDataBaseH5.remove_match(item);
          }
        });
      }
    } else {
      MatchDataBaseH5.remove_match(mid);
    }
    if (MatchMeta.match_mids.length == 0) {
      this.match_is_empty = true;
    }
    //列表页移除赛事
    this.run_process_when_need_recompute_container_list && this.run_process_when_need_recompute_container_list(true);

  }
  /**
   * @description: 订阅赛事推送,列表滚动调用
   * @param {Undefined} Undefined
   * @return {Undefined} Undefined
   */
  subscription() {
    //赛果
    if (MenuData.is_results() && !["detail_match_list"].includes(this.invok_source)
      || ['category'].includes(PageSourceData.route_name)) {
      return;
    }
    clearTimeout(this.sub_list_timeout);
    this.sub_list_timeout = setTimeout(() => {
      if (!MatchDataBaseH5) { return; }
      let now = new Date().getTime();
      // 当前时间，减去 上一次的 时间，小于1s，则return 掉，否则，调用订阅赛事推送
      // if (now - this.prev_invoke_match_details_time < 1000) {
      //   return;
      // }
      this.prev_invoke_match_details_time = now;
      let sliced = MatchMeta.match_mids;
      //数组转对象
      this.matchIds = ws_c8_obj_format(sliced);
      //列表除了电竞外，调用详情数据
      if (this.get_menu_type != 3000) {
        this.get_match_info_upd(sliced.map(mid => mid), 'is-subscribe');
      }
      clearTimeout(this.sub_list_timeout);
      this.sub_list_timeout = null
    }, 100);
  }
  // 菜单变化，调用列表接口
  main_menu_change() {
    // 切换菜单，先清除所有数据仓库的数据
    MatchDataBaseH5.init()
    // 回到页面顶部
    if (this.scroll_list_wrapper_by) {
      this.scroll_list_wrapper_by(0);
    }
    // 去除上一次的筛选记录
    // this.set_filter_list("");
    // 调用列表接口，渲染列表页面
    this.get_match_data_list();
  }
  /**
   * @description: 更新指定mid的赛事数据
   * @param {Array} match_list 指定mid的赛事接口返回后的赛事数组
   * @return {Undefined}
   */
  update_match_databy_mid(match_list) {
    if (match_list && match_list.length) {
      // 添加赛事对象前端使用字段 : 让球方
      let list = this.match_list_init(match_list);
      list.forEach(item => {
        if (item && item.mid) {
          const match = MatchDataBaseH5.get_quick_mid_obj(item.mid)
          if (match) {
            MatchDataBaseH5.upd_match(item);
          } else {
            MatchDataBaseH5.addMatchInfo(item);
          }
          //应对主副盘变更时，投注框盘口和赔率的变化
          // if(this.get_bet_status == 1 || this.get_bet_status == 7 || this.get_bet_status == 5){
          //   this.update_ol(MatchCtr.hn_obj);
          // }
          // 如果是滚球
          if (lodash.get(this.get_current_menu, 'main') == 1) {
            if (![1, 2, 7, 10, 110].includes(+item.ms)) { // 赛事状态无效，清除该场赛事的 对象
              MatchDataBaseH5.remove_match(item.mid);
            }
          }
          //赛事状态无效  并且不是  赛果和冠军时，清除该场赛事的 对象
          if (!this.is_valid(+item.ms) && ![28, 100].includes(+MenuData.menu_type)) {
            MatchDataBaseH5.remove_match(item.mid);
          }
        }
      });
    }
  }
  /**
   * @description: 0未开始  1滚球阶段  2暂停   3结束   4关闭     5取消
   *               6比赛放弃  7延迟    8未知   9延期  10比赛中断 110即将开赛
   * @param {Number} ms 赛事状态
   * @return {Boolean}
   */
  is_valid(ms) {
    return [0, 1, 2, 7, 10, 110].includes(+ms); //有效状态包括未开赛与进行中
  }
  get_match_info_upd(mid, is_subscribe, other) {
    if (Array.isArray(mid) && mid.length == 0) {
      return
    }
    this.get_match_info_upd_when_other(mid, is_subscribe, other)
  }
  /**
   * @description: 获取赛事详情并更新数据(C304,C303)
   * @param {Array|String} mid 赛事id
   * @param {object} other 其他参数
   * @return {Undefined} Undefined
   */
  get_match_info_upd_when_other(mid, is_subscribe, other) {
    if (!mid || !MatchDataBaseH5) return;

    // menu_type 100 冠军下 不再刷新接口
    if ([100, 4, 900].includes(+MenuData.menu_type) || (['category', 'virtual_sports'].includes(PageSourceData.route_name)) && is_subscribe != "is-subscribe") return;

    // 非赛事列表中的赛事不更新
    if (Array.isArray(mid)) {
      let flag = false;
      mid.forEach(mid => {
        if (MatchDataBaseH5.get_quick_mid_obj(mid)) flag = true;
      });
      if (!flag && is_subscribe != "is-subscribe") return;
    }
    //竞足409 不需要euid
    let params = {
      mids: Array.isArray(mid) ? mid.join(',') : mid,
      cuid: UserCtr.get_uid(),
      euid:  MenuData.get_euid() == '409' ? "" : MenuData.get_euid(),
      device: UserCtr.standard_edition == 2 ? 'v2_h5_st' : 'v2_h5',
      //排序	 int 类型 1 按热门排序 2 按时间排序
      sort: UserCtr.sort_type
    };
    if (this.invok_source == 'detail_match_list') {
      // 赛果菜单下赛事详情-精选赛事时逻辑处理
      delete params.euid;
      params.versionNewStatus = 'matcheHandpick';
    }
    if (!params.mids) return;
    let api_axios_flg = 'get_match_base_info_by_mids'
    let api_func = get_match_base_info_by_mids;
    // if (MenuData.menu_type == 3000) {
      //判断电竞
    if (MenuData.is_esports()) {
      api_func = get_esports_match_by_mids;
      api_axios_flg = 'get_esports_match_by_mids';
      if (lodash.get(this.get_current_menu, 'date_menu.menuType') == 100) {
        params.category = 2;
      }
      else {
        params.category = 1;
      }
    }

    //如果在其他情况下携带了参数 取其他情况下的参数
    if (lodash.get(other, 'params')) {
      params = other.params;
    }
    params.inner_param = 'is_by_mids'
    // this.send_gcuuid = uid();
    // params.gcuuid = this.send_gcuuid;
    //调用接口
    let fun_temp = () => {
      api_func(params).then(res => {
        // if(this.send_gcuuid != res.gcuuid) return;
        let mid_first = Array.isArray(mid) ? mid[0] : mid;
        const match_obj = MatchDataBaseH5.get_quick_mid_obj(mid_first)
        // if (MatchDataBaseH5 && match_obj && match_obj.handle_time && match_obj.handle_time > res.ts) {
        //   return;
        // }
        if (!match_obj) return
        // 拉取赛事详情数据导致的赛事比分变化不触发红升绿降
        clearTimeout(this.update_match_by_mids_timer);
        store.dispatch({ type: 'matchReducer/set_foot_ball_screen_changing', payload: 1 });
        this.update_match_by_mids_timer = setTimeout(() => {
          store.dispatch({ type: 'matchReducer/set_foot_ball_screen_changing', payload: 0 });
          clearTimeout(this.update_match_by_mids_timer);
          this.update_match_by_mids_timer = null
        }, 2000);
        // 1. 更新指定mid 盘口数据
        // this.update_match_databy_mid(res.data);
        // 2.列表页 数据源赋值操作,为了排序
        const source_list = this.get_obj(res.data)
        MatchMeta.handle_update_match_info(source_list)

        if (res.data && res.data.length) {
          // 列表页盘口数据 获取后重新计算是否显示次要玩法
          this.run_process_when_need_recompute_container_list && this.run_process_when_need_recompute_container_list(true);
          //  赛事状态变化
          this.match_status_changed(res.data[0]);
          if (match_obj) {
            match_obj.handle_time = res.ts;
          }
        }
        if (lodash.get(other, 'cb')) {
          other.cb(res.data); //如果在其他情况下携带了回调 调用回调
        }
      }).catch(err => {
        console.log('error', err)
      })
    }
    if (axios_debounce_cache && axios_debounce_cache[api_axios_flg] && axios_debounce_cache[api_axios_flg]['ENABLED']) {
      let instance = axios_debounce_cache[api_axios_flg]
      let info = instance.can_send_request(params);
      if (info.can_send) {
        fun_temp();
        //直接发请求    单次数 请求的方法
      } else {
        // 记录timer
        if (this.timexasxsxsx) { clearTimeout(this.timexasxsxsx) }
        this.timexasxsxsx = setTimeout(() => {
          fun_temp();
          //直接发请求    单次数 请求的方法
          this.timexasxsxsx = null
        }, info.delay_time || 1000);
      }
    } else {
      //直接发请求    多 次数  循环请求 的方法
      fun_temp();
    }
  }
  /**
   * 赛事进行中
   * 0未开始 1滚球阶段 2暂停 7延迟 10比赛中断 110即将开赛
   * 3结束 4关闭 5取消 6比赛放弃 8未知 9延期
   * @param {Object} ms 赛事状态
   * @return {Undefined} Undefined
   */
  is_match_playing(ms) {
    return [1, 2, 7, 10, 110].includes(ms * 1);
  }
  /**
   * @description: 获取数据 赛事列表数据
   * @param {Object} params 获取赛事列表参数
   * @param {Function} cb 请求回调
   * @return {Undefined} Undefined
   */
  get_match_data_list(cb) {


    // console.error('get_match_data_list')
    // 接口请求前置处理，接口参数处理
    const params = MatchListParams.get_match_list_params_all();
    // 赛事接口调用前置条件处理  1.次要玩法折叠   2 重置到联赛折叠状态； 3. 骨架屏 显示
    MatchListCardClass.match_list_api_prev_handle();
    // 调用列表接口   如  "/v1/m/matchesPB"
    let api_handle_result = MatchListParams.get_matchs_api_func(params);
    // 新参数直接在此处进行生成新的params
    this.current_invoke_api_func = api_handle_result.api_handle;
    if (this.current_invoke_api_func) {
      //接口调用
      let obj_ = {
        // axios api对象
        axios_api: this.current_invoke_api_func,
        // axios api对象参数
        params: params,
        // 唯一key值
        key: 'list',
        error_codes: ['0401038'],
        // axios中then回调方法
        fun_then: res => {
          // 如果当前请求的 gcuuid 和 返回的 gcuuid 不是 一样的，说明不是 当前接口发起的请求
          if (this.last_uuid != res.gcuuid) {
            // this.match_is_empty = true;
            // if(MatchCtr && MatchCtr.setList){
            //   MatchCtr.setList([])
            // }
            MatchListCardClass.is_close_load()
            MatchListCardClass.set_match_list_page_data(res, cb);
            return
          }
          if (lodash.get(res, 'code') == '0401038') {
            const msg_nodata_22 = i18n_t('msg.msg_nodata_22')
            this.$toast(msg_nodata_22, 1500)
          }
          // 一.接口返回后页面逻辑与数据处理
          //  1. ol 盘口赔率同级别增加赛事类 csid   2 在首页模块的 热门模块下 添加 时间标题   3. 赛果对数据进行特殊处理(marketId=>matchId字段,matchId  => mid)
          let match_res_data = MatchListCardClass.match_list_api_after_handle(res);

          // 二.设置页面显示的数据   （增加字段，改了排序，改变 接口原数据），最核心的方法
          // 1.设置赛事对象字典对象 MatchCtr.setListObj(match_res_data)
          // 2.开赛 和 未开赛  和其他赛事(电竞,冠军) 时间 排序
          // 3.列表页set_list 数据源赋值操作 MatchCtr.set_list(data_source)
          // 4. 更新 赛事列表 进程 综合 控制方法（虚拟滚性能核心方法）  => a.数据数组去重   b. 计算每个容器的高度   c.列表页可视区域数据this.matchCtr.setList('可视区域数据') d. 发布订阅
          MatchListCardClass.set_match_list_page_data(match_res_data, cb);

          // 三.页面数据设置后   处理
          // 1. 去除所有骨架屏
          // 2. 由详情页返回列表时，保持上次列表页滚动到的 mid 赛事位置
          // MatchListCardClass.after_set_match_list_data(params, match_res_data);
        },
        // axios中catch回调方法
        fun_catch: e => {
          if (this.show_favorite_list) {
            if (this.invok_source == 'home_hot_page_schedule') {
              // home页面热门菜单时的逻辑操作,异常时强显示nodata页面
              this.match_is_empty = true;
            } else if (this.show_favorite_list) {
              // 收藏功能接口异常时强显示nodata页面
              this.match_is_empty = true;
            }
          }
          MatchListCardClass.match_list_api_catch_handle(e, cb);
        },
        // 最大循环调用次数(异常时会循环调用),默认3次
        max_loop: 2,
        // 异常调用时延时时间,毫秒数,默认1000
        timers: 1100
      }
      // 短距离滚动标识
      store.dispatch({ type: 'matchReducer/set_allow_short_scroll', payload: false });
      let api_axios_flg = api_handle_result.api_axios_flg;
      if (axios_debounce_cache && axios_debounce_cache[api_axios_flg] && axios_debounce_cache[api_axios_flg]['ENABLED']) {
        let instance = axios_debounce_cache[api_axios_flg]
        let info = instance.can_send_request(params);
        if (info.can_send) {
          //直接发请求    单次数 请求的方法
          obj_.max_loop = 1;
          obj_.timers = 0;
          axios_api_loop(obj_);
        } else {
          // 记录timer
          if (this.timexasxsxsx) { clearTimeout(this.timexasxsxsx) }
          this.timexasxsxsx = setTimeout(() => {
            //直接发请求    单次数 请求的方法
            obj_.max_loop = 1;
            obj_.timers = 0;
            axios_api_loop(obj_);
            this.timexasxsxsx = null
          }, 100);
          // info.delay_time ||
        }
      } else {
        //直接发请求    多 次数  循环请求 的方法
        // axios_api轮询调用方法
        axios_api_loop(obj_);
      }
    }
  }
  /**
   * 页脚刷新按钮
   * @param {Object} params 接口参数
   */
  footer_refresh_match_list() {
    const params = MatchListParams.get_match_list_params_all();
    let api_handle_result = MatchListParams.get_matchs_api_func(params);
    this.current_invoke_api_func = api_handle_result.api_handle;
    delete params.hpsFlag;
    //接口调用
    let fun_temp = () => {
      if (this.current_invoke_api_func) {
        this.current_invoke_api_func(params).then(res => {
          if (!res || res.code != 200 || !res.data || !res.data.length) {
            return;
          }
          //接口返回后页面逻辑与数据处理
          let match_res_data = MatchListCardClass.match_list_api_after_handle(res);
          // 添加赛事对象前端使用字段 : 让球方
          this.match_list_init(match_res_data);
          // MatchDataBaseH5.update_match_list(match_res_data);
          if (this.run_process_when_need_recompute_container_list_when_scroll) {
            this.run_process_when_need_recompute_container_list_when_scroll(false, { force: 1 });
          }
        });
      }
    }
    let api_axios_flg = api_handle_result.api_axios_flg;
    if (axios_debounce_cache && axios_debounce_cache[api_axios_flg] && axios_debounce_cache[api_axios_flg]['ENABLED']) {
      let instance = axios_debounce_cache[api_axios_flg]
      let info = instance.can_send_request(params);
      if (info.can_send) {
        //直接发请求    单次数 请求的方法
        fun_temp();
      } else {
        // 记录timer
        if (this.timexasxsxsx) {
          clearTimeout(this.timexasxsxsx)
        }
        this.timexasxsxsx = setTimeout(() => {
          //直接发请求    单次数 请求的方法
          fun_temp();
          this.timexasxsxsx = null
        }, info.delay_time || 1000);
      }
    } else {
      //直接发请求    多 次数  循环请求 的方法
      fun_temp();
    }
  }
  //  热门首页模块对比时间 过滤放在放在第一个item 上
  filter_event_title(arr) {
    for (let i = 0; i < arr.length; i++) {
      // 如果数组只有一个的话
      if (arr.length == 1) {
        return arr[i].time_title = (new Date(+arr[i].mgt)).Format(i18n_t('time2'))
      }
      // 如果数组大于一个以上
      for (let j = 1; j < arr.length; j++) {
        // 如果下标是第1个之后才执行下边
        if (i > 0) {
          // 如果第一个和后边的其中一个相等，并且 第一个和上一个相比，不一样，time_title 塞进当前元素
          if ((new Date(+arr[i].mgt)).Format(i18n_t('time2')) == (new Date(+arr[j].mgt)).Format(i18n_t('time2')) && ((new Date(+arr[i].mgt)).Format(i18n_t('time2')) !== new Date(+arr[i - 1].mgt).Format(i18n_t('time2')))) {
            arr[i].time_title = (new Date(+arr[i].mgt)).Format(i18n_t('time2'))
          }
        } else { // 代表第0个元素
          arr[i].time_title = (new Date(+arr[i].mgt)).Format(i18n_t('time2'))
        }
      }
    }
  }
  // 今日 和 早盘 和 串关  保留上次筛选的列表内容
  // keep_filter(res_match_data) {
  //   // 保留上次筛选的东西 并且 上一次记录在 今日 或者 早盘 或者 串关的 下标,
  //   // 互相切换才有上次筛选保留的效果
  //   // get_prev_menu_type 是为了保存上次的菜单
  //   if([3,4,11].includes(+lodash.get(this.get_current_menu, 'main')) &&
  //     [3,4,11].includes(+this.get_prev_menu_type) && this.is_in_filtering()){
  //     let filter_data = []
  //     let data = {};
  //     res_match_data.forEach((item_1)=>{
  //       for (let f_tid in this.get_filter_list) {
  //         if (item_1.tid == f_tid) {
  //           filter_data.push(item_1)
  //           if(lodash.get(this.get_current_menu, 'main') != this.get_prev_menu_type){
  //             data[f_tid] = true
  //           }
  //         }
  //       }
  //     })
  //     if(lodash.get(this.get_current_menu, 'main') != this.get_prev_menu_type){
  //       this.set_filter_list(data);
  //     }
  //     // 如果有数据，则过滤出来
  //     if(filter_data.length>0) {
  //       return filter_data
  //     }else{ //  如果没有数据，则去除筛选的数据，并且当前选中的 主菜单type 赋值 上次选中的 主菜单type
  //       // 此处存在一种情况，就是当前筛选项没有数据 滞空了筛选项，后续数据又来了，比如ws推送 有时没有数据了 就清掉了
  //       this.set_filter_list("");
  //       this.set_prev_menu_type(+lodash.get(this.get_current_menu, 'main'));
  //       return false
  //     }
  //   }
  // }
  /**
   * @description: 获取数据 更新列表
   * @param {Function} callback 请求回调函数
   * @param {String} call_source 调用来源('sort-rules'排序，'ws pushed')
   * @return {Undefined} Undefined
   */
  get_match_list_req(callback, call_source, mid) {
    // 如果没有mid  或者是 虚拟体育  或者 (不在 首页 或者 不在列表页)
    if (!mid || MenuData.menu_type == 900 || (!['home', 'matchList'].includes(PageSourceData.route_name))) {
      return;
    }
    let params = MatchListParams.get_match_list_params_all();
    // params = lodash.cloneDeep(params);
    let api_handle_result = MatchListParams.get_matchs_api_func(params);

    this.current_invoke_api_func = api_handle_result.api_handle;
    //
    let fun_temp = () => {
      if (this.current_invoke_api_func) {
        this.current_invoke_api_func(params).then(res => {
          let data_page = lodash.get(res, 'data.data');
          if (!data_page) {
            data_page = lodash.get(res, 'data');
          }
          if (lodash.get(data_page, 'length', 0)) {
            // ws 推送过来拉取全量数据时
            // 前端进行  开赛 和 未开赛  和 其他赛事(电竞,冠军)   赛事阶段 排序
            data_page = this.get_obj(data_page);
            this.match_is_empty = false;
            let temp_ = MatchDataBaseH5.list_comparison(data_page, MatchMeta.match_mids)
            this.update_match_to_list(temp_);
            if (callback) callback();
          }
          else {
            // this.match_is_empty = true;
          }
        })
          .catch((e) => {
            console.error(e);
            this.is_data_requesting = false;
          });
      }
    }
    let api_axios_flg = api_handle_result.api_axios_flg;
    if (axios_debounce_cache && axios_debounce_cache[api_axios_flg] && axios_debounce_cache[api_axios_flg]['ENABLED']) {
      let instance = axios_debounce_cache[api_axios_flg]
      let info = instance.can_send_request(params);
      if (info.can_send) {
        //直接发请求    单次数 请求的方法
        fun_temp();
      } else {
        // 记录timer
        if (this.timexasxsxsx) { clearTimeout(this.timexasxsxsx) }
        this.timexasxsxsx = setTimeout(() => {
          //直接发请求    单次数 请求的方法
          fun_temp();
          this.timexasxsxsx = null
        }, info.delay_time || 1000);
      }
    } else {
      //直接发请求    多 次数  循环请求 的方法
      fun_temp();
    }
  }

  /**
   * @description: 比分编号列表从小到达排序
   * @param {Object} msc 赛事比分数据
   * @return {Undefined} Undefined
   */
  msc_sort(msc) {
    if (!msc || !msc.sort) {
      return;
    }
    msc.sort((a, b) => {
      let r = 0;
      try {
        let numb_a = a.split("|")[0].split("S")[1] * 1;
        let numb_b = b.split("|")[0].split("S")[1] * 1;
        r = numb_a - numb_b;
      } catch (e) { console.error(e); }
      return r;
    });
  }
  /**
   * @description: 开赛 和 未开赛  和 其他赛事  (100（冠军）  3000（电竞）)  的   时间 排序
   * @param {Object} match_source_data_ 赛事源数据列表
   * @return {Object} 排序后的 数据
   */
  get_obj(match_source_data_) {
    if (match_source_data_ && match_source_data_.length) {
      let started = [], no_started = [], other_status_match = [];
      match_source_data_.forEach((item, i) => {
        item.key = item.mid;
        // 赛事比分排序
        this.msc_sort(item.msc);
        // 如果是电竞
        if (MenuData.is_esports()) {
          other_status_match.push(item);
        } else if (MenuData.is_results()) { // 如果是赛果
          started.push(item);
        } else {  // 如果是正常的体育赛事
          if (item.ms == 1 || item.ms == 110) {
            started.push(item);
          } else if (item.ms == 0) {
            no_started.push(item);
          } else {
            other_status_match.push(item);
          }
        }
      });
      // 如果是今日，则在今日下边，每次ws 更新，从新排序
      if ([1, 3].includes(+MenuData.menu_type)) {
        // 获取当前二级赛种子菜单列表 
        // const sub_menu_list = lodash.cloneDeep(this.get_sub_menu_list)
        const sub_menu_list = lodash.cloneDeep(MenuData.current_lv_2_menu)
        
        // 滚球下对同一赛种csid归类，避免ws更新时，赛种csid间隔重复
        if (MenuData.is_scroll_ball()&& MenuData.get_sub_is_all()) {
          started = this.csid_same_sort(started, sub_menu_list)
        }

        started = this.tid_same_sort(started)
        no_started = this.tid_same_sort(no_started)
      }

      if (this.invok_source == 'detail_match_list') {
        return match_source_data_;
      }
      if (this.invok_source == 'home_hot_page_schedule') {
        // home页面热门菜单时的逻辑操作
        match_source_data_ = started.concat(no_started);
      } else if (MenuData.is_scroll_ball()) { // 滚球(menuType=1)只显示进行中的比赛
        match_source_data_ = started;
      } else {
        match_source_data_ = started.concat(no_started);
      }
      if ([100, 3000].includes(+MenuData.menu_type)) {// 100（冠军）  3000（电竞）
        match_source_data_ = other_status_match;
      }
      if (MenuData.is_results()) { // 如果是 赛果
        match_source_data_ = started.concat(no_started).concat(other_status_match);
      }


    }
    return match_source_data_;
  }
  // 如果csid 一样，则聚在一起排序，以此类推
  csid_same_sort(data_list, ball_list) {
    if (!ball_list.length) {
      return data_list
    }

    let new_arr = []

    for (let i = 0, len = ball_list.length; i < len; i++) {
      let cur_csid_arr = data_list.filter(item => item.csid == ball_list[i].field1)
      if (cur_csid_arr) {
        new_arr.push(...cur_csid_arr)
      }
    }
    return new_arr
  }
  // 如果tid 一样，则聚在一起排序，以此类推
  tid_same_sort(data_list) {
    let arr_tid = [],
      new_arr = []

    for (let item of data_list) {
      if (arr_tid.indexOf(item['tid']) == -1) {
        arr_tid.push(item['tid'])
      }
    }

    for (let i = 0, len = arr_tid.length; i < len; i++) {
      let cur_tid_arr = data_list.filter(item => item.tid == arr_tid[i])
      if (cur_tid_arr) {
        new_arr.push(...cur_tid_arr)
      }
    }

    return new_arr
  }
  /**
   * @description: 赛事状态变化
   * @param {Object} state_changed ws推送的赛事变化对象
   * @return {Undefined} Undefined
   */
  match_status_changed(state_changed) {
    const _this = this;

    const match_data_list = MatchMeta.match_mids;
    let match_id = state_changed.mid;
    // 删除数据源对应赛事下标的赛事
    let delete_source = function () {
      let deleted_match = 0;
      for (let p = 0, l = match_data_list.length; p < l; p++) {
        let item = match_data_list[p];
        if (match_id == item) {
          deleted_match = 1;
          // 删除数据仓库 一些数据操作
          _this.removeMatch(() => {
            MatchDataBaseH5.remove_match(item);
          });
          p--;
          break;
        }
      }
      if (deleted_match && _this.run_process_when_need_recompute_container_list_when_first_load_list) {
        _this.run_process_when_need_recompute_container_list_when_first_load_list(true);
      }
    };
    // 删除已结束的赛事
    let delete_ended_match = () => {
      delete_source();
      useMittEmit(MITT_TYPES.EMIT_RE_STATISTICS_MATCH_COUNT);
    };
    // csid:12 拳击   开赛时间小于当前时间则移除
    let delete_boxing_match = () => {
      let c_match = MatchDataBaseH5.get_quick_mid_obj(match_id);
      if (c_match && c_match.csid == 12) {
        let server_now = get_now_server();
        let now_sub = Number(c_match.mgt) - server_now;
        if (now_sub <= 0) {
          delete_ended_match();
        }
      }
    };
    // 将 未开赛的 赛事转移至进行中
    let convert_to_playing = () => {
      // 找到指定赛事id的赛事下标
      let found_index = -1;
      for (let jj = 0, l = match_data_list.length; jj < l; jj++) {
        let item = match_data_list[jj];
        if (match_id == item.mid) {
          if (+state_changed.mmp < 1) return;
          // 如果 当前 已经开赛了，则 调出循环
          if (item.ms == 1 || item.ms == 110 || +item.mmp > 0) {
            found_index = -1;
            break;
          }
          if (+item.ms < 1) {
            item.ms = 1
            found_index = jj
            jj--;
          }
          break;
        }
      }
      // 将赛事移动至列表开头
      if (found_index > -1) {
        let changed_match = match_data_list.splice(found_index, 1);
        nextTick(() => {
          match_data_list.splice(0, 0, changed_match[0]);
        })
      }

    };
    //删除已结束的赛事
    if (999 == state_changed.mmp) {
      delete_ended_match();
      return;
    }
    // 查找到 当前赛事id，赛事阶段如果是  0 未开始，则 return 掉
    let found_match = match_data_list.filter(m => m.mid == state_changed.mid)[0];
    if (found_match) {
      if (found_match.mmp == 0 && state_changed.mmp == 0) {
        return;
      }
    }

    // 滚球：删除ms不为1的赛事
    if (MenuData.is_scroll_ball()) {
      if (state_changed.ms != null && typeof state_changed.ms != 'undefined' && ![1, 110].includes(+state_changed.ms)) {
        delete_ended_match();
      }
    }// 今日,早盘
    else if (MenuData.is_zaopan()||MenuData.is_today()) {
      if (state_changed.mmp > 0 || state_changed.ms == 1 || state_changed.ms == 110) {
        if (MenuData.is_zaopan()) { // 早盘: 将已开赛的赛事移除早盘
          delete_ended_match();
        } else {  // ‘今日’  将未开赛的赛事转移至进行中
          convert_to_playing();
        }
      }
      // csid:12 拳击   开赛时间小于当前时间则移除
      delete_boxing_match();
    }
  }
  is_in_filtering() {
    return !lodash.isEmpty(this.get_filter_list);
  }
  // 批量清除定时器
  clear_mixin_timer() {
    const timer_arr = [
      'sub_list_timeout',
      'filter_timer',
      'update_match_by_mids_timer',
    ]

    for (const timer of timer_arr) {
      clearTimeout(this[timer])
      this[timer] = null
    }
  }
}

export default new MatchPage()