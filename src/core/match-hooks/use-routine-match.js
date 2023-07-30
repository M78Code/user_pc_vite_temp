/*
 * @Description: 常规赛事 hook
 */

export const useRoutine = () => {
  /**
     * 生成折叠状态键(暂时只返回tid)
     */
  const gen_collapse_key = (match) => {
    return match.tid;
  }
  /**
   * 从新列表中找出指定mid的赛事插入赛事列表
   * @param {Object} compare_obj 新旧列表比较过后的结果
   */
  const update_match_to_list = (compare_obj) => {
    //从赛事列表中删除赛事
    Object.keys(compare_obj.del).forEach(mid => {
      this.matchCtr.clearMidObj(mid);
    });
    //插入赛事到列表
    let add_to_list_arr = [];
    Object.keys(compare_obj.add).forEach(mid => {
      let match = compare_obj.add[mid];
      let insert_i = compare_obj.add_index_obj[mid];
      this.matchCtr.insertMatchToList(match,insert_i);
      add_to_list_arr.push(match);
    });
    //设置赛事字典对象  setListObj
    this.matchCtr.appendListObj(add_to_list_arr);
    //从新计算容器
    this.run_process_when_need_recompute_container_list_when_first_load_list();
  }
  /**
   * 首页热门切换标签 todo param后续直接在get_match_data_list中生成
   */
  const tab_changing_handle = () => {
    // 切换菜单，先清除所有数据仓库的数据
    this.matchCtr.init()
    if(this.scroll_list_wrapper_by){
      this.scroll_list_wrapper_by(0);
    }
    this.get_match_data_list();
  }
  /**
   * 获取数据api方法
   * @param {Object} params 接口参数
   * @returns Function 接口调用方法 api_handle  要调用的 接口
   */
  const get_matchs_api_func = ( params) => {
    let result = {
      api_handle: null,
      api_params: params
    };
    //收藏赛事列表
    if (this.show_favorite_list) {
      if (3000 == _.get(this.get_current_menu, 'main.menuType')) {
        result.api_handle = post_esport_collect;
      } else {
        result.api_handle = get_collect_matches;
      }
      if (this.menu_type == 28 && this.invok_source != "detail_match_list") {
        result = this.result_api_handle(result, params)
      }
    }
    //精选赛事
    else if (this.invok_source == "detail_match_list") { // todo 重要该参数详情页处理
      result.api_handle = get_result_match_care_list;
    }
    //赛果
    else if (_.get(this.get_current_menu, 'main.menuType') == 28) {
      result = this.result_api_handle(result, params)
    }
    //首页热门——赛程 todo 此代码中参数计算整合到参数方法中
    else if (this.invok_source == "home_hot_page_schedule") {
      // 如果首页热门有状态管理值，并且不是 精选页面
      if (!_.isEmpty(this.get_hot_tab_item) && _.get(this.get_hot_tab_item, 'index') != 0) {
        // 如果是电竞
        if( [100,101,102,103].includes(+_.get(this.get_hot_tab_item,'field1'))) {
          result.api_handle = post_esports_match;
          result.api_axios_flg = 'post_esports_match';
        } else if(result.api_params.euid){
          // 滚球，今日，早盘，竟足 列表接口
          result.api_handle = post_match_full_list;
          result.api_axios_flg = 'post_match_full_list';
        }
      }
      //如果是 精选赛事
      else if ( _.get(this.get_hot_tab_item, 'index') == 0 ) {
        result.api_handle = get_match_home_page_handpick;
      }
    }
    //滚球今日早盘串关等获取赛事列表
    else {
      // 电竞
      if (_.get(this.get_current_menu, 'main.menuType') == 3000) {
        // 如果是 收藏
        if (this.show_favorite_list) {
          result.api_handle = post_esport_collect;
        } else {
          result.api_handle = post_esports_match;
          result.api_axios_flg = 'post_esports_match';
        }
      } else {
        result.api_handle = post_match_full_list;
        result.api_axios_flg = 'post_match_full_list';
      }
    }
    return result;
  }
  // 赛果下赛事列表 api适配处理
  const result_api_handle = (result, params) => {
    // 虚拟体育赛果 足球 赛狗 赛马 摩托车 泥地摩托车
    if ([1001, 1002, 1004, 1009, 1010, 1011].includes(+params.sportType)) {
      result.api_handle = get_virtual_result;
    } else if(100 == +_.get(this.get_current_menu, 'sub.menuType')) {
      let startTime = params.md;
      if (startTime) {
        const m_hour = 24 * 60 * 60 * 1000; // 24小时的毫秒数

        let endTime = (+startTime + (m_hour - 1000)).toString();

        result.api_params.startTime = startTime;
        result.api_params.endTime = String(endTime);
      }
      result.api_params.orderBy = 1;
      result.api_params.isVirtualSport = 1;
      result.api_params.sportType = +params.euid;
      result.api_handle = get_champion_match_result_api;
    }
    else {
      result.api_handle = get_match_result_api;
    }

    return result
  }
  /**
   * 判断是否为冠军和电竞冠军
   */
  const get_mm_is_champion = () => {
    return this.menu_type == 100 || _.get(this.get_current_menu, 'date_menu.menuType') == 100;
  }
  /**
   * 赛事接口调用前置条件处理
   * @returns
   */
  const match_list_api_prev_handle = () => {
    this.set_secondary_unfold_map({}); // 清空次要玩法折叠的记录
    // 切换球种时 主列表基本玩法集 当前状态初始化
    this.set_standard_odd_status(0)
    this.set_collapse_map_match({}); // 当前列表也重置到联赛折叠状态
    this.match_is_empty = false;
    // 代表的是 首页热门的  骨架屏 显示
    this.$root.$emit(this.emit_cmd.EMIT_SHOW_HOT_SCHEDULE_LOADING, true);
    // 页面异常时，或者  接口请求超时  清除 骨架屏  并且 允许 点击菜单
    clearTimeout(this.requesting_timeout);
    this.requesting_timeout = setTimeout(() => {
      //数据加载成功骨架屏消失
      this.is_close_load()
    },12000); // 根据31792 要求,暂时将此处改成 12 秒
    this.is_data_requesting = true;
  }
  // 关闭骨架屏
  const is_close_load = () => {
    //数据加载成功骨架屏消失
    this.is_data_requesting = false;
    this.prev_remember_scrolly = 0
  }
  /**
   * 赛事列表接口请求后数据处理，
   *  主要功能   1. ol 盘口赔率同级别增加赛事类 csid   2 在首页模块的 热门模块下 添加 时间标题   3. 赛果对数据进行特殊处理(marketId=>matchId字段,matchId  => mid)
   * @param {Object} res 接口数据
   * @returns
   */
  const match_list_api_after_handle = (res) => {
    // 当接口数据返回错误码时
    if (_.get(res,'code')!= 200) {
      this.matchCtr.clearData();
      this.$root.$emit(this.emit_cmd.EMIT_IS_FIRST_LOADED);
      this.$root.$emit(this.emit_cmd.EMIT_MATCH_LIST_DATA_TAKED);
      // this.show_favorite_list==true代表收藏时
      if(this.show_favorite_list){
        // 不等于ws静默更新时
        this.match_is_empty=true;
      }
      return [];
    }
    // 首页热门列表页骨架屏  隐藏
    this.$nextTick(() => {
      this.$forceUpdate()
      this.$root.$emit(this.emit_cmd.EMIT_SHOW_HOT_SCHEDULE_LOADING, false);
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
        if (_.isArray(data_page)) {
          data_page.forEach(match => {
            if (match.csid && _.isArray(match.hps)) {
              match.hps.forEach(hps_array => {
                if (_.isArray(hps_array.hl)) {
                  hps_array.hl.forEach(hls_array => {
                    if (_.isArray(hls_array.ol)) {
                      hls_array.ol.forEach(ol_item => {
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
    if (_.get(data_page, 'records')) {
      match_res_data = data_page.records;
    }
    // 在首页模块的 热门模块下 添加 时间标题
    if (match_res_data.length > 0 && this.invok_source == "home_hot_page_schedule") {
      this.filter_event_title(match_res_data);
    }
    // 赛果   对数据进行特殊处理
    if(this.menu_type == 28 ){
      match_res_data.forEach(match => {
        if(!match.mid && match.matchId) { match.mid = match.matchId }
      });
      // 赛果-冠军菜单时,对数据进行特殊处理
      if([100].includes(this.get_curr_sub_menu_type) && _.isArray(match_res_data)){
        match_res_data.forEach(item_ => {
          // marketId字段唯一值赋值matchId字段
          item_.matchId = item_.marketId;
          item_.tid = item_.sportId
          item_.mid = item_.matchId
        });
      }
    }
    if(_.isEmpty(res.data) || !match_res_data.length){
      this.match_is_empty = true
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
    if(["home_hot_page_schedule"].includes(this.invok_source)){
      match_res_data = match_res_data.slice(0,25)
    }
    return match_res_data;
  }
  /**
   * 设置显示赛事列表数据
   * @param {Object} match_res_data 赛事接口数据
   * @param {Object} params 接口调用参数
   * @param {Function} cb 回调函数
   */
  const set_match_list_page_data = (match_res_data, cb) => {
    if(!this.matchCtr) return;
    // 添加赛事对象前端使用字段 : 让球方  ， 在 update_match_databy_mid  已经调用了，所以注释
    // match_res_data = this.match_list_init(match_res_data);
    // 初始化  hn_obj = {}; hl_obj = {};设置赛事 mid
    this.matchCtr.setListObj(match_res_data);
    //主流程赛事请求的数据显示
    if(match_res_data) {
      // 1.开赛 和 未开赛  和 其他赛事(电竞,冠军)     时间 排序
      match_res_data = this.get_obj(match_res_data);
      // 2.列表页set_source_list 数据源赋值操作
      this.matchCtr.set_source_list(match_res_data);
    }
    //  赛事列表进程 对数据源进行了截取
    this.run_process_when_need_recompute_container_list_when_first_load_list(true);
    //数据显示后的回调
    if (cb) cb(!match_res_data || !match_res_data.length);
  }
  /**
   * 赛事列表数据设置后处理
   * @param {Object} params 接口参数
   * @param {Array} match_res_data 列表数据
   */
  const after_set_match_list_data = (params,match_res_data) => {
    if (this.$route.name === 'match_result') {
      return
    }

    if (this.newer_standard_changing) {
      this.set_n_s_changed_loaded(Math.random());
      this.newer_standard_changing = false;
    }
    // 由详情页返回列表才计算上次滚动位置
    // if(this.menu_type != 28 && this.prev_remember_scrolly){
    if(this.menu_type != 28){
      clearTimeout(this.set_scroll_top_timer1);
      this.set_scroll_top_timer1 = setTimeout(() => {
        // 由详情页返回列表才计算上次滚动位置
        if (['category'].includes(this.get_last_route_info.name)) {
          this.calac_scrolltop()
        } else {
          this.prev_remember_scrolly = 0
        }
        this.setScrollTop();
        this.run_process_when_need_recompute_container_list(true);
        //数据加载成功骨架屏消失
        this.is_close_load()

        // 记录路由信息
        const {fullPath, hash, name, params, path, query} = this.$route
        this.set_last_route_info({fullPath, hash, name, params, path, query})
        this.subscription();
      }, 10);
    }else {
      // 如果不是详情页返回的，则 数据加载成功后 骨架屏消失
      this.calac_scrolltop()
      this.setScrollTop();
      this.is_close_load()
      this.set_goto_detail_matchid('')
    }
  }
  const calac_scrolltop = () => {
    for(let i=0,list_lenght = this.match_height_map_list.length; i< list_lenght; i++){
      if(this.get_goto_detail_matchid == this.match_height_map_list[i].mid){
        //容器总高度
        let back_scroll_top = this.match_height_map_list.slice(0,i).reduce((total, map_obj) => {
          let p_total = 0;
          if (typeof total == "number") {
            p_total = total;
          }
          return p_total + this.get_match_dom_height_by_matchdata(map_obj);
        }, 0);
        this.prev_remember_scrolly = back_scroll_top * (window.innerWidth / 3.75) - 50
        break
      }
    }
  }
  /**
   * 赛事列表接口请求异常处理
   * @param {Object} e 异常对象
   * @param {Function} cb 回调函数
   */
  const match_list_api_catch_handle = (e, cb) => {
    // 关闭热门列表的骨架屏
    this.$root.$emit(this.emit_cmd.EMIT_SHOW_HOT_SCHEDULE_LOADING, false);
    // 如果当前请求的接口uid和 返回的是一样的，才做处理
    if(this.last_uuid == e.gcuuid){
      this.match_is_empty = true;
      if(this.matchCtr && this.matchCtr.setList){
        this.matchCtr.setList([]);
      }
    }
    this.is_close_load()
    if (cb) cb();
    if (!this.get_user_token) {
      this.no_menu_txt = "noMatch";
      // this.$root.$emit(this.emit_cmd.EMIT_GO_TO_VENDER);
    }
  }
  /**
   * 通过赛事数据获取赛事所占容器高度
   * @param {Object} match_height_map
   */
  const get_match_dom_height_by_matchdata = (match_height_map) => {
    let r = 0;
    Object.keys(match_height_map).forEach(p_key => {
      if (p_key != "" && p_key != "mid") {
        r += match_height_map[p_key];
      }
    });
    return r;
  }
  /**
   * 赛事折叠状态变化
   */
  const unfold_changed_handle = () => {
    // 走虚拟滚，
    // 第一步：数据去重
    // 第二步：重新计算 容器整体高度 ，此 理论高度  在前或者在后调用 理论上都行
    // 第三步：重新计算 每个容器 的 top 定位 数值
    this.run_process_when_need_recompute_container_list_when_coolspace_tournament(true);
    this.set_list_scroll_top_by_target();
  }
  /**
   * 设置赛事列表容器滚动数据
   */
  const set_list_scroll_top_by_target = (scroll_obj) => {
    //获取滚动对象
    let target = this.$refs.match_list_container
    if(target){
      let r_str = '';
      let scroll_y = this.list_scroll_top = target.scrollTop;  // 距离顶部距离 （滑动的距离）
      let client_height = target.clientHeight;  // 内容距离   content area + padding
      let scroll_height = target.scrollHeight;  // 内容展开时的高度（容器的总高度）
      let aftered = '';
      if(scroll_obj && scroll_obj.update_type == "standard_simple_change"){
        aftered = ''+Math.random();
      }

      r_str = `${scroll_y}-${client_height}${aftered}-${scroll_height}${aftered}`;
      this.set_list_scroll_top(r_str);
    }
  }
  /**
   * 赛事列表滚动事件
   */
  const match_list_scroll_handle = (e) => {
    let scroll_top = e.scrollTop ? +e.scrollTop : window.scrollY;
    this.window_scrolly = scroll_top;
    if(e.cb){
      e.cb(this); // 回调，并将子对象的this传入
    }
    this.run_process_when_need_recompute_container_list_when_scroll(null,e);
  }
  /**
   * 次要玩法展开
   * @param {Object} param 展开的次要玩法信息
   */
  const secondary_play_unfold_change_handle = (data) => {
    this.run_process_when_need_recompute_container_list(true, data);
  }

  /**
   * 像素值转为rem
   */
  const px_2_rem = (px) => {
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
  const run_process_when_need_recompute_container_list = (need_pre_process, scroll_obj) => {
    // 需要执行前置进程
    if(!this.matchCtr.match_list_data_sources || !this.matchCtr.match_list_data_sources.length){
      // 如果条件达不到 ，不可以执行主进程 ，或者不需要执行主进程 则 方法终止
      return false
    }

    // 主进程
    // 1. 第一步：数组去重
    this.run_process_when_need_recompute_container_list_step_one_recompute_next_list_mids()
    // 2. 第二步：重新计算 容器的每个高度，还有 所有列表总和的 整体高度 
    this.run_process_when_need_recompute_container_list_step_two_match_list_wrapper_height(scroll_obj)
    // 3. 第三步：重新计算 每个容器 的 top 定位 数值
    this.run_process_when_need_recompute_container_list_step_three_recompute_next_list_container_top_obj(scroll_obj)
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
  const run_process_when_need_recompute_container_list_when_first_load_list = (need_pre_process = true,update_type) => {
    //  更新 赛事列表 进程 综合 控制方法
    this.run_process_when_need_recompute_container_list(need_pre_process,{update_type})
  }
  /** 场景 2： 联赛 折叠
   * 触发更新 赛事列表进程 的 场景
   *  参数说明：      need_pre_process : 需要执行前置进程
   */
  const run_process_when_need_recompute_container_list_when_coolspace_tournament = (need_pre_process = true,invoke_type) => {
    //  更新 赛事列表 进程 综合 控制方法
    this.run_process_when_need_recompute_container_list(need_pre_process,{update_type:invoke_type})
  }
  /**
   * 获取容器滚动距离
   */
  const get_scroll_wrapper_top = (params) => {
    let scroll_top = window.scrollY;
    if(params){
      if(params.scroll_top){
        scroll_top = params.scroll_top;
      }
      if(params.position){
        scroll_top = params.position;
      }
    }
    // 容器滚动距离
    let scroll_splited = this.get_list_scroll_top.split('-');
    if(scroll_splited[0]){
      scroll_top = +scroll_splited[0];
    }
    return scroll_top;
  }
  /**
   * 场景 4： 列表 滚动
   * 触发更新 赛事列表进程 的 场景
   * 重点： 理论上来讲 滚动的时候 不需要走 前置进程  直接调用主进程
   * @param {Boolean} need_pre_process
   */
  const run_process_when_need_recompute_container_list_when_scroll = (need_pre_process = false,params) => {
    //#start region 当窗口滚过一屏后才更新数据         get_list_scroll_top
    let scroll_top = this.get_scroll_wrapper_top(params);
    let delta = Math.abs(scroll_top - this.scrolling_wrapper_top);
    let limit = this.sliding_can_trigger_process_distance;
    if(this.menu_type == 28){
      limit = 400;
    }
    // 阻止用户滚动时频繁切换赛事,scroll_top为0时,需要更新dom高度对象
    if(delta < limit && scroll_top != 0 && (params && !params.force && params.update_type != "standard_simple_change")){
      return;
    }
    this.scrolling_wrapper_top = scroll_top;
    //#end region

    //  更新 赛事列表 进程 综合 控制方法
    this.run_process_when_need_recompute_container_list(need_pre_process,params)
  }
  // 赛事数据源去重，数组 相同的mid 去重
  const run_process_when_need_recompute_container_list_step_one_recompute_next_list_mids = () => {
    // 如果是赛果，不用去重 骚操作
    if(this.menu_type == 28 ) {return}
    //  这个方法只是做简单的 赛事数据源去重，数组去重
    let mid_dict = {};
    let len = this.matchCtr.match_list_data_sources.length;
    for(let i = 0; i < len;i++){
      let match_frame = this.matchCtr.match_list_data_sources[i];
      if(!match_frame){
        continue;
      }
      if(match_frame.mid in mid_dict){
        let old_index = mid_dict[match_frame.mid];
        this.matchCtr.match_list_data_sources.splice(old_index,1);
        i--;
      }
      mid_dict[match_frame.mid] = i;
    }
  }
  // 获取赛事对应的dom显示区域属性
  const get_match_dom_show_property = (i) => {
    let match = this.matchCtr.match_list_data_sources[i];
    // 5分钟玩法，波胆玩法 要展开的行数
    let number_of_bets = 0
    if(!match){
      return {};
    }
    //显示体育类型
    let show_sport_type = i => {
      let flag = false;
      if ([1, 2, 3, 4, 11, 12,28, 30, 3000].includes(+this.menu_type) ||
          (_.get(this.get_current_menu, 'main.menuType') == 28 && _.get(this.get_current_menu, 'sub.menuType') == 29) ) {
        if (i > 0) {
          let p = this.matchCtr.match_list_data_sources[i - 1], c = this.matchCtr.match_list_data_sources[i];
          if (p && c) {
            flag = p.csid !== c.csid;
          }
        } else {
          flag = true;
        }
      } else {
        flag = false;
      }
      if(flag){
        match.show_sport_type = true
      }else{
        match.show_sport_type = false
      }
      return flag;
    };
    //是否显示联赛
    let is_show_league = i => {
      let flag = false;
      // 当前赛事
      let curr = this.matchCtr.match_list_data_sources[i];
      // 虚拟体育没有tid而是tnameCode
      let property_key = "tnameCode";
      if(!curr[property_key]){
        property_key = "tid";
      }
      if (i == 0) {
        flag = true;
      } else {
        // 前一个赛事
        let prev = this.matchCtr.match_list_data_sources[i - 1];
        // 如果显示  赛事未开赛标题， 或者是  上一次和这一次tid 不一样  则显示联赛标题高度
        if (is_show_no_play(i) || curr[property_key] != prev[property_key]) {
          flag = true;
        }
      }
      if(flag){
        match.is_show_league = true
      }else{
        match.is_show_league = false
      }
      return flag;
    };
    //赛事未开赛标题
    let is_show_no_play = i => {
      let result = false;
      // 详情页，或者  非今日串关不显示
      if(this.main_source == 'detail_match_list' || ![3,11].includes(+this.menu_type)){
        return false
      }
      //串关时,日期为今日才显示
      else if(this.menu_type == 11){
        let third_m_id = _.get(this.get_current_menu,'date_menu.field1');
        //串关今日id为0或'0'
        if(third_m_id !== 0 && third_m_id !== '0'){
          return result;
        }
      }
      if(match){
        //如果大于第一个赛事
        if(i > 0){
          let prev_match = this.matchCtr.match_list_data_sources[i - 1]; // 上一个赛事
          //当前赛事是 1:已开赛（滚球）  110:即将开赛  不显示未开赛标题
          //当前赛事是进行中,不显示未开赛标题
          if([1,110].includes(+match.ms)){
            result = false;
          } else if(![1,110].includes(+match.ms) && [1,110].includes(+prev_match.ms)){ //否则当前赛事为未开赛并且上一赛事是进行中则,显示未开赛标题
            result = true;
          }
        }
        //如果是第一个赛事并且是未开赛则显示未开赛标题
        else if(i == 0 && ![1,110].includes(+match.ms)){
          result = true;
        }
      }
      if(result){
        match.is_show_no_play = true
      }else{
        match.is_show_no_play = false
      }
      return result;
    };
    //是否显示次要玩法头部
    let is_show_secondary_head = () => {
      let {cosCorner,cosOvertime,cosPenalty,cosPromotion, cosBold, cosOutright,cosPunish,hpsAdd,cos15Minutes, cos5Minutes} = match;

      let flag = (
          cosCorner ||
          cosOvertime ||
          cosPenalty ||
          cosPromotion ||
          cosBold ||
          cosOutright ||
          cosPunish ||
          cos15Minutes ||
          cos5Minutes ||
          (hpsAdd && hpsAdd.length)
      );
      if(this.get_newer_standard_edition == 1){
        flag = false;
      }
      if(['detail_match_list','home_hot_page_schedule'].includes(this.invok_source)){
        flag = false;
      }
      return flag;
    };
    //显示次要玩法投注项
    let show_secondary_play_list = i => {
      let result = 0;
      if(is_collapse()){
        return result;
      }
      let match = this.matchCtr.match_list_data_sources[i];
      // 次要玩法展开映射
      let mapping = this.get_secondary_unfold_map[match.mid];
      if(mapping){
        let list_play_id = mapping.split('-')[0];
        let status = mapping.split('-')[1];
        // 如果是展开
        if(status == 1){
          result = list_play_id;
          // 如果是波胆玩法，获取 投注项的 数量
          if(result == 18){
            number_of_bets = mapping.split('-')[2];
          }else if(result == 19){
            number_of_bets = mapping.split('-')[2];
            // 时间超过30分钟（含）后
            if (number_of_bets == 4 && match.mst >= 30 * 60) {
              number_of_bets = 3
            }
          }
        }
      }
      // 赛果,精选赛事,简版,首页热门赛事,详情页推荐赛事都不显示次要玩法
      if(['detail_match_list','home_hot_page_schedule'].includes(this.invok_source) ||
          this.menu_type == 28 || this.get_newer_standard_edition == 1 ){
        result = 0;
      }
      if(!is_show_secondary_head()){
        result = 0;
      }
      return result;
    };
    // 是折叠
    let is_collapse = () => {
      let flag = false;
      let collapse_key = this.gen_collapse_key(match);
      if (this.get_collapse_map_match[collapse_key] == 1) {//折叠
        flag = true;
      } else { //展开
        flag = false;
      }
      return flag;
    };
    return {
      mid: match.mid,
      is_show_league: is_show_league(i),
      is_show_secondary_head: is_show_secondary_head(),
      is_collapse: is_collapse(),
      is_show_no_play:is_show_no_play(i),
      show_sport_type:show_sport_type(i),
      show_secondary_play_list:show_secondary_play_list(i),
      menu_type:this.menu_type,
      is_newer_edition:this.get_newer_standard_edition == 1,
      is_show_time_title:this.invok_source == 'home_hot_page_schedule' && match.time_title,
      invok_source:this.invok_source,
      sub_menu_type: this.get_curr_sub_menu_type,
      index:i,
      number_of_bets: number_of_bets,
    };
  }
  /**
   * 更新 赛事列表 进程
   * 2. 第二步：重新计算 容器整体高度 ，此 理论高度  在前或者在后调用 理论上都行
   *    次理论高度 因为采用的是绝对定位， 所以这个高度仅仅影响最下面一页的展示的 空白区域，因此 计算在前在后都不影响
   * ： 备注应该在前计算 ： 例如场景 ： 从 联赛全部折叠了到 展开全部联赛 ， 这种从低到高， 从少到多的 过程
   */
  const run_process_when_need_recompute_container_list_step_two_match_list_wrapper_height = (scroll_obj) => {
    // 只有在列表页才有计算逻辑，节省性能
    if(!["detail_match_list","home_hot_page_schedule"].includes(this.invok_source)){
      //获取赛事与dom高度的映射
      //赛事是否折叠
      this.already_folded = 0
      //赛事与dom高度的映射
      this.mid_dom_height_dict = {}
      // 每一个赛事的高度
      this.match_height_map_list = this.matchCtr.match_list_data_sources.map((match, i) => {
        let obj = this.get_match_dom_show_property(i);
        let r = template_config.get_template_config(obj);
        // 在列表下,第一个元素的偏移量减去0.09rem 因为第一个元素没有玩法标题padingtop
        if(location.hash.includes("match") && i==0){
          r.odd_list_height-=0.11;
        }
        this.mid_dom_height_dict[r.mid] = r;
        return r;//每个赛事占的dom高度和mid映射r
      });
      // 计算每个赛事容器的高度，累加 = 总高度
      let total_height = this.match_height_map_list.reduce((total, map_obj) => {
        let p_total = 0;
        if (typeof total == "number") {
          p_total = total;
        }
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
  const run_process_when_need_recompute_container_list_step_three_recompute_next_list_container_top_obj = (scroll_obj) => {
    // 冠军  或者  电竞冠军 或者   赛果虚拟体育  ，赋值全部数据， 不走下边计算逻辑
    if(this.menu_type == 100 ||
        (this.menu_type == 3000 && _.get(this.get_current_menu, 'date_menu.menuType') == 100) ||
        (this.menu_type == 28 && [1001,1002,1004,1011,1010,1009, 100].includes(this.get_curr_sub_menu_type))
    ) {
      this.matchCtr.setList(this.matchCtr.match_list_data_sources, false);
      return;
    }
    // scroll_top 是 滚动的距离
    let scroll_top = this.get_scroll_wrapper_top(scroll_obj);

    let page_count = 18;
    // 新手版
    if(this.get_newer_standard_edition == 1){
      page_count = 20;
    }
    //赛果虚拟赛狗|赛马 摩托车
    if(this.menu_type == 28){
      if([1002,1011,1010, 1009].includes(this.get_curr_sub_menu_type)){
        page_count = this.matchCtr.match_list_data_sources.length;
      }
      else{
        page_count = 20;
      }
    }
    let current_match_dom_top = 0,   // 可视区域的赛事的top 值  18场
      match_list_length = this.match_height_map_list.length,  // 当前列表数据的总数量  长度
      get_match_total = 0,   // 当前页面的赛事数量
      mid_top_map = {},  // 对应的 赛事id 的  偏移 位置值
      start_rem =  this.px_2_rem(scroll_top) - (2.34 * 5),  // 顶部滚动距离减去  上面5个列表赛事  的距离
      current_screen_match = [];  // 列表页可视区域 赛事的数据
    // 只有在列表页才有计算逻辑，节省性能
    if(!["detail_match_list","home_hot_page_schedule"].includes(this.invok_source)){
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
          let match = this.matchCtr.mid_obj[h_map.mid];
          if (match && match_height > 0) {
            // 列表页赛事的数据
            current_screen_match.push(match);
            get_match_total++;   //赛事容器数量加1
          }
          // 获取赛事对应的dom显示区域属性
          let dom_show_obj = this.get_match_dom_show_property(i);
          // 如果当前折叠 并且 当前赛事 显示联赛，则 -1 操作
          if(dom_show_obj.is_collapse && dom_show_obj.is_show_league){
            if(this.already_folded <= 7){
              get_match_total--;  //赛事容器数量减1，相当于页面可视区域 总数量 page_count 加1个
            }
            this.already_folded++
          }
        }
        current_match_dom_top += match_height;
      }
      // 如果当前赛事折叠超过 8场赛事 并且 高度 大于5.5  走  虚拟滚动 真正的滑动 算法，和上边 aaaaaaa 逻辑一模一样
      if(this.already_folded > 7 && this.match_list_wrapper_height > 5.5){
        this.sliding_can_trigger_process_distance = 600 - (this.already_folded*12)
        current_match_dom_top = 0   // 可视区域的赛事的top 值  18场
        get_match_total = 0   // 当前页面的赛事数量
        mid_top_map = {}  // 对应的 赛事id 的  偏移 位置值
        let current_list_total_length = current_screen_match.length, current_list_total_height = 0 , list_visible_areas_number = 25
        // 计算出 当前可视区域赛事的容器总高度，以rem 计算
        for(let j = 0; j < current_list_total_length; j++){
          let h_map = this.mid_dom_height_dict[current_screen_match[j].mid];
          // 计算出 当前赛事的容器高度，以rem 计算
          current_list_total_height += +this.get_match_dom_height_by_matchdata(h_map)
        }
        let many_distances = this.px_2_rem(scroll_top) - (current_list_total_height/page_count * 7)  // 可视区域  每一场的平均高度 × 7
        current_screen_match = [];  // 列表页可视区域 赛事的数据
        for (let i = 0; i < match_list_length; i++) {
          let h_map = this.match_height_map_list[i];
          let match_height = this.get_match_dom_height_by_matchdata(h_map);
          if (current_match_dom_top >  many_distances) {
            if (get_match_total < list_visible_areas_number) {
              mid_top_map[h_map.mid] = current_match_dom_top;
            } else {
              break;
            }
            let match = this.matchCtr.mid_obj[h_map.mid];
            if (match && match_height > 0) {
              current_screen_match.push(match);
              get_match_total++;   //赛事容器数量加1
            }
          }
          current_match_dom_top += match_height;
        }
      }else{
        if(this.get_newer_standard_edition == 2){
          this.sliding_can_trigger_process_distance = 1000
        }else{
          this.sliding_can_trigger_process_distance = 500
        }
      }
      // H5 列表页显示的 可视区域的  数据源
      this.matchCtr.setList(current_screen_match, false);
    }else{
      // H5 列表页显示的 可视区域的  数据源
      this.matchCtr.setList(this.matchCtr.match_list_data_sources, false);
    }
    // 防止滚动切换赛事时触发赛事红升绿降
    clearTimeout(this.screen_changing_timer);
    this.set_foot_ball_screen_changing(1);
    this.screen_changing_timer = setTimeout(() => {
      this.set_foot_ball_screen_changing(0);
    },500);
    // 赛事对象对应的dom 的 top 值的 映射
    this.set_match_top_map_dict(mid_top_map);
    // 订阅新赛事列表
    if(scroll_obj != 'ciyao_bold'){
      this.subscription();
    }
  }
  // 浏览器得到焦点
  const window_focused_handle = () => {
    this.run_process_when_need_recompute_container_list_when_first_load_list();
  }
  // 容器滚动事件
  const wrapper_scroll_handler = () => {
    // 详情返回后，goto_detail_matchid还未及时清除时，则不响应用户滚动
    if (this.get_goto_detail_matchid) {
      this.scroll_touch_count = 0
    }
    // bug33167兼容iPhone滚动兜底处理
    else if (this.get_allow_short_scroll && typeof this.scroll_touch_count !== 'undefined') {
      this.scroll_touch_count++
      if (this.scroll_touch_count <= 2) {
        clearTimeout(this.match_scroll_timer)
        this.match_scroll_timer = setTimeout(() => {
          this.$refs.match_list_container.scrollTop += 1
        }, 30)
      }else if(this.scroll_touch_count > 10){
        this.scroll_touch_count = undefined
      }
    }
    // 只要滑动触发，就显示骨架屏
    // clearTimeout(this.hide_screen_timer)
    // this.set_hide_skeleton_screen(false)
    // this.hide_screen_timer = setTimeout(()=>{
    //   this.set_hide_skeleton_screen(true)
    // }, 1000)
   // 设置赛事列表容器滚动数据,触发 赛事列表进程 的 场景
    this.set_list_scroll_top_by_target();
  }
  // 批量清除定时器
  const clear_mixin_timer = () => {
    const timer_arr = [
        'requesting_timeout',
        'set_scroll_top_timer1',
        'screen_changing_timer',
        'match_scroll_timer',
    ]

    for (const timer of timer_arr) {
      clearTimeout(this[timer])
      this[timer] = null
    }
  }
}