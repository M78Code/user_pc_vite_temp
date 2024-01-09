/*
 * @Description: 赛事卡片源数据
 */
import lodash from 'lodash'
import { nextTick } from 'vue';
import { useRoute } from 'vue-router'
import MatchPage from '../match-class/match-page'
import store from "src/store-redux/index.js";
import { useMittEmit, MITT_TYPES } from  "src/core/mitt"
import UserCtr from 'src/core/user-config/user-ctr.js'
import MatchListCardScroll from './match-list-card-scroll'
import { MatchDataWarehouse_H5_List_Common as MatchDataBaseH5 } from 'src/output/module/match-data-base.js'
import { compute_style_template_by_match_height } from './module/compute-style-template.js'
import MatchMeta from '../match-class/match-meta'

class MatchListCard {
  constructor() {
    this.init();
  }
  init() {
    // 页面容器 总高度
    this.match_list_wrapper_height = 0;
    this.no_menu_txt = "noMatch";
    // 当前可视区域已经折叠的个数
    this.already_folded = 0;
    // 滑动 可以触发进程的距离
    this.sliding_can_trigger_process_distance = 1000;
    // 每一个赛事的高度
    this.match_height_map_list = [];
    //赛事与dom高度的映射
    this.mid_dom_height_dict = {};
    //防止滚动触发红升绿降时钟
    this.screen_changing_timer = 0;
    //足球正在切换第一屏与第二屏
    this. foot_ball_screen_changing=0;
    this.menu_type = 0
    this.get_current_menu = 0
    this.get_curr_sub_menu_type = 0
  }
  // // 足球正在切换第一屏与第二屏
  // 'set_foot_ball_screen_changing',
  // // 容器滚动的值
  // 'set_list_scroll_top',
  // 'set_standard_odd_status',  // 更新当前列表基本玩法集 状态

  /**
   * 从新列表中找出指定mid的赛事插入赛事列表
   * @param {Object} compare_obj 新旧列表比较过后的结果
   */
  update_match_to_list(compare_obj) {
    //从赛事列表中删除赛事
    Object.keys(compare_obj.del).forEach((mid) => {
      MatchDataBaseH5.remove_match(mid);
    });
    //插入赛事到列表
    let add_to_list_arr = [];
    Object.keys(compare_obj.add).forEach((mid) => {
      let match = compare_obj.add[mid];
      let insert_i = compare_obj.add_index_obj[mid];
      // MatchDataBaseH5.insertMatchToList(match, insert_i);
      add_to_list_arr.push(match);
    });
    //设置赛事字典对象  setListObj
    // MatchDataBaseH5.appendListObj(add_to_list_arr);
    //从新计算容器
    this.run_process_when_need_recompute_container_list_when_first_load_list();
  }

