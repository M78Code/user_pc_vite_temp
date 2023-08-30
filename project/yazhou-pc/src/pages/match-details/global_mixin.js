/*
 * @Author: Cooper
 * @Date: 2020-08-12 17:13:55
 * @Description: 详情全局设置
 */
import { reactive,ref, toRefs, onUnmounted } from "vue";
// import { mapGetters, mapActions, mapMutations } from "vuex";
// api文件
import { api_details } from "src/api/index";
import lodash from "lodash";
import details from "src/core/match-detail-pc/match-detail";
import video from "src/core/video/video.js";
import menu_config from "src/core/menu-pc/menu-data-class.js";
import { useRouter,useRoute } from "vue-router";
import store from "src/store-redux/index.js";

export const useGetGlobal = ({ details_params, back_to }) => {

  const route = useRoute();
const router = useRouter();
  const state = reactive({
    latest_match_params_pre: "",
    default_select_all: true,
  });

  const store_state = store.getState();

  const get_uid = UserCtr.get_uid();
    // 获取当前页路由信息
  const layout_cur_page = ref(store_state.layoutReducer.layout_cur_page);
  const filter_select_obj = ref(store_state.filterReducer.filter_select_obj); // 选择的筛选数据
  // 获取当前菜单类型
  const cur_menu_type = ref(store_state.menuReducer.cur_menu_type);
  // 赛事列表排序 1:按联赛排序 2:按时间排序
  const match_sort = ref(store_state.globalReducer.match_sort);
    // //播放类型
    const play_media = ref(store_state.matchesReducer.play_media);

    
 
// 保存联想搜索关键字
  const related_keyword =  ref(store_state.searchReducer.related_keyword);

  // 监听状态变化
  let un_subscribe = store.subscribe(() => {
   let state_data = store.getState();
    layout_cur_page.value = state_data.layoutReducer.layout_cur_page;
    filter_select_obj.value = state_data.filterReducer.filter_select_obj;
    cur_menu_type.value = state_data.menuReducer.cur_menu_type;
    match_sort.value = state_data.globalReducer.match_sort;
    play_media.value = state_data.matchesReducer.play_media
    related_keyword.value = state_data.searchReducer.related_keyword
  });

  onUnmounted(() => {
    un_subscribe();
  });

  /**
   * 设置赛事列表/详情选中赛事
   * @param  {number} remove_mid - 被移除赛事的ID
   * @return {undefined} undefined
   */
  const mx_autoset_active_match = (params = { mid: 0 }) => {
    console.log(1111111111111111,menu_config)
    let { name: route_name, params: cur_parmas } = route;
    let return_status =
      (route_name === "video" && [3, 4, 5].includes(+cur_parmas.play_type)) ||
      (route_name === "details" &&
        ["studio", "topic", "anchor"].includes(
          play_media.value.media_type
        )) ||
      menu_config.is_esports();
    // 电竞不用调自动切右侧接口
    if (return_status) {
      return;
    }

    /** 非冠军联赛筛选 不调用右侧切换接口 ***********************/
    // 模板 ID
    let match_tpl_number = menu_config.get_match_tpl_number();

    //非 冠军
    if (match_tpl_number == 18) {
      let tid = mx_filter_select_ids();

      // 是联赛筛选
      if (tid) {
        return false;
      }
    }

    details.auto_swich_match = true;
    let { mid: remove_mid, tid } = params;
    let { cur: cur_page, from: from_page } = layout_cur_page.value;

    // 查找参数:1赛事列表，2现场滚球盘，3赛事筛选，4赛事搜索，如果不传，默认赛事列表
    let sm = 1;
    if (cur_page == "details" && cur_menu_type.value.type_name == "play") {
      sm = 2;
    } else if (cur_page == "search" || from_page == "search") {
      sm = 4;
    } else if (mx_filter_select_ids()) {
      sm = 3;
    }

    let csid = 0;

    if (cur_page == "details") {
      let { tid: _tid, csid: _csid } = route.params;
      let { tid, csid } = details_params;
      if (_tid) {
        tid = _tid;
        csid = _csid;
      } else {
        tid = tid;
        csid = csid;
      }
    } else {
      tid = mx_filter_select_ids() || tid;
      csid = csid;
    }

    let md = "";
    if (["early"].includes(cur_menu_type.type_name)) {
      md = menu_config.match_list_api_config.match_list?.params.md;
    }

    /** 自动选择 */
    let _params = {
      sm,
      euid: menu_config.match_list_api_config?.match_list.params?.euid,
      md,
      csid,
      tid,
      sort: match_sort.value,
      keyword: related_keyword.value.substr(5),
      cuid: get_uid,
      mid: remove_mid,
    };

    // 如果是聚合冠军页面
    if (cur_menu_type.value.type_name == "winner_top") {
      _params.euid = "";
      delete _params.tid;
      delete _params.keyword;
      delete _params.md;
      delete _params.mid;
    }

    // 获得当前的模板ID
    let orpt = menu_config.get_match_tpl_number();
    if (orpt) {
      _params.orpt = orpt;
    }

    let latest_match_params_cur = JSON.stringify({
      ..._params,
      time: Date.now(),
    });
    // 防止同一请求连续多次发送
    if (latest_match_params_cur != state.latest_match_params_pre) {
      state.latest_match_params_pre = latest_match_params_cur;

      let api =
        cur_page == "details"
          ? api_details.get_fetch_detail_latest_match(_params)
          : api_details.post_fetch_list_latest_match(_params);

      api.then(({ data }) => {
        if (!details.auto_swich_match) return;
        let { mid = -1, csid: sportId, tid } = lodash.get(data, "data") || {};
        // 详情时重载页面
        if (cur_page == "details" || cur_page == "video") {
          if (mid && mid != -1) {
            if (cur_page == "details") {
              router.push({
                name: "details",
                params: {
                  mid,
                  tid,
                  csid: sportId,
                },
              });
            }
            // 大视频页面 切换一场有视频的赛事
            else if (cur_page == "video") {
              video.match_close();
            }
          } else {
            if (lodash.isFunction(back_to)) {
              // back_to(false);
            }
          }
          return;
        }

        // 切换右侧赛事
        let playId = details_params.play_id;
        store.dispatch("matchesReducer/SET_MATCH_DETAILS_PARAMS", {
          mid,
          tid,
          sportId,
          playId,
          media_type: "auto",
        });
      });
    }
  };

  //     /**
  //      * 格式化选择的联赛
  //      * @return {string} 以 , 号分隔的联赛ID
  //      */
  const mx_filter_select_ids = () => {
    return filter_select_obj.value.join(","); //TODO
  };

  return {
    mx_autoset_active_match,
  };
};
 