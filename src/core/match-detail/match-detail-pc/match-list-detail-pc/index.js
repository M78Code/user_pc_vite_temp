import PageSourceData from "src/core/page-source/page-source.js";
import { MatchDetailCalss }  from "src/output/module/project-single.js";
import UserCtr from "src/core/user-config/user-ctr.js";
import { api_details, api_common } from "src/api/index";
/**
 * PC   列表 和 详情  之间的 数据中间件 
 * 
 * 1. 列表跳转 详情的 ：
 *   ==》跳转详情之前 
     逻辑块 A  {
 *      ==》调用列表数据仓库 读取当前mid 的 mid_obj
 *      ==》直接设置 详情数据仓库 set_list([obj])
      }
 *   ==》跳转详情
 * 
 * 
 * 2.  详情跳转列表 
 *          赛事已结束： {
 *          ==> 拉取一次元数据 ，菜单和 列表队列映射关系  
 *          }
 *          赛事没有结束：{
 *            不用去数据同步
 *            ===》读取之前存的 来源菜单 来源页面 
 *            ===》调用菜单那边的方法  设置 要用的菜单 
 *            ===》切路由 
 *            ===》列表走自己的 整体逻辑
 *           
 *          }
 * 
 *  3.在列表内 ：
 *    
 *      右侧详情 ：
 *           ==》点击列表 同步过去的 赛事   [逻辑块 A] 
 *           
 *  
 * 需要存储：
 *  1. 从哪里来  ， （为了 知道 往哪里返回）  
 * 
 * 
 */

//

/**
 *
 * 假设现在列表内点击某场赛事   现在需要进详情 页面
 *
 * 步骤：
 * 1. set_back_to_source_params
 * 2. set_params
 * 3. init_detail_form_list
 * 4. 路由跳转
 *
 *
 *
 * 假设现在列表内点击某场赛事   现在显示右侧详情
 * 步骤：
 * 1.set_params
 * 2.init_detail_form_list
 *
 *
 *
 * 列表内右侧自动切
 * 详情页面自动切  可能列表内么有这个赛事 ，但是元数据一定有 ,如果没有 则： {mid}
 * 1.set_params
 * 2.拿元数据组装 mid 基础信息对象
 * 3.init_detail_form_base_data
 *
 *
 *
 *
 *
 */

class MatchListDetailMiddleware {
  constructor() {
    // 前一个 详情 赛事ID
    //当前要设置的 最新的 ，或者 就是当前显示的 赛事详情的 赛事 ID

    // vx_set_vr_params

    this.init();
  }

  init() {
    //VR  详情的 参数
    this.vr_params = {};
    //电竞   详情的 参数
    this.dianjing_params = {};
    //常规赛事 详情的参数
    this.common_params = {};
    //当前详情 赛事类型  : vr  dianjing  common
    this.match_category = "";
    // 详情进入列表场景下：返回来源列表页面必须参数
    this.back_to_list_params = {};
  }

  /**
   * 设置参数
   * @param {*} param
   */
  set_params(param) {
    let { match_category } = param;

    if (match_category) {
      if (match_category == "vr") {
        this.set_vr_params(param);
      } else if (match_category == "dianjing") {
        this.set_dianjing_params(param);
      } else if (match_category == "common") {
        this.set_common_params(param);
      }
    }
  }

  /**
   * 设置 常规赛事 详情的参数
   */
  set_common_params(param) {
    this.common_params = param;
    init_detail_form_list(param)
  }

  /**
   * 设置 电竞   详情的 参数
   */
  set_dianjing_params(param) {
    this.dianjing_params = param;
  }

  /**
   * 设置  VR  详情的 参数
   */
  set_vr_params(param) {
    if (param.csid == 1001) {
      param.id = param.tid + (param.batchNo || "");
    } else {
      param.id = param.tid + (param.mid || "");
    }
    this.vr_params = param;
  }

  /**
   * 列表 数据  初始化详情数据  
   * @param {*} params
   */
  init_detail_form_list(params) {
    let { MatchDataWarehouse_source, MatchDataWarehouse_target, mid } = params;
    // 读取 来源数据仓库 赛事基础信息
    let mid_data = MatchDataWarehouse_source.mid_obj[`${mid}_`];
    // 写入 目标数据仓库 赛事基础信息
    MatchDataWarehouse_target.set_match_details(mid_data);
  }

  /**
   * 拿元数据组装 mid 基础信息对象
   * @param {*} mid
   */
  init_detail_form_base_data(params) {
    let { MatchDataWarehouse_target, mid } = params;

    // 从 元数据 拿基础信息
    let mid_obj = { mid };

    // 写入 目标数据仓库 赛事基础信息
    MatchDataWarehouse_target.set_match_details(mid_obj);
  }

