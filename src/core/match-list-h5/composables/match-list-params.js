/**
 * 列表请求参数  计算逻辑 相关 
 */

import lodash from "lodash"
import {
  get_collect_matches,
  post_match_full_list,
  post_esports_match,
  post_esport_collect,
  get_match_result_api,
  get_virtual_result,
} from "src/api/module/common/index.js";

import UserCtr from 'src/core/user-config/user-ctr.js'
import { MenuData} from "src/output/project/index.js"
import PageSourceData from "src/core/page-source/page-source.js";
import MatchDetailCtr from "src/core/match-detail/match-detail-class.js";
import { ref } from "vue"

// 接口出错时，uid的 字符串
const last_gcuuid = ref('')

// 老逻辑：：TODO 一级 主菜单 main, 二级菜单 sub， 三级菜单 date_menu
// 处于列表页时分流计算
const get_match_params_detail = (params, main_menu_type) => {
  //竞彩足球
  if (MenuData.is_jinzu(main_menu_type)) {
    params.euid = MenuData.get_current_sub_menuid()
    //TODO lodash.get(MenuData.current_menu, 'main.menuId');
  }


  //赛果请求数据接口如果是赛果-->我的,投注type为29否则为28
  if (MenuData.is_results(main_menu_type)) {
    if (lodash.get(MenuData.current_menu, 'sub')) {
      if (lodash.get(MenuData.current_menu, 'sub') == 0) {
        params.type = 29;
      }
      params.euid = MenuData.get_current_sub_menuid() || lodash.get(MenuData.current_menu, 'sub');
    }
  }
  // menuType == 100 电竞的冠军
  if (typeof lodash.get(MenuData.current_lv_3_menu, 'field1') != 'undefined') {
    if (lodash.get(MenuData.current_lv_3_menu, 'menuType') == 100) {
      params.category = 2;
      params.md = '';
    }
    else {
      params.category = 1;
      params.md = lodash.get(MenuData.current_lv_3_menu, 'field1');
    }
  }
  //主菜单不为早盘,赛果,串关,电竞则移除参数的日期
  if (![4, 28, 11, 3000].includes(main_menu_type)) {
    delete params.md;
  }

  //列表的 虚拟体育相关
  if ([1001, 1002, 1004, 1011, 1010, 1009].includes(+params.euid)) {
    let startTime = +params.md;
    const m_hour = 24 * 60 * 60 * 1000; // 24小时的毫秒数
    let endTime = startTime + (m_hour - 1000);
    params = {
      sportType: params.euid,
      startTime,
      endTime,
      isVirtualSport: 1,
      page: {
        size: 100,
        current: 1
      }
    };
    // 如果是在 赛果页面的 虚拟体育相关的 页面，则添加 tournamentId  参数
    if (MenuData.is_results()) {
      params.tournamentId = lodash.get(MenuData.get_level_four_menu(), 'menuId');
      //虚拟体育期号
      params.batchNo = PageSourceData.list_query_other_params.batchNo;
    }

  }

  //如果是在筛选的过程中
  if (PageSourceData.is_in_filtering()) {
    // console.error("如果是在筛选的过程中")
    // 如果筛选不是全部，并且 当前主菜单 等于(上一次 选择的主菜单，或者上一次选中的主菜单 不是 今日，早盘，串关），则执行下边代码块

    let filter_list = PageSourceData.list_query_other_params.filter_list
    if (filter_list != 'all') {
      // 过滤出 tid（联赛id）
      let current_tids = [];
      for (let f_tid in filter_list) {
        current_tids.push(f_tid)
      }
      if (current_tids.length) {
        //虚拟体育赛果
        if (MenuData.menu_type == 28 && [1001, 1002, 1004, 1011, 1010, 1009].includes(MenuData.get_curr_sub_menu_type())) {
          params.tournamentId = current_tids.join(",");
        } else {
          // 如果是今日，早盘，串关
          if ([3, 4, 11].includes(+MenuData.menu_type)) {
            params.tid = current_tids.join(",");
          } else { //滚球->全部多选球类,冠军
            params.tid = current_tids.join(",");
          }
        }
      }
    }
  }

  if (main_menu_type) {
    // 主菜单 == 3000 时 竞技
    if (MenuData.is_esports(main_menu_type)) {
      // 电竞保存csid,否则不用保存csid
      params.csid = MenuData.get_current_esport_csid();


    }

  }

  params.hpsFlag = 0; // match中 hpsFlag 都为0 除开冠军或电竞冠军
  //赛事列表冠军或者电竞冠军/赛果不需要hpsFlag
  if (MenuData.get_mm_is_champion() || main_menu_type == 28) {
    delete params.hpsFlag;
  }

  return params;
}

