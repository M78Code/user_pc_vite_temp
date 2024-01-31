
import lodash from 'lodash'
import { defineComponent } from 'vue'
import { api_common } from "src/api/index.js";
import { useMittEmit, MITT_TYPES, UserCtr, project_name } from  "src/output"

import MatchFold from 'src/core/match-fold/index.js'
import MatchCollect from 'src/core/match-collect/index.js'
import MatchMeta from 'src/core/match-list-h5/match-class/match-meta';
import MatchUtils from 'src/core/match-list-h5/match-class/match-utils';
import MatchResponsive from 'src/core/match-list-h5/match-class/match-responsive';

import MatchListClass from 'src/core/match-list-h5/match-class/match-list.js'
import BaseData from "src/core/base-data/base-data.js";
import PageSourceData from "src/core/page-source/page-source.js";
import { i18n_t,MenuData, MatchDataWarehouse_H5_List_Common as MatchDataBaseH5,MatchDetailCalss } from "src/output/index.js"
import { format_how_many_days, format_week } from "src/core/format/common/index.js"
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
import { lvs_icon_theme01, lvs_icon_theme02, animationUrl_icon_theme01,
  animationUrl_icon_theme02, muUrl_theme01, muUrl_theme01_y0, muUrl_theme02, muUrl_theme02_y0 } from 'src/base-h5/core/utils/local-image.js'

import { lang, standard_edition, theme } from 'src/base-h5/mixin/userctr.js'
import { is_hot, menu_type, is_detail, is_results, menu_lv1 } from 'src/base-h5/mixin/menu.js'
import { get_collect_count } from 'src/core/collect/collect-class.js'

// i: 每个组件的 props 赛事下标， 来源 === 组件
// match_of_list: 每个组件的 props 赛事对象， 来源 === 组件

export default defineComponent({
  data () {
    return {
      timer_super11: null,
      match_change_timer: null,
      is_new_init_timer2: null,
      //  直播 视频  动画  按钮状态 对象
      media_button_state_obj: {},
      // 主队显示分数
      home_score: null,
      // 客队显示分数
      away_score: null,
      // 主队红牌数
      home_red_score: 0,
      // 客队红牌数
      away_red_score: 0,
      // 主队黄牌数
      home_yellow_score: 0,
      away_yellow_score: 0,
      home_red_first_change: true,
      away_red_first_change: true,
      // 是否显示主队进球动画
      is_show_home_goal: false,
      // 是否显示客队进球动画
      is_show_away_goal: false,
      // 是否显示主队红牌动画
      is_show_home_red: false,
      // 是否显示客队红牌动画
      is_show_away_red: false,
      // 当前组件是否第一次创建
      is_first_coming: false,
      //mmp阶段名称
      mmp_map_title: '',
      //赛事切换中
      match_changing: false,
      // 定时器外层容器宽度
      counting_down_up_wrapper_width: 1,
      // 列表页进球动画和红牌动画要等组件初始化3秒后开始监听变化
      is_new_init2: false,
      // 防抖 防止急速状态下点击两次
      is_on_go_detail: false,
      
      get_footer_sub_changing: '',
      get_collapse_map_match: '',
      get_show_favorite_list:'',
      get_img_error_map_mid: '',
      get_goto_detail_matchid: '',
      get_goto_detail_match_info: '',
      get_not_found_target_dom_count: '',
    }
  },
  mounted() {
    this.run_new_init_timer();
  },
  computed: {
    // 当前赛事数据
    match () {
      return this.match_of_list;
    },
    menu_sport(){
      return {
        menu_sport_id: MenuData.menu_mi.value,
        menu_sport_name:BaseData.menus_i18n_map[MenuData.menu_mi.value]
      }
    },
    is_show_all () {
      return MenuData.is_zaopan() || MenuData.is_scroll_ball()
    },
    // 上一场赛事数据
    prev_match () {
      return this.i > 0 ? MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[this.i - 1]) : undefined
    },
    // 下一场赛事数据
    next_match () {
      return MatchMeta.match_mids[this.i + 1] ? MatchDataBaseH5.get_quick_mid_obj(MatchMeta.match_mids[this.i + 1]) : undefined
    },
    // 精彩回放视频开关是否开启
    is_replay_switch () {
      const { config, eventSwitch } = lodash.get(UserCtr, 'merchantEventSwitchVO', {})
      return configValue == 1 && eventSwitch == 1
    },
    //  动画按钮
    animationUrl_icon () {
      let is_theme01 = theme.value?.includes('theme-0')
      let animationUrl_icon = is_theme01 ? animationUrl_icon_theme01 : animationUrl_icon_theme02
      return animationUrl_icon
    },
    //  视频按钮
    muUrl_icon () {
      let is_theme01 = theme.value?.includes('theme-0')
      let is_y0 = theme.value?.includes('y0')
      let muUrl_icon = ''
      if (is_y0) {
        muUrl_icon = is_theme01 ? muUrl_theme01_y0 : muUrl_theme02_y0
      } else {
        muUrl_icon = is_theme01 ? muUrl_theme01 : muUrl_theme02
      }
      return muUrl_icon
    },
    
    // 是否显示视频图标, 点击跳转 去到详情页视频直播
    is_show_video_icon() {
      let r = false;
      let ios_Android = null
      if (3000 == menu_type.value) {
        // PC、安卓优先用varl，如果varl没有值，再用vurl   IOS只用   vurl
        // 判断是否是苹果手机，是则是true
        let ua = navigator.userAgent.toLowerCase();
        let isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
        if (isIos) {
          ios_Android = this.match_of_list.vurl
        } else {
          ios_Android = this.match_of_list.varl || this.match_of_list.vurl
        }
        r = this.match_of_list.mms > 1 && ios_Android && [1, 2, 7, 10, 110].includes(+this.match_of_list.ms)
      } else {
        r = this.match_of_list.mms > 1 && [1, 2, 7, 10, 110].includes(+this.match_of_list.ms);
      }
      return r;
    },
    show_newer_edition () {
      return standard_edition.value == 1
    },
    // 是否显示进球动画
    is_show_goal_event () {
      return this.is_show_home_goal || this.is_show_away_goal
    },
    // 是否是 拳击 或者其他球种
    match_of_list_ascertain ()  {
      if (MenuData.current_menu != 28 && this.match_of_list.csid == 12 && this.match_of_list.hps.length > 1) {
            return this.match_of_list.hps.slice(0, 2)
      } else {
        return this.match_of_list.hps
      }
    },
    // 热门模块 球类tab 下边的赛程列表 的 时间转换 = () => {
    time_change ()  {
      if (this.match_of_list) {
        let time_stamp = +this.match_of_list.mgt
        return (format_how_many_days(time_stamp) ? `${format_how_many_days(time_stamp)}   ` : '') + (new Date(time_stamp)).Format(i18n_t('time2')) + '  ' + format_week(time_stamp)
      }
    },
    /**
     * @deprecated  联赛收藏状态
     */
    league_collect_state () {
      return MatchCollect.get_league_collect_state(this.match_of_list.tid)
    },
    // 赛事收藏状态
    match_collect_state() {
      return MatchCollect.get_match_collect_state(this.match_of_list)
    },
    /**
     * @description 联赛折叠状态
     */
    league_collapsed() {
      if (is_hot.value) return false
      const falg = lodash.get(MatchFold.ball_seed_csid_fold_obj.value, `csid_${this.match_of_list.csid}`, true)
      return falg
    },
    /**
     * @description 赛事显示/隐藏
     */
    collapsed () {
      if (is_hot.value) return false
      const key = MatchFold.get_match_fold_key(this.match_of_list)
      const show_card = lodash.get(MatchFold.match_mid_fold_obj.value, `${key}.show_card`, true)
      return show_card
    },
    eports_scoring() {
      //比分判断处理
      let scoring = false
      //如果是电竞，则进行比分判定处理
      if (menu_type.value == 3000) {
        const { mmp, home_score, away_score } = this.match_of_list
        const mmp_state = mmp || 1
        if (mmp_state != (Number(home_score) + Number(away_score) + 1)) {
          scoring = true
        }
      }
      return scoring
    },
    // 是否显示赛事阶段标题
    is_show_opening_title () {
      const menu_lv_v1 = MenuData.current_lv_1_menu_i
      let result = false
      if (project_name === 'app-h5') {
        // 今日、早盘、串关
        result = ([1,2,3,6].includes(+menu_lv_v1) && (MenuData.is_today() || MenuData.is_mix()) || MenuData.is_esports()) && [1,2].includes(+this.match_of_list.start_flag)
      }
      return result
    },
    // 是否显示缓冲容器
    is_show_buffer_container () {
      const { is_show_league } = this.match_of_list
      let flag = false
      if (project_name === 'app-h5') {
        if (MenuData.is_today() || MenuData.is_mix() || MenuData.is_esports()) {
          flag = !this.is_show_opening_title
        } else {
          flag = !(this.i === 0 && this.is_show_all)
        }
      }
      return is_show_league && flag
    },
    // 获取赛事数量
    get_match_count () {
      const { csid, start_flag } = this.match_of_list
      let key = ''
      if ([1,2].includes(+start_flag)) {
        key = start_flag == 1 ? `progress_csid_${csid}` : `not_csid_${csid}`
      } else {
        key = `default_csid_${csid}`
      }
      return lodash.get(MatchResponsive.ball_seed_count.value, `${key}`, 1)
    },
    is_http_update_info () {
      const result = lodash.get(MatchResponsive, 'is_http_update_info.value', true)
      return result
    },
     // 获取联赛赛事数量
    get_ball_seed_league_count () {
      const { warehouse_type = '' } = this.match_of_list
      const key = MatchResponsive.get_league_count_key(this.match_of_list)
      const default_count = lodash.get(MatchResponsive.ball_seed_league_count.value, key, 1)
      const other_count = lodash.get(MatchResponsive.ball_other_seed_league_count.value, key, 1)
      return warehouse_type ? other_count : default_count
    },
    // 是否有角球
    get_corner_kick () {
      const S5 = lodash.get(this.match_of_list, 'msc_obj.S5', '')
      let is_show = false
      S5 && Object.values(S5).forEach(t => {
        is_show = t && true
      })
      return is_show
    },
    // 全部球种折叠状态
    all_ball_seed_collapsed () {
      return !MatchFold.all_csid_fold_status.value
    },
    // 联赛折叠状态
    ball_seed_collapsed ()  {
      return !lodash.get(MatchFold.ball_seed_csid_fold_obj.value, `csid_${this.match_of_list.csid}`, true)
    },
    // 进行中折叠状态
    progress_seed_collapsed ()  {
      return lodash.every(Object.values(MatchFold.progress_csid_fold_obj.value),Boolean)
    },
    // 未开赛折叠状态
    not_begin_collapsed ()  {
      return lodash.every(Object.values(MatchFold.not_begin_csid_fold_obj.value),Boolean)
    },
    // 是否显示底部圆角
    is_show_border_raduis () {
      return this.next_match && this.match_of_list?.tid !== this.next_match?.tid
    },
    // 复刻版新手版
    is_new_user_border_raduis () {
      const { tid = '', mid = '', source_index = 0 } = this.match_of_list
      const current_matchs = lodash.get(MatchMeta, 'current_matchs', [])
      const next_match = current_matchs[source_index + 1]
      const length = lodash.get(current_matchs, 'length', 0)
      let result = false
      if (tid !== next_match?.tid || source_index === length - 1) result = true
      return result
    },
    // 是否最后一个
    is_last () {
      const complete_matchs = lodash.get(MatchMeta, 'complete_matchs', [])
      const length = lodash.get(complete_matchs, 'length', 0)
      return this.match_of_list.source_index === length - 1
    },
  },
  watch: {
    match_of_list: {
      deep: true,
      handler (c_match) {
        this.media_button_button_type_check()
        this.mmp_map_title = MatchListClass.match_period_map(c_match);
      }
    },
    'match_of_list.msc': {
      immediate: true,
      deep: true,
      handler () {
        this.score_value();
        this.mmp_map_title = MatchListClass.match_period_map(this.match_of_list);
      }
    },
    'match_of_list.mmp': {
      handler () {
        this.mmp_map_title = MatchListClass.match_period_map(this.match_of_list);
      }
    },
    // 监听主队比分变化
    home_score (new_,old_) {
      if (this.is_first_coming) return;
      if (this.match_of_list.csid != 1) return;
      if (this.get_footer_sub_changing) return;
      if (this.match_changing) return;
      if (!this.is_http_update_info && new_ > 0 && new_ != old_ && old_ !== null && [1,3].includes(+menu_type.value) && this.match_of_list.is_ws) {
        this.hide_away_goal()
        this.is_show_home_goal = true
        this.clear_goal()
      }
    },
    // 监听客队比分变化、
    away_score (new_,old_) {
      if (this.is_first_coming) return;
      if (this.match_of_list.csid != 1) return;
      if (this.get_footer_sub_changing) return;
      if (this.match_changing) return;

      if (!this.is_http_update_info && new_ > 0 && new_ != old_ && old_ !== null && [1,3].includes(+menu_type.value) && this.match_of_list.is_ws) {
        this.hide_home_goal()
        this.is_show_away_goal = true
        this.clear_goal()
      }
    },
    // 监听主队红牌比分变化
    home_red_score (new_, old_) {
      if (this.match_of_list.csid != 1) return
      if (this.home_red_first_change) {
        this.home_red_first_change = false;
        return;
      }
      if (new_ > 0 && new_ != old_) {
        this.is_show_home_red = true
        this.hide_home_red()
      }
    },
    // 监听客队红牌比分变化
    away_red_score (new_,old_) {
      if (this.match_of_list?.csid != 1) return
      if (this.away_red_first_change) {
        this.away_red_first_change = false;
        return;
      }
      if (new_ > 0 && new_ != old_) {
        this.is_show_away_red = true
        this.hide_away_red()
      }
    },

    // 监听客队红牌比分变化
    footer_sub_menu_id (curr) {
      // 简版玩法之间切换3秒内阻止赔率变化
      this.is_new_init2 = false;
      clearTimeout(this.is_new_init_timer2)
      this.is_new_init_timer2 = setTimeout(() => {
        this.is_new_init2 = true
      }, 3000)
      if ((MenuData.prev_footer_sub_menu_id != curr && curr == 114) ||
        (MenuData.prev_footer_sub_menu_id != curr && MenuData.prev_footer_sub_menu_id == 114)
      ) {
        this.score_value();
      }
      MenuData.prev_footer_sub_menu_id = curr;
    }
  },
  methods: {
    /**
     * @description: 设置 联赛收藏与否
     */
    async handle_league_collect () {
      const { tid } = this.match_of_list
      const league_collect = MatchCollect.get_league_collect_state(tid)
      api_common.add_or_cancel_tournament({
        tid,
        cf: league_collect ? 0 : 1,
        cuid: UserCtr.get_uid()
      }).then(res => {
        if (+res.code !== 200) return
        get_collect_count()
      })
      //先执行删除收藏 再执行删除收藏页数据
      MatchCollect.handle_league_collect_state(tid)
      // 收藏页手动处理数据
      if (MenuData.is_collect()) {
        !this.league_collect_state && MatchMeta.set_collect_match(this.match_of_list, 1)
      }
    },

    /**
     * @description: 设置 赛事收藏与否
     */
    async handle_match_collect () {
      const { mid,tid } = this.match_of_list
      const match_state = MatchCollect.get_match_collect_state(this.match_of_list)
      api_common.add_or_cancel_match({
        mid,
        cf: match_state ? 0 : 1,
        cuid: UserCtr.get_uid()
      }).then(res => {
        if (+res.code !== 200) return
        get_collect_count()
      })
      // 收藏页手动处理数据
      MenuData.is_collect() && MatchMeta.set_collect_match(this.match_of_list, 2)
      MatchCollect.set_match_collect_state(this.match_of_list, !match_state)
    },

    /**
     * @description 全部联赛折叠
     */
    handle_all_ball_seed_fold () {
      MatchFold.handler_fold_all_matchs_csid()
      // app-h5 简版 先试运行看效果
      if (project_name === 'app-h5') MatchMeta.compute_current_matchs()
      MatchMeta.compute_page_render_list({ scrollTop: 0, type: 2, is_scroll: false })
    },

    /**
     * @description 球种折叠
     */
    handle_ball_seed_fold () {
      const { csid, is_virtual = false, start_flag = '', warehouse_type = '' } = this.match_of_list 
      const is_fold_all = MenuData.is_collect() && project_name === 'app-h5'
      MatchFold.set_ball_seed_match_fold(this.match_of_list, start_flag, is_fold_all)
      // 不需要虚拟计算，欧洲版五大联赛
      if (is_virtual || ['five_league'].includes(warehouse_type)) return
      // app-h5 简版 先试运行看效果
      // if (project_name === 'app-h5' && (standard_edition.value == 1 || MenuData.is_results())) MatchMeta.compute_current_matchs()
      if (project_name === 'app-h5') MatchMeta.compute_current_matchs()
      MatchMeta.compute_page_render_list({ scrollTop: 0, type: 2, is_scroll: false })
      // 赛事个数小于18 不需要继续获取赔率
      if (!is_results.value && MatchMeta.complete_matchs.length > 17) MatchMeta.get_match_base_hps_by_mids({is_again: false})
    },
    /**
     * @description 联赛折叠
     */
    handle_league_fold () {
      const { tid, is_virtual = false, warehouse_type = '', start_flag = '' }  = this.match_of_list
      // 首页热门，详情页，不需要用到折叠
      if (is_hot.value || is_detail.value || MatchResponsive.is_league_detail.value) return;
      MatchFold.set_league_fold(this.match_of_list, start_flag)
      // 不需要虚拟计算，欧洲版五大联赛
      if (is_virtual || ['five_league'].includes(warehouse_type)) return
      // app-h5 简版 先试运行看效果
      if (project_name === 'app-h5') MatchMeta.compute_current_matchs()
      MatchMeta.compute_page_render_list({ scrollTop: 0, type: 2, is_scroll: false})
      // 赛事个数小于18 不需要继续获取赔率
      if (!is_results.value && MatchMeta.complete_matchs.length > 17) MatchMeta.get_match_base_hps_by_mids({is_again: false})
    },
    // 获取仓库赛事数据
    get_match_item (item) {
      return MatchDataBaseH5.get_quick_mid_obj(item.mid)
    },
    /**
     *启动 组件新初始化后 ，判定组件是否是刚刚新初始化的 定时器
    *主要用于 进球动画 显示 的第一层时间段 屏蔽开关
    *调用时机 :是否组件新初始化或者 key 新变更
    */
    run_new_init_timer () {
      // 用于对应列表的进球动画
      if (this.is_new_init_timer2) {
        clearTimeout(this.is_new_init_timer2)
      }
      this.is_new_init2 = false;
      this.is_new_init_timer2 = setTimeout(() => {
        this.is_new_init2 = true
      }, 3000)
    },
    update_counting_down_up_wrapper_width (width) {
      this.counting_down_up_wrapper_width = width
    },
    /**
     * @description: 获取key对应缓存的图片路径
     * @param {String} key  图片路径
     * @return {String} 返回缓存的路径
     */
    get_img_cache_obj(key) {
      // 没有图片缓存的路径就返回空字符串
      let res = '';
      // 判断是否有图片缓存的路径
      if (key && window.img_cache_obj && window.img_cache_obj[this.match_of_list.csid + '_' + key]) {
        // 获取图片缓存的路径
        res = window.img_cache_obj[this.match_of_list.csid + '_' + key];
      }
      return res;
    },
    /**
     * @description: 设置key对应缓存的图片路径
     * @param {String} key  图片路径
     * @param {String} event  dom event事件
     */
    set_img_cache_obj(key, event) {
      // 判断src属性是否有图片路径
      if (key && event && event.currentTarget && event.currentTarget.src) {
        // 判断图片缓存对象是否为空,为空时设置空对象
        if (!window.img_cache_obj) {
          // 初始化window.img_cache_obj空对象
          window.img_cache_obj = {};
        }
        // 设置缓存的图片,图片的key为球种csid + '_' +图片路径
        window.img_cache_obj[this.match_of_list.csid + '_' + key] = event.currentTarget.src;
      }
    },
    
    /**
     * @description:  直播 视频  动画 点击跳转详情播放
     * @param {String} button_type lvs 直播   muUrl 视频  animationUrl 动画
     * @return {Undefined} Undefined
     */
    media_button_handle () {
      // debugger
      // 计算真正回落的点击按钮   直播 视频  动画
      let { final_button_type } = this.media_button_button_type_check();
      switch (final_button_type) {
        case "lvs":
          break;
        case "muUrl":
          this.media_button_handle_when_muUrl();
          break;
        case "animationUrl":
          break;
        default:
          break;
      }
      // store.dispatch({
      //   type: "matchReducer/set_is_in_play",
      //   payload: final_button_type,
      // });
      this.goto_details(this.match_of_list);
    },

    // 获取菜单名称， 有的赛事 csna 是空
    get_current_manu_name () {
      return MenuData.get_menus_i18n_map({ mi: MenuData.current_lv_2_menu_i })
    },
        
    /**
     * @description:  直播 视频  动画 点击跳转详情播放
     * @param {String} button_type lvs 直播   muUrl 视频  animationUrl 动画
     * @return {Undefined} Undefined
     */
    media_button_handle_by_type (final_button_type) {
      // 计算真正回落的点击按钮   直播 视频  动画
      switch (final_button_type) {
        case "lvs":
          break;
        case "muUrl":
          this.media_button_handle_when_muUrl();
          break;
        case "animationUrl":
          break;
        default:
          break;
      }
      // store.dispatch({
      //   type: "matchReducer/set_is_in_play",
      //   payload: final_button_type,
      // });
      this.goto_details(this.match_of_list);
    },
    /**
     * 计算真正回落的点击按钮   直播 视频  动画
     * @param {*} button_type
     */
    media_button_button_type_check(button_type = 'lvs') {
      let state_obj = {
        lvs: this.match_of_list["lvs"] && this.match_of_list["lvs"] != -1,
        muUrl: this.is_show_video_icon,
        animationUrl: this.match_of_list.mvs > -1,
        icon_path: '',
        final_button_type: '',
      }
      // 正常的 优先级 ： lvs 直播   muUrl 视频  animationUrl 动画
      if (button_type == "lvs") {
        if (state_obj.lvs && ['string', 'number'].includes(typeof lodash.get(this.match_of_list, 'lss'))) {
          // 赛前图标
          if (lodash.get(this.match_of_list, 'lss') == 1) {
            state_obj.icon_path = lvs_icon_theme01
          } else if (lodash.get(this.match_of_list, 'lss') == 0 && lodash.get(this.match_of_list, 'ms') != 1) {
            // 正在直播的图标
            state_obj.icon_path = lvs_icon_theme02
          }
          state_obj.final_button_type = "lvs"
          // 如果不是中文和繁体，则隐藏
          if (!['zh', 'tw', 'hk'].includes(lang.value)) {
            state_obj.lvs = false
            button_type = "muUrl";
            state_obj.icon_path = ''
          }
        } else {
          button_type = "muUrl";
        }
      }
      if (button_type == "muUrl") {
        if (state_obj.muUrl) {
          state_obj.icon_path = this.muUrl_icon
          state_obj.final_button_type = "muUrl"
        } else {
          button_type = "animationUrl";
        }
      }
      if (button_type == "animationUrl") {
        if (state_obj.animationUrl) {
          state_obj.icon_path = this.animationUrl_icon
          state_obj.final_button_type = "animationUrl"
        } else {
        }
      }
      this.media_button_state_obj = { ...state_obj }
      return state_obj
    },
    /**
     * 当点击 视频按钮的时候
     */
    media_button_handle_when_muUrl() {
      // PC、安卓优先用varl，如果varl没有值，再用vurl   IOS只用   vurl
      // 判断是否是苹果手机，是则是true
      if (3000 == menu_type.value) {
        let video_url = {
          active: "muUrl",
          media_src: "",
        };
        let ua = navigator.userAgent.toLowerCase();
        let isIos = ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1;
        if (isIos) {
          video_url.media_src = this.match_of_list.vurl;
        } else {
          video_url.media_src = this.match_of_list.varl || this.match_of_list.vurl;
        }
      }
      // 代表 播放正常视频 标识, 在 match_icon.vue 组件 watch 监听，监听点击直播事件,触发详情页视频直接播放
      //在 match_icon.vue 组件 watch 监听
      this.goto_details(this.match_of_list);
    },
    leaderboard_switch () {
      useMittEmit(MITT_TYPES.EMIT_HOT_LEADERBOARD_SWITCH)
    },
    is_show_result () {
      let r = false;
      if(menu_type.value == 28){
        r = !(is_hot.value || is_detail.value)
      }
      return r;
    },
    
    /**
     * @Description 隐藏主队进球动画
     * @param {undefined} undefined
    */
    hide_home_goal()  {
      this.is_show_home_goal = false
    },
    /**
     * @Description 隐藏客队进球动画
     * @param {undefined} undefined
    */
    hide_away_goal () {
      this.is_show_away_goal = false
    },
    /**
     * @Description 隐藏主队红牌动画
     * @param {undefined} undefined
    */
    hide_home_red () {
      this.is_show_home_red = false
    },
    /**
     * @Description 隐藏客队红牌动画
     * @param {undefined} undefined
    */
    hide_away_red() {
      this.is_show_away_red = false
    },

    /**
     * @description: 设置发球方绿点显示
     * @param {Object} item 赛事对象
     * @param {Object} side 'home'主队  'away'客队
     * @return {Boolean} 是否显示发球方
     */
    set_serving_side(item, side) {
      if (menu_type.value == 28 && !is_detail.value) { //赛果不显示发球方绿点
        return false
      }
      return item.ms == 1 && item.mat == side;
    },
    /**
     * @description: 获取玩法数量
     * @param {Object} item 赛事
     * @return {Number}
     */
    get_match_mc (item) {
      //mc为undefined会显示空 所以要 ||0
      return (item.mc * 1) < 1 ? 0 : item.mc||0;
    },
    /**
     * 包装获取图片路径的方法
     */
    get_server_file_path_local (path, csid) {
      return get_server_file_path(path, csid);
    },
    /**
     * @description: 多少分钟后开赛显示
     * @param {Object} item 赛事对象
     * @return {String}
     */
    show_start_counting_down(item)  {
      if (typeof item.mcg == 'undefined') {
        return false;
      }
      let r = false;
      // 滚球中不需要显示多少分钟后开赛
      if (item && item.ms == 1) {
        return r;
      }
      let start_time = item.mgt * 1;
      let init_server = PageSourceData.init_time.server_time * 1;
      let init_local = PageSourceData.init_time.local_time;
      let now_local = new Date().getTime();
      let sub_local_time = now_local - init_local;
      let now_server_time = init_server + sub_local_time;
      let sub_time = start_time - now_server_time;

      // mcg 1:滚球 2:即将开赛 3:今日赛事 4:早盘
      r = item.mcg != 1 && 0 < sub_time && sub_time < 60 * 60 * 1000;
      return r;
    },
    // 赛事状态  0、赛事未开始 1、滚球阶段 2、暂停 3、结束 4、关闭 5、取消 6、比赛放弃 7、延迟 8、未知 9、延期 10、比赛中断
    /**
     * @description: 进行中(但不是收藏页)的赛事显示累加计时|倒计时
     * @param {Object} item 赛事对象
     * @return {Boolean}
     */
    show_counting_down (item) {
      return [1, 2, 10].includes(item.ms * 1);
    },
    /**
     * 判断是否显示进行中|未开赛
     * @param {Object} item 赛事对象
     * @returns {Boolean}
     */
    get_m_status_show(i) {
      let result = false;
      if (is_detail.value) {
        return false
      }
      //非今日串关不显示
      if (![3, 11].includes(+menu_type.value)) {
        return result;
      } else if (menu_type.value == 11) {
        let third_m_id = lodash.get(MenuData.current_menu, 'date_menu.field1');
        //串关今日id为0或'0'
        if (third_m_id !== 0 && third_m_id !== '0') {
          return result;
        }
      }
      
      if (this.match) {
        if (i > 0) {
          if ([1, 110].includes(+this.match.ms)) {
            result = false;
          }
          else if (![1, 110].includes(+this.match.ms) && [1, 110].includes(+this.match_of_list.ms)) {
            result = true;
          }
        } else if (i == 0 && ![1, 110].includes(+this.match.ms)) {
          result = true;
        }
      }
      return result;
    },
    /**
     * @description: 判断是否显示联赛
     * @param {Number} i 赛事下标
     * @return {Boolean}
     */
    get_league_show (i) {
      let flag = true;
      if (i) {
        if (this.match && this.prev_match) {
          if (this.match.tid != this.prev_match.tid) {
            flag = true;
          }
          else {
            flag = false;
          }
        }
      }
      else {
        flag = true;
      }
      if (this.match_of_list.is_show_no_play) {
        flag = true;
      }
      return flag;
    },
    /**
     * @description: 未开赛标题展示
     * @param {Number} i 赛事下标
     * @param {Number} ms 赛事状态（1 进行中 0 未开赛）
     * @return {Boolean}
     */
    favorite_un_start_title (i, ms) {
      if (i == 0) {
        return false;
      }
      if (menu_type.value == 6) {
        if (this.match_of_list.is_show_no_play && ms == 0) {
          return true;
        }
      }
      return false;
    },
    /**
     * @description: 比分无值时用0占位
     * @param {Undefined}
     * @return {Undefined}
     */
    score_value () {
      if (!this.match_of_list) {
        this.home_score = 0;
        this.away_score = 0;
        this.home_red_score = 0;
        this.away_red_score = 0;
        this.home_yellow_score = 0;
        this.away_yellow_score = 0;
        return;
      }
      
      // 比分处理
      // 修改 msc_obj 
      const msc_obj = MatchDataBaseH5.serialized_score_obj(this.match_of_list.msc, true)

      // 比分处理
      const { home_score, away_score } = MatchUtils.get_match_score({ ...this.match_of_list, msc_obj })

      this.home_score = home_score
      this.away_score = away_score

      //红牌
      if (!this.match_of_list.home_red_score && this.match_of_list.home_red_score != 0) {
        this.home_red_score = 0;
      } else {
        this.home_red_score = this.match_of_list.home_red_score;
      }
      if (!this.match_of_list.away_red_score && this.match_of_list.away_red_score != 0) {
        this.away_red_score = 0;
      } else {
        this.away_red_score = this.match_of_list.away_red_score;
      }

      //黄牌
      if (!this.match_of_list.home_yellow_score && this.match_of_list.home_yellow_score != 0) {
        this.home_yellow_score = 0;
      } else {
        this.home_yellow_score = this.match_of_list.home_yellow_score;
      }
      if (!this.match_of_list.away_yellow_score && this.match_of_list.away_yellow_score != 0) {
        this.away_yellow_score = 0;
      } else {
        this.away_yellow_score = this.match_of_list.away_yellow_score;
      }

      if(MenuData.current_menu !=28 && this.match_of_list.csid==1 && this.match_of_list.cds=='1500' && standard_edition.value == 1 && MenuData.footer_sub_menu_id == 114){
        // 红猫足球赛事,简版,角球菜单时屏蔽角球比分显示
        this.home_score = '';
        this.away_score = '';
      }
    },
    /**
     * @description 设置scrollTop最终滚动距离, 保证详情返回的赛事出现在视图窗口内
     */
    set_scroll_top (scrollTop) {
      clearTimeout(this.scroll_top_timer)
      this.$nextTick (() => {
        this.scroll_top_timer = setTimeout(() => {
          let matchId = 'mid-' + this.get_goto_detail_matchid
          const mid_dom = $refs[matchId]
          //若存在赛事dom，则执行相应滚动逻辑
          if (mid_dom) {
            // 获取目标赛事dom视口top
            const top = mid_dom.getBoundingClientRect().top
            // 目标赛事视图top阈值
            let view_top = lodash.get(this.get_goto_detail_match_info, 'top', 0)
            // view_top = MenuData.current_menu === 4 ? 160 : 120

            if (view_top) {
              // 滚动容器
              let match_list_container = document.querySelector('.match-list-container')
              // 容器最终滚动距离
              const final_scroll_top = scrollTop + top - view_top

              match_list_container.scrollTo(0, final_scroll_top)
              set_goto_detail_matchid('')

              // 短距离滚动标识
              // store.dispatch({ type: 'matchReducer/set_allow_short_scroll',  payload: true });
              // // 已滚动至目标dom时，未滚动至目标计数置为-1
              // store.dispatch({ type: 'matchReducer/set_not_found_target_dom_count',  payload: -1 });

              // 第二次延时计算是为了保证滚动距离正确
              clearTimeout(this.scroll_top_timer2)
              this.scroll_top_timer2 = setTimeout(() => {
                const top2 = mid_dom.getBoundingClientRect().top

                if (Math.floor(top2) > view_top) {
                  match_list_container.scrollTo(0, final_scroll_top + top2 - view_top)
                }

                match_list_container = null
              }, 500)
            }

          } else {
            let not_found_target_dom_count = get_not_found_target_dom_count.value
            if (not_found_target_dom_count >= 0) {
              not_found_target_dom_count++
              // store.dispatch({ type: 'matchReducer/set_not_found_target_dom_count',  payload: not_found_target_dom_count });

              // 当由详情返回后，未滚动至目标计数 和 赛事展示数量相等时，让列表滑动一些距离，防止页面列表展示空白
              if (not_found_target_dom_count === MatchMeta.match_mids.length) {
                document.querySelector('.match-list-container').scrollTop += 1
                // store.dispatch({ type: 'matchReducer/set_goto_detail_matchid',  payload: '' });
              }
            } else {

            }
          }
        }, 500)
      })
    },
    // 热门模块 精选选项卡 下边的 球种图片
    calculate_ball_type_picture () {
      let csid = +this.match_of_list.csid
      let csid_poz_y = '';
      const per_y = -0.60754;  // 1740/(1074/375)/100/rem 根据屏幕宽 和rem计算而来
      switch (csid) {
        case 1:
          csid_poz_y = 0;// 足球
          break;
        case 2:
          csid_poz_y = per_y;// 篮球
          break;
        case 5:
          csid_poz_y = per_y * 2;// 网球
          break;
        case 7:
          csid_poz_y = per_y * 7;// 斯诺克
          break;
        case 10:
          csid_poz_y = per_y * 3;// 羽毛球
          break;
        case 8:
          csid_poz_y = per_y * 4;// 乒乓球
          break;
        case 9:
          csid_poz_y = per_y * 5;// 排球
          break;
        case 4:
          csid_poz_y = per_y * 6;// 冰球
          break;
        case 3:
          csid_poz_y = per_y * 8;// 棒球
          break;
        case 6:
          csid_poz_y = per_y * 9;// 美式足球
          break;
      }
      return csid_poz_y
    },
    /**
     * @description: 跳转至详情
     * @param {TYPES.MatchDetail} item 赛事
     * @param {*} flag 有值时候代表要去到赛事分析页
     * @return {String}
     */
    goto_details (item, flag) {
      if (!item || !item.mid) return;
      if (this.is_on_go_detail) {
        return; //  防止急速点击两次
      }
      // 清除赛事数量
      MatchResponsive.clear_ball_seed_count()
      this.is_on_go_detail = true;
      if (is_results.value || this.$route.name == "matchList") useMittEmit(MITT_TYPES.EMIT_GO_TO_DETAIL_HANDLE, item)
      // 如果是非赛果电竞赛事，需要设置菜单类型
      if (MenuData.current_menu !== 28 && [100, 101, 102, 103].includes(+item.csid)) {
        // store.dispatch({ type: 'matchReducer/set_menu_type',  payload: 3000 });
      }
      // console.log({msg:'测试在极度快速的点几下,可以打印两次此消息,证明执行了两次'})

      // store.dispatch({ type: 'matchReducer/set_goto_detail_matchid',  payload: item.mid });
      // store.dispatch({ type: 'matchReducer/set_not_found_target_dom_count',  payload: 0 });
      // store.dispatch({ type: 'matchReducer/set_details_item',  payload: 0 });
      // 进入详情前，将当前赛事信息存入仓库
      // store.dispatch({ type: 'matchReducer/set_match_base_info_obj',  payload: item });
      //元数据存入本地
      MatchDetailCalss.set_match_details_params( {
        mid:item.mid,
        tid:item.tid, // 联赛 id
        sportId:item.csid, //球类id
        media_type:"auto", // 直播类型
        time: Date.now()
      })
      LocalStorage.set("YUAN_MATCH_DETAIL_DATA",MatchDataBaseH5.get_quick_mid_obj(item.mid))
      // if (is_results.value) { 
      if (this.$route.name == "category") {
        this.$router.push({ name: 'category_loading', params: { mid: item.mid } });
      }
      else {
        let params= flag ? { analysis: flag ? true : false, mid: item.mid, csid: item.csid, tid: item.tid } : { mid: item.mid, csid: item.csid, tid: item.tid }
        // this.$router.push({ name: 'category', params: { analysis: flag ? true : false, mid: item.mid, csid: item.csid, tid: item.tid } });
        let name = 'category' //赛事详情
        if(this.$route.name == 'matchResults' ||item.ms==4){
          name = 'result'
        }

        this.$router.push({name,params})
      }
    },

    clear_goal () {
      let timer = setTimeout(() => {
        this.is_show_away_goal = false
        this.is_show_home_goal = false
        clearTimeout(timer)
        timer = null
      }, 5000)
    },

    // 清除当前组件所有定时器
    clear_timer() {
      // timeout定时器列表
      const timeout_timer_arr = [
        this.timer_super11,
        this.match_change_timer,
        this.is_new_init_timer2,
        this.scroll_top_timer,
        this.scroll_top_timer2,
        this.need_scroll_height_timer,
      ]

      // 批量清除timeout定时器
      for (let timer of timeout_timer_arr) {
        clearTimeout(timer)
        // timer = null
      }
    }
  },
  destroyed() {
    this.clear_timer()
  }
})