  /**
   * 列表进入详情的 返回参数留存
   * @param {*} params
   */
  set_back_to_source_params(params) {
    //解构是从来哪里来的跳转参数
    this.back_to_source_params = params;
    this.set_params(params)
  }

  /**
   * 设置赛事列表/详情选中赛事
   * @param  {number} remove_mid - 被移除赛事的ID
   * @return {undefined} undefined
   */
  mx_autoset_active_match(params = { mid: 0 }) {
    let { name: route_name, params: cur_params } = this.$route;

    let return_status =
      (route_name === "video" && [3, 4, 5].includes(+cur_params.play_type)) ||
      (route_name === "details" &&
        ["studio", "topic", "anchor"].includes(
          this.vx_play_media.media_type
        )) ||
      $menu.menu_data.is_esports;
    // 电竞不用调自动切右侧接口
    if (return_status) {
      return;
    }

    /** 非冠军联赛筛选 不调用右侧切换接口 ***********************/
    // 模板 ID
    let match_tpl_number = $menu.menu_data.match_tpl_number;

    //非 冠军
    if (match_tpl_number == 18) {
      let tid = this.mx_filter_select_ids();

      // 是联赛筛选
      if (tid) {
        return false;
      }
    }

    details.auto_swich_match = true;
    let { mid: remove_mid, tid } = params;

    let { page_source, from_page_source } = PageSourceData;

    // 查找参数:1赛事列表，2现场滚球盘，3赛事筛选，4赛事搜索，如果不传，默认赛事列表
    let sm = 1;
    if (
      page_source == "details" &&
      MenuData.cur_menu_type.type_name == "play"
    ) {
      sm = 2;
    } else if (page_source == "search" || from_page_source == "search") {
      sm = 4;
    } else if (this.mx_filter_select_ids()) {
      sm = 3;
    }

    let csid = 0;

    if (page_source == "details") {
      let { tid: _tid, csid: _csid } = this.$route.params;
      if (_tid) {
        tid = _tid;
        csid = _csid;
      } else {
        tid = this.vx_details_params.tid;
        csid = this.vx_details_params.csid;
      }
    } else {
      tid = this.mx_filter_select_ids() || this.vx_details_params.tid;
      csid = this.vx_details_params.csid;
    }

    let md = "";
    if (["early"].includes(MenuData.cur_menu_type.type_name)) {
      md = $menu.match_list_api_params.md;
    }

    /** 自动选择 */
    let _params = {
      sm,
      euid: $menu.match_list_api_params.euid,
      md,
      csid,
      tid,
      sort: this.vx_match_sort,
      keyword: this.vx_related_keyword.substr(5),
      cuid: UserCtr.get_uid(),
      mid: remove_mid,
    };

    // 如果是聚合冠军页面
    if (MenuData.cur_menu_type.type_name == "winner_top") {
      _params.euid = "";
      delete _params.tid;
      delete _params.keyword;
      delete _params.md;
      delete _params.mid;
    }

    // 获得当前的模板ID
    let orpt = $menu.menu_data.match_tpl_number;
    if (orpt) {
      _params.orpt = orpt;
    }

    let latest_match_params_cur = JSON.stringify({
      ..._params,
      time: Date.now(),
    });
    // 防止同一请求连续多次发送
    if (latest_match_params_cur != this.latest_match_params_pre) {
      this.latest_match_params_pre = latest_match_params_cur;

      let api =
        page_source == "details"
          ? api_common.get_detail_video(_params)
          : api_details.post_fetch_list_latest_match(_params);

      api.then(({ data }) => {
        if (!details.auto_swich_match) return;

        let { mid = -1, csid: sportId, tid } = _.get(data, "data") || {};
        // 详情时重载页面
        if (page_source == "details" || page_source == "video") {
          if (mid && mid != -1) {
            if (page_source == "details") {
              this.$router.push({
                name: "details",
                params: {
                  mid,
                  tid,
                  csid: sportId,
                },
              });
            }
            // 大视频页面 切换一场有视频的赛事
            else if (page_source == "video") {
              video.match_close(null, this.$router);
            }
          } else {
            if (_.isFunction(this.back_to)) {
              this.back_to(false);
            }
          }
          return;
        }

        // 切换右侧赛事
        let playId = this.vx_details_params.play_id;
        MatchDetailCalss.set_match_details_params({
          mid,
          tid,
          sportId,
          playId,
          media_type: "auto",
        })
      });
    }
  }
}
export default new MatchListDetailMiddleware()