const get_detail_params_by_invoke_source = (params, main_menu_type) => {
  //第一步根据路由名判断,第二步根据invoke_source或菜单进行分流 清晰化来龙去脉
  // 如果是在首页中
  if (PageSourceData.page_source.includes('home')) {

    if (MenuData.hot_tab_menu) { // 其他菜单
      //  菜单id
      params.euid = MenuData.hot_tab_menu.menuId;
      //  排序
      params.sort = 2;
      // 菜单类型
      params.type = MenuData.hot_tab_menu.menuType;
      // 联赛id
      params.tid = MenuData.hot_tab_menu.field2;
    }
    if ([100, 101, 102, 103].includes(+lodash.get(MenuData.hot_tab_menu, 'field1'))) {
      // 获取 csid
      params.csid = MenuData.hot_tab_menu.field1;
    }
    // 如果是在首页中的精选
    if (lodash.get(MenuData.hot_tab_menu, 'index') == 0) {
      params.sort = 2; // todo 电竞的sort首页中都是一
    }

  }
  // 赛果详情页 或者 详情页仅请求两个参数
  else if (['result_details', 'match_result', 'category'].includes(PageSourceData.page_source)) {
    params = {
      sportId: MatchInfoCtr.get_csid(),
      cuid: params.cuid
    }
  }
  // 如果是在列表中
  else if (PageSourceData.page_source.includes('matchList')) {
    // 处于列表页时的详细计算
    params = get_match_params_detail(params, main_menu_type)
  }

  return params;
}

const get_base_params = (main_menu_type) => {
  return {
    cuid: UserCtr.get_uid(),
    euid: main_menu_type ?? MenuData.get_current_sub_menuid(),
    // 一级菜单筛选类型 1滚球 2 即将开赛 3今日赛事 4早盘 11串关
    // type: lodash.get(MenuData, 'current_lv_1_menu.mi'),
    type: 1,
    //排序	 int 类型 1 按热门排序 2 按时间排序
    // sort: PageSourceData.sort_type,50093
    sort: UserCtr.sort_type,
    //标准版和简版 1为新手版  2为标准版
    device: ['', 'v2_h5', 'v2_h5_st'][UserCtr.standard_edition]
  };
}

// todo 重新方法临时保存,沟通后再行修改 统一入口
const get_match_list_params_all = () => {
  let params = null;
  // 一级菜单筛选类型 1滚球 2 即将开赛 3今日赛事 4早盘 11串关
  let main_menu_type = +MenuData.get_menu_type(); //菜单类型
  // 第一步 计算最基础参数
  params = get_base_params(main_menu_type);
  //第二步,传入第一步获得的参数 按照首页/详情/列表进行分流处理 其中列表中会第二次进行分流处理
  params = get_detail_params_by_invoke_source(params, main_menu_type);
  //附加当前请求的 gcuuid 全局检查
  let gcuuid = uid()
  params.gcuuid = gcuuid

  last_gcuuid.value = gcuuid

  // 第四步 返回前三步计算的params
  return params;
}



// 赛果下赛事列表 api适配处理
const result_api_handle = (result, params) => {
  // 虚拟体育赛果 足球 赛狗 赛马 摩托车 泥地摩托车
  if ([1001, 1002, 1004, 1009, 1010, 1011].includes(+params.sportType)) {
    result.api_handle = get_virtual_result;
  } else if (10000 == +lodash.get(MenuData.current_menu, 'sub')) {
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
  // console.error('赛果加载数据',result)
  return result
}

/**
 * 获取数据api方法
 * @returns Function 接口调用方法 api_handle  要调用的 接口
 */
const get_matchs_api_func = () => {
  // 接口请求前置处理，接口参数处理
  let params = get_match_list_params_all();

  let result = {
    api_handle: null,
    api_params: params
  };
  const menu_type = MenuData.get_menu_type()
  // 竟足赛事固定uid
  if (menu_type == 30) {
    result.api_params.euid = '409'
  }
  //收藏赛事列表
  if (PageSourceData.is_show_favorite_list()) {
    if (3000 == menu_type) {
      result.api_handle = post_esport_collect;
    } else {
      result.api_handle = get_collect_matches;
    }
    if (MenuData.menu_type == 28 && PageSourceData.page_source != "detail_match_list") {
      result = result_api_handle(result, params)
    }

  }
  //精选赛事
  else if (PageSourceData.page_source == "detail_match_list") { // todo 重要该参数详情页处理
    result.api_handle = get_result_match_care_list;
  }
  //赛果
  else if (menu_type == 28) {
    result = result_api_handle(result, params)
  }

  //首页热门——赛程 todo 此代码中参数计算整合到参数方法中
  else if (PageSourceData.page_source == "home_hot_page_schedule") {

    // 如果首页热门有状态管理值，并且不是 精选页面
    if (!lodash.isEmpty(MenuData.hot_tab_menu) && lodash.get(MenuData.hot_tab_menu, 'index') != 0) {
      // 如果是电竞
      if ([100, 101, 102, 103].includes(+lodash.get(MenuData.hot_tab_menu, 'field1'))) {
        result.api_handle = post_esports_match;
        result.api_axios_flg = 'post_esports_match';
      } else if (result.api_params.euid) {
        // 滚球，今日，早盘，竟足 列表接口
        result.api_handle = post_match_full_list;
        result.api_axios_flg = 'post_match_full_list';
      }
    }
    // 如果是 精选赛事 已拆分到热门文件内
    // else if (lodash.get(MenuData.hot_tab_menu, 'index') == 0) {
    //   result.api_handle = get_match_home_page_handpick;
    // }
  }
  //滚球今日早盘串关等获取赛事列表
  else {
    // 电竞
    if (MenuData.get_menu_type() == 3000) {
      // 如果是 收藏
      if (PageSourceData.is_show_favorite_list()) {
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



export default {
  last_gcuuid,
  get_base_params,
  get_matchs_api_func,
  get_match_list_params_all
}