  /**
   * 赛事接口调用前置条件处理
   * @returns
   */
  match_list_api_prev_handle() {
    // 清空次要玩法折叠的记录
    store.dispatch({ type: 'matchReducer/set_secondary_unfold_map',  payload: {} })
    // 切换球种时 主列表基本玩法集 当前状态初始化
    // this.set_standard_odd_status(0);
    store.dispatch({ type: 'matchReducer/set_standard_odd_status',  payload: 0 });
    // 当前列表也重置到联赛折叠状态
    store.dispatch({ type: 'topMenuReducer/set_collapse_map_match',  payload: 0 });
    this.match_is_empty = false;
    // 代表的是 首页热门的  骨架屏 显示
    useMittEmit(MITT_TYPES.EMIT_SHOW_HOT_SCHEDULE_LOADING, true);
    // 页面异常时，或者  接口请求超时  清除 骨架屏  并且 允许 点击菜单
    clearTimeout(this.requesting_timeout);
    this.requesting_timeout = setTimeout(() => {
      //数据加载成功骨架屏消失
      this.is_close_load();
    }, 12000); // 根据31792 要求,暂时将此处改成 12 秒
    this.is_data_requesting = true;
  }
  // 关闭骨架屏
  is_close_load() {
    //数据加载成功骨架屏消失
    this.is_data_requesting = false;
    this.prev_remember_scrolly = 0;
  }
  /**
   * 赛事列表接口请求后数据处理，
   *  主要功能   1. ol 盘口赔率同级别增加赛事类 csid   2 在首页模块的 热门模块下 添加 时间标题   3. 赛果对数据进行特殊处理(marketId=>matchId字段,matchId  => mid)
   * @param {Object} res 接口数据
   * @returns
   */
  match_list_api_after_handle(res) {
    // 当接口数据返回错误码时
    if (lodash.get(res, "code") != 200) {
      MatchDataBaseH5.clear();
      useMittEmit(MITT_TYPES.EMIT_IS_FIRST_LOADED);
      useMittEmit(MITT_TYPES.EMIT_MATCH_LIST_DATA_TAKED);
      // this.show_favorite_list==true代表收藏时
      if (this.show_favorite_list) {
        // 不等于ws静默更新时
        this.match_is_empty = true;
      }
      // return [];
    }
    // 首页热门列表页骨架屏  隐藏
    nextTick(() => {
      useMittEmit(MITT_TYPES.EMIT_SHOW_HOT_SCHEDULE_LOADING, false);
    });

    let data_page = null;
    if (res.data) {
      if (res.data.data) {
        data_page = res.data.data;
      } else {
        data_page = res.data;
      }
      try {
        // 盘口赔率同级别增加赛事类编号csid
        if (lodash.isArray(data_page)) {
          data_page.forEach((match) => {
            if (match.csid && lodash.isArray(match.hps)) {
              match.hps.forEach((hps_array) => {
                if (lodash.isArray(hps_array.hl)) {
                  hps_array.hl.forEach((hls_array) => {
                    if (lodash.isArray(hls_array.ol)) {
                      hls_array.ol.forEach((ol_item) => {
                        ol_item.csid = match.csid;
                      });
                    }
                  });
                }
              });
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
    //虚拟体育赛果
    let match_res_data = data_page || [];
    // 如果有值，代表是 赛果 虚拟体育
    if (lodash.get(data_page, "records")) {
      match_res_data = data_page.records;
    }
    // 在首页模块的 热门模块下 添加 时间标题
    if (
      match_res_data.length > 0 &&
      this.invok_source == "home_hot_page_schedule"
    ) {
      this.filter_event_title(match_res_data);
    }
    // 赛果   对数据进行特殊处理
    if (this.menu_type == 28) {
      match_res_data.forEach((match) => {
        if (!match.mid && match.matchId) {
          match.mid = match.matchId;
        }
      });
      // 赛果-冠军菜单时,对数据进行特殊处理
      if (
        [100].includes(this.get_curr_sub_menu_type) &&
        lodash.isArray(match_res_data)
      ) {
        match_res_data.forEach((item_) => {
          // marketId字段唯一值赋值matchId字段
          item_.matchId = item_.marketId;
          item_.tid = item_.sportId;
          item_.mid = item_.matchId;
        });
      }
    }
    if (lodash.isEmpty(res.data) || !match_res_data.length) {
      this.match_is_empty = true;
    }
    //清除为空的赛事
    for (let i = 0; i < match_res_data.length; i++) {
      let match_item = match_res_data[i];
      if (match_item == null || match_item == "null" || !match_item) {
        match_res_data.splice(i, 1);
        i--;
      }
    }
    // 首页热门展示25场赛事最多，提高性能
    if (["home_hot_page_schedule"].includes(this.invok_source)) {
      match_res_data = match_res_data.slice(0, 25);
    }
    return match_res_data;
  }
  /**
   * 设置显示赛事列表数据
   * @param {Object} match_res_data 赛事接口数据
   * @param {Object} params 接口调用参数
   * @param {Function} cb 回调函数
   */
  set_match_list_page_data(match_res_data, cb) {
    let data_source = this.match_list_api_after_handle(match_res_data)
    // 添加赛事对象前端使用字段 : 让球方  ， 在 update_match_databy_mid  已经调用了，所以注释
    // match_res_data = this.match_list_init(match_res_data);
    // 初始化  hn_obj = {}; hl_obj = {};设置赛事 mid
    // MatchDataBaseH5.setListObj(data_source);
    //主流程赛事请求的数据显示
    if (data_source) {
      // 1.开赛 和 未开赛  和 其他赛事(电竞,冠军)     时间 排序
      match_res_data = MatchPage.get_obj(data_source);
      // 2.列表页set_list 数据源赋值操作
      MatchDataBaseH5.set_list(data_source);
    }
    //  赛事列表进程 对数据源进行了截取
    this.run_process_when_need_recompute_container_list_when_first_load_list( true );
    //数据显示后的回调
    if (cb) cb(!data_source || !data_source.length);
  }
  /**
   * 赛事列表数据设置后处理
   * @param {Object} params 接口参数
   * @param {Array} match_res_data 列表数据
   */
  after_set_match_list_data(params, match_res_data) {
    const route =  useRoute()
    if (route?.name === "match_result") {
      return;
    }
    if (this.newer_standard_changing) {
      // this.set_n_s_changed_loaded(Math.random());
      this.newer_standard_changing = false;
    }
    // 由详情页返回列表才计算上次滚动位置
    // if(this.menu_type != 28 && this.prev_remember_scrolly){
    if (this.menu_type != 28) {
      clearTimeout(this.set_scroll_top_timer1);
      this.set_scroll_top_timer1 = setTimeout(() => {
        // 由详情页返回列表才计算上次滚动位置
        if (["category"].includes(this.get_last_route_info && this.get_last_route_info.name)) {
          // 记录上一次滑动的距离
          MatchListCardScroll.calac_scrolltop();
        } else {
          this.prev_remember_scrolly = 0;
        }
        // use_router_scroll().setScrollTop();
        this.run_process_when_need_recompute_container_list(true);
        //数据加载成功骨架屏消失
        this.is_close_load();

        // 记录路由信息
        const { fullPath = '', hash = '', name = '', params = '', path = '', query = '' } = route;
        // this.set_last_route_info({ fullPath, hash, name, params, path, query });
        MatchPage.subscription();
      }, 10);
    } else {
      // 如果是赛果返回的，则 计算滚动距离
      MatchListCardScroll.calac_scrolltop();
      // 赋值滚动距离
      // use_router_scroll().setScrollTop();
      // 数据加载成功后 骨架屏消失
      this.is_close_load();
      // this.set_goto_detail_matchid("");
    }
  }
  /**
   * 赛事列表接口请求异常处理
   * @param {Object} e 异常对象
   * @param {Function} cb 回调函数
   */
  match_list_api_catch_handle(e, cb) {
    // 关闭热门列表的骨架屏
    useMittEmit(MITT_TYPES.EMIT_SHOW_HOT_SCHEDULE_LOADING, false);
    // 如果当前请求的接口uid和 返回的是一样的，才做处理
    if (this.last_gcuuid == e.gcuuid) {
      this.match_is_empty = true;
      if (MatchDataBaseH5 && MatchDataBaseH5.set_list) {
        MatchDataBaseH5.set_list([]);
      }
    }
    this.is_close_load();
    if (cb) cb();
    if (! UserCtr.user_token) {
      this.no_menu_txt = "noMatch";
      // useMittEmit(MITT_TYPES.EMIT_GO_TO_VENDER);
    }
  }
  /**
   * 通过赛事数据获取赛事所占容器高度
   * @param {Object} match_height_map
   */
  get_match_dom_height_by_matchdata(match_height_map) {
    let r = 0;
    match_height_map && Object.keys(match_height_map).forEach((p_key) => {
      if (p_key != "" && p_key != "mid") {
        r += match_height_map[p_key];
      }
    });
    return r;
  }
  /**
   * 次要玩法展开
   * @param {Object} param 展开的次要玩法信息
   */
  secondary_play_unfold_change_handle(data) {
    this && this.run_process_when_need_recompute_container_list && this.run_process_when_need_recompute_container_list(true, data);
  }
  /**
   * 像素值转为rem
   */
  px_2_rem(px) {
    let rem1px = window.innerWidth / 3.75; //1rem的像素值
    return px / rem1px;
  }
  /**
   * 更新 赛事列表 进程
   * 执行这个流程的先决条件：
   *
   * 前端 页面数据 处理流程：
   * 此方法 需要重构 拆分 ：
   * 1. 第一步：计算 当前页面需要显示的 容器 以及容器 mid 序列
   *     流程：  第一步的 流程  参看 第一步方法 体 头部注释
   * 2. 第二步：重新计算 容器整体高度 ，此理论高度 在前或者在后调用 理论上都行
   * 3. 第三步：重新计算 每个容器 的 top 定位 数值
   * 4. 第四步：一切准备就绪 ，根据第一步计算的 容器 mid 序列 从仓库 取出对应的 列表数据 ， 更新显示的容器列表
   *
   * 备注：
   * 触发此进程 的 场景 ，需要 分离拆分 多个分支 ，每个场景一个分支
   * 场景 1： 首次进入  赛事初始化加载
   * 场景 2： 联赛 折叠
   * 场景 3： 赛事 新增 或者 删除
   * 场景 4： 列表 滚动
   *
   *  参数说明：      need_pre_process : 需要执行前置进程
   *
   * 关于后置进程  理论上目前的 项目需求内不需要 后置进程 ， 如果需要后置进程  这里进行 后置进程 单独 方法  ， 可以方法复写
   *
   */
  //  更新 赛事列表 进程 综合 控制方法
  run_process_when_need_recompute_container_list(need_pre_process, scroll_obj) {
    // 需要执行前置进程
    if ( !MatchMeta.match_mids || !MatchMeta.match_mids.length ) {
      // 如果条件达不到 ，不可以执行主进程 ，或者不需要执行主进程 则 方法终止
      return false;
    }

    // 主进程
    // 1. 第一步：数组去重
    this.run_process_when_need_recompute_container_list_step_one_recompute_next_list_mids();
    // 2. 第二步：重新计算 容器的每个高度，还有 所有列表总和的 整体高度
    this.run_process_when_need_recompute_container_list_step_two_match_list_wrapper_height();
    // 3. 第三步：重新计算 每个容器 的 top 定位 数值
    this.run_process_when_need_recompute_container_list_step_three_recompute_next_list_container_top_obj( scroll_obj );
    // 理论上目前的 项目需求内不需要 后置进程 ， 如果需要后置进程  这里进行 后置进程 单独 方法  ， 可以方法复写
  }
  /**场景 1： 首次进入页面，或者列表接口请求   赛事初始化加载
   *  触发更新 赛事列表进程 的 场景
   *
   * 重点： 首次初始化需要 依据 赛事列表更新进程 方法 run_process_when_need_recompute_container_list()  更新显示的容器列表内容数据
   *       切记： 第一次  赛事列表进程 计算出的更新的数据 需要 json 序列化和反序列化 进行深度拷贝，
   *       否则  由于 对象是引用类型， 如果不深拷贝则地址不变，页面容器数据和 仓库数据 共用同一个地址数据的引用 ，会造成流程 混乱错误
   *       第一次初始化深拷贝后， 后续更新 页面内显示的容器数据 理论上浅拷贝就可以 ，
   *       这里如果能做到 两层浅拷贝 ，或者 容器内数据 平坦化 则 性能会更高，
   *       目标是尽量减少容器内数据的 二层或者更深层数据引用地址更变 ，
   *       VUE组件更新是组件维度更新， 另外引用类型数据地址改变则会增大组件更新开销，理论上 值类型，简单类型 优于引用类型
   *
   *  参数说明：      need_pre_process : 需要执行前置进程
   *
   */
  run_process_when_need_recompute_container_list_when_first_load_list(need_pre_process = true, update_type) {
    //  更新 赛事列表 进程 综合 控制方法
    this.run_process_when_need_recompute_container_list(need_pre_process, { update_type });
  }
  /** 场景 2： 联赛 折叠
   * 触发更新 赛事列表进程 的 场景
   *  参数说明：      need_pre_process : 需要执行前置进程
   */
  run_process_when_need_recompute_container_list_when_coolspace_tournament(need_pre_process = true, invoke_type) {
    //  更新 赛事列表 进程 综合 控制方法
    this.run_process_when_need_recompute_container_list(need_pre_process, { update_type: invoke_type });
  }

  // 赛事数据源去重，数组 相同的mid 去重
  run_process_when_need_recompute_container_list_step_one_recompute_next_list_mids() {
    // 如果是赛果，不用去重 骚操作
    // if (this.menu_type == 28) {
    //   return;
    // }
    //  这个方法只是做简单的 赛事数据源去重，数组去重
    // let mid_dict = {};
    // let len = MatchDataBaseH5.list.length;
    // for (let i = 0; i < len; i++) {
    //   let match_frame = MatchDataBaseH5.list[i];
    //   if (!match_frame) {
    //     continue;
    //   }
    //   if (match_frame.mid in mid_dict) {
    //     let old_index = mid_dict[match_frame.mid];
    //     MatchDataBaseH5.list.splice(old_index, 1);
    //     i--;
    //   }
    //   mid_dict[match_frame.mid] = i;
    // }
  }

  /**
   * 更新 赛事列表 进程
   * 2. 第二步：重新计算 容器整体高度 ，此 理论高度  在前或者在后调用 理论上都行
   *    次理论高度 因为采用的是绝对定位， 所以这个高度仅仅影响最下面一页的展示的 空白区域，因此 计算在前在后都不影响
   * ： 备注应该在前计算 ： 例如场景 ： 从 联赛全部折叠了到 展开全部联赛 ， 这种从低到高， 从少到多的 过程
   */
  run_process_when_need_recompute_container_list_step_two_match_list_wrapper_height() {
    // 只有在列表页才有计算逻辑，节省性能
    if ( !["detail_match_list", "home_hot_page_schedule"].includes( this.invok_source ) ) {
      //获取赛事与dom高度的映射
      //赛事是否折叠
      this.already_folded = 0;
      //赛事与dom高度的映射
      this.mid_dom_height_dict = {};
      // 每一个赛事的高度
      this.match_height_map_list = MatchMeta.match_mids.map((mid, i) => {
        const match = MatchDataBaseH5.get_quick_mid_obj(mid)
        // let obj = get_match_dom_show_property(i);
        // let r = get_template_config(obj);
        // if (match.mhid === '111065') compute_style_template_by_match_height(match)
        // // 在列表下,第一个元素的偏移量减去0.09rem 因为第一个元素没有玩法标题padingtop
        // if (location.hash.includes("match") && i == 0) {
        //   r.odd_list_height -= 0.11;
        // }
        // this.mid_dom_height_dict[r.mid] = r;
        // match.is_show_league = this.compute_show_league(match, i)
        return compute_style_template_by_match_height(match); //每个赛事占的dom高度和mid映射r
      });
      // console.log(this.match_height_map_list)
      // 计算每个赛事容器的高度，累加 = 总高度
      let total_height = this.match_height_map_list.reduce((total, map_obj) => {
        let p_total = 0;
        if (typeof total == "number") p_total = total;
        return p_total + this.get_match_dom_height_by_matchdata(map_obj);
      }, 0);
      //页面容器 总高度
      this.match_list_wrapper_height = total_height;
    }
  }

  /** 更新 赛事列表 进程
   *  重新计算 每个容器 的 top 定位     核心算法可视区域头尾进行插入新数据操作
   *  调用  vuex 里面 set_match_top_map_dict 设置容器 定位 top 值 表征对象
   */
  run_process_when_need_recompute_container_list_step_three_recompute_next_list_container_top_obj( scroll_obj ) {
    // 冠军  或者  电竞冠军 或者   赛果虚拟体育  ，赋值全部数据， 不走下边计算逻辑
    if (this.menu_type == 100 || (this.menu_type == 3000 && lodash.get(this.get_current_menu, "date_menu.menuType") == 100) || (this.menu_type == 28 &&
        [1001, 1002, 1004, 1011, 1010, 1009, 100].includes( this.get_curr_sub_menu_type ))
    ) {
      // MatchDataBaseH5.set_list(MatchMeta.match_mids, false);
      return;
    }
    // scroll_top 是 滚动的距离
    let scroll_top = MatchListCardScroll.get_scroll_wrapper_top(scroll_obj);

    let page_count = 18;
    // 新手版
    if (this.get_newer_standard_edition == 1) {
      page_count = 20;
    }
    //赛果虚拟赛狗|赛马 摩托车
    if (this.menu_type == 28) {
      if ([1002, 1011, 1010, 1009].includes(this.get_curr_sub_menu_type)) {
        page_count = lodash.get(MatchMeta.match_mids, 'length')
      } else {
        page_count = 20;
      }
    }
    let current_match_dom_top = 0, // 可视区域的赛事的top 值  18场
      match_list_length = this.match_height_map_list.length, // 当前列表数据的总数量  长度
      get_match_total = 0, // 当前页面的赛事数量
      mid_top_map = {}, // 对应的 赛事id 的  偏移 位置值
      start_rem = this.px_2_rem(scroll_top) - 2.34 * 5, // 顶部滚动距离减去  上面5个列表赛事  的距离
      current_screen_match = []; // 列表页可视区域 赛事的数据
    // 只有在列表页才有计算逻辑，节省性能
    if (
      !["detail_match_list", "home_hot_page_schedule"].includes(
        this.invok_source
      )
    ) {
      // aaaaaaa. 虚拟滚动 真正的滑动 算法
      for (let i = 0; i < match_list_length; i++) {
        let h_map = this.match_height_map_list[i];
        // 计算出 当前赛事的容器高度，以rem 计算
        let match_height = this.get_match_dom_height_by_matchdata(h_map);
        // 当前赛事id 在整体列表页的高度位置， 大于滑动 的距离，就是可视区域的赛事了
        if (current_match_dom_top > start_rem) {
          // 数量小于 18 或者 20 时，执行下边 赋值操作，列表页每一个赛事的 translateY( ${top}rem) top 定位值
          if (get_match_total < page_count) {
            // 显示的 top 值，在 scroll_wrapper.vue 文件中引用
            mid_top_map[h_map.mid] = current_match_dom_top;
          } else {
            // 执行break，则立即退出 循环
            break;
          }
          // 当前赛事
          const match = MatchDataBaseH5.get_quick_mid_obj(h_map.mid)
          if (match && match_height > 0) {
            // 列表页赛事的数据
            current_screen_match.push(match);
            get_match_total++; //赛事容器数量加1
          }
          // 获取赛事对应的dom显示区域属性
          let dom_show_obj = compute_style_template_by_match_height(match);
          // 如果当前折叠 并且 当前赛事 显示联赛，则 -1 操作
          if (dom_show_obj.is_collapse && dom_show_obj.is_show_league) {
            if (this.already_folded <= 7) {
              get_match_total--; //赛事容器数量减1，相当于页面可视区域 总数量 page_count 加1个
            }
            this.already_folded++;
          }
        }
        current_match_dom_top += match_height;
      }

      // 如果当前赛事折叠超过 8场赛事 并且 高度 大于5.5  走  虚拟滚动 真正的滑动 算法，和上边 aaaaaaa 逻辑一模一样
      if (this.already_folded > 7 && this.match_list_wrapper_height > 5.5) {
        this.sliding_can_trigger_process_distance =
          600 - this.already_folded * 12;
        current_match_dom_top = 0; // 可视区域的赛事的top 值  18场
        get_match_total = 0; // 当前页面的赛事数量
        mid_top_map = {}; // 对应的 赛事id 的  偏移 位置值
        let current_list_total_length = current_screen_match.length,
          current_list_total_height = 0,
          list_visible_areas_number = 25;
        // 计算出 当前可视区域赛事的容器总高度，以rem 计算
        for (let j = 0; j < current_list_total_length; j++) {
          let h_map = this.mid_dom_height_dict[current_screen_match[j].mid];
          // 计算出 当前赛事的容器高度，以rem 计算
          current_list_total_height +=
            +this.get_match_dom_height_by_matchdata(h_map);
        }
        let many_distances =
          this.px_2_rem(scroll_top) -
          (current_list_total_height / page_count) * 7; // 可视区域  每一场的平均高度 × 7
        current_screen_match = []; // 列表页可视区域 赛事的数据
        for (let i = 0; i < match_list_length; i++) {
          let h_map = this.match_height_map_list[i];
          let match_height = this.get_match_dom_height_by_matchdata(h_map);
          if (current_match_dom_top > many_distances) {
            if (get_match_total < list_visible_areas_number) {
              mid_top_map[h_map.mid] = current_match_dom_top;
            } else {
              break;
            }
            const match = MatchDataBaseH5.get_quick_mid_obj(h_map.mid)
            if (match && match_height > 0) {
              current_screen_match.push(match);
              get_match_total++; //赛事容器数量加1
            }
          }
          current_match_dom_top += match_height;
        }
      } else {
        if (this.get_newer_standard_edition == 2) {
          this.sliding_can_trigger_process_distance = 1000;
        } else {
          this.sliding_can_trigger_process_distance = 500;
        }
      }

      // H5 列表页显示的 可视区域的  数据源
      // MatchCtr.setList(current_screen_match, false);
      MatchDataBaseH5.set_list(current_screen_match)
    } else {

      // H5 列表页显示的 可视区域的  数据源
      // MatchCtr.setList(MatchDataBaseH5.list, false);
      MatchDataBaseH5.set_list(current_screen_match)
    }
    // 防止滚动切换赛事时触发赛事红升绿降
    clearTimeout(this.screen_changing_timer);
    this.foot_ball_screen_changing=1;
    this.screen_changing_timer = setTimeout(() => {
        this.foot_ball_screen_changing=0
    }, 500);
    // 赛事对象对应的dom 的 top 值的 映射
    store.dispatch({ type: 'matchReducer/set_match_top_map_dict',  payload: mid_top_map })
    // 订阅新赛事列表
    if (scroll_obj != "ciyao_bold") {
      MatchPage.subscription();
    }
  }
  /**
   * 是否显示联赛标题
   * @param {match} 赛事对象 
   * @param {i} 赛事下标
   */
  compute_show_league (match, i) {
    let flag = false;
    // 虚拟体育没有tid而是tnameCode
    let property_key = "tnameCode";
    if(!match[property_key]){
      property_key = "tid";
    }
    if (i == 0) {
      flag = true;
    } else {
      // 前一个赛事
      let prev_mid =MatchMeta.match_mids[i - 1];
      const prev_match = MatchDataBaseH5.get_quick_mid_obj(prev_mid)
      // 如果显示  赛事未开赛标题， 或者是  上一次和这一次tid 不一样  则显示联赛标题高度 is_show_no_play(i) || 
      if (match[property_key] !== prev_match[property_key]) {
        flag = true;
      }
    }
    return flag;
  }
  // 浏览器得到焦点
  window_focused_handle() {
    this.run_process_when_need_recompute_container_list_when_first_load_list();
  }
  
  // 批量清除定时器
  clear_mixin_timer() {
    const timer_arr = [
      "requesting_timeout",
      "set_scroll_top_timer1",
      "screen_changing_timer",
      "match_scroll_timer",
    ];

    for (const timer of timer_arr) {
      clearTimeout(this[timer]);
      this[timer] = null;
    }
  }
}

export default new MatchListCard()
