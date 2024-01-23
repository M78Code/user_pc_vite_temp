/*
 * @Author: Cooper
 * @Date: 2020-08-12 17:13:55
 * @Description: 详情全局设置
 */
import { reactive, ref, toRefs, onUnmounted, watch } from "vue";
// import { mapGetters, mapActions, mapMutations } from "vuex";
// api文件
import { api_details, api_common } from "src/api/index";
import lodash from "lodash";
import details from "src/core/match-detail/match-detail-pc/match-detail";
import video from "src/core/video/video.js";
import menu_config from "src/core/menu-pc/menu-data-class.js";
import { useRouter, useRoute } from "vue-router";
import filterHeader from "src/core/filter-header/filter-header.js";
import { MatchDetailCalss }  from "src/output/module/project-single.js"; 
import { MenuData } from 'src/output/project/index.js'
import UserCtr from "src/core/user-config/user-ctr.js";
import {LayOutMain_pc} from "src/output/project/index.js";
import GlobalSwitchClass  from "src/core/global/global.js";
import SearchPCClass  from "src/core/search-class/seach-pc-calss.js";
import {
  useMittEmit,
  MITT_TYPES,
} from "src/core/mitt/index.js";

//投注类
import BetData from "src/core/bet/class/bet-data-class.js";
export const useGetGlobal = ({  back_to }) => {
  const route = useRoute();
  const router = useRouter();
  const state = reactive({
    latest_match_params_pre: "",
    default_select_all: true,
  });
  // 左侧详情参数
  const details_params = ref(MatchDetailCalss.params)
 //播放类型
   const play_media = ref(MatchDetailCalss.play_media)
  /**
   * @description: 监听详情类版本号
   * @return {*}
   */  
  watch(
    () => MatchDetailCalss.details_data_version.version,
    (val) => {
      if (val) {
        details_params.value = MatchDetailCalss.params
        play_media.value = MatchDetailCalss.play_media
      }
    },
    { deep: true }
  )
  
  // 获取当前盘口类型
  const cur_odd = ref(BetData.cur_odd)
   // 是否是单关投注
   const is_bet_single = ref(BetData.is_bet_single)
   // 单关 是否正在处理投注
   const is_single_handle = ref(BetData.is_single_handle)
  // 是否正在处理投注
  const is_handle = ref(BetData.is_handle)
    
  /**
   * @description: 监听投注类版本号
   * @return {*}
   */  
  watch(
      () => BetData.bet_data_class_version.value,
      (val) => {
        if (val) {
          cur_odd.value = BetData.cur_odd
          is_bet_single.value = BetData.is_bet_single
          is_single_handle.value = BetData.is_single_handle
          is_handle.value = BetData.is_handle
        }
      },
      { deep: true }
  ) 
   // 赛事列表排序 1:按联赛排序 2:按时间排序
  const match_sort =  ref(GlobalSwitchClass.match_sort)
  /*
  ** 监听GlobalSwitchClass的版本号  获取最新的全局状态
  */
  watch(
    () => GlobalSwitchClass.global_switch_version.version,
    (val) => {
      if (val) {
        match_sort.value = GlobalSwitchClass.match_sort
      }
    },
    { deep: true }
   );   
    
   // 获取当前菜单类型
   const  cur_menu_type = ref(MenuData.cur_menu_type) 
  /*
    ** 监听菜单类的版本号
  */
  watch(
    () => MenuData.menu_data_version.value,
    (val) => {
      if (val) {
        cur_menu_type.value = MenuData.cur_menu_type
      }
    },
    { deep: true }
   );  
   
  // 登录是否失效
  const is_invalid = ref(UserCtr.is_invalid) 
  // 获取用户信息      
  const get_user = ref(UserCtr.get_user)  
  const get_uid = ref(UserCtr.get_uid());       
  watch(()=>UserCtr.user_version,(val)=>{
    if(val){
      get_user.value =UserCtr.get_user()
      get_uid.value = UserCtr.get_uid()
      is_invalid.value = UserCtr.is_invalid
    }
   })     
  // 获取联赛关键字 
  const related_keyword = ref(SearchPCClass.related_keyword) 
  /*
  **监听筛选类的版本号
  */
  watch(
    () => SearchPCClass.update_time.value,
    (val) => {
      if (val) {
        related_keyword.value = SearchPCClass.related_keyword
      }
    },
    { deep: true }
  );  
  
  // 选择的筛选数据
  const filter_select_obj = ref(filterHeader.filter_select_obj) 
  // 获取选中的赛事数量(列表右上角赛选功能)
  const checked_count = ref(filterHeader.checked_count) 
  /*
  **监听筛选类的版本号
  */
  watch(
    () => filterHeader.filter_header_version.value,
    (val) => {
      if (val) {
        filter_select_obj.value = filterHeader.filter_select_obj
        checked_count.value = checked_count.checked_count
      }
    },
    { deep: true }
  );  

  // 获取当前页路由信息
  const layout_cur_page = ref(LayOutMain_pc.layout_current_path);
  /*
  **监听布局类的版本号
  */
  watch(
    () => LayOutMain_pc.layout_version,
    (val) => {
      if (val) {
        layout_cur_page.value = LayOutMain_pc.layout_current_path
      }
    },
    { deep: true }
  );

  // 监听状态变化
  // let un_subscribe = store.subscribe(() => {
  //   let state_data = store.getState();
  //   match_sort.value = state_data.globalReducer.match_sort;
  //   play_media.value = state_data.matchesReducer.play_media;
  //   related_keyword.value = state_data.searchReducer.related_keyword;
  // });

  // onUnmounted(() => {
  //   un_subscribe();
  // });
  /**
   * 设置赛事列表/详情选中赛事
   * @param  {number} remove_mid - 被移除赛事的ID
   * @return {undefined} undefined
   */
  const mx_autoset_active_match = (params = { mid: 0 }) => {
    let { name: route_name, params: cur_params } = route;
    let return_status =
      (route_name === "video" && [3, 4, 5].includes(+cur_params.play_type)) ||
      (route_name === "details" &&
        ["studio", "topic", "anchor"].includes(play_media.value.media_type)) ||
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
       tid = details_params.value.tid;
       csid = details_params.value.csid;
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
      euid: menu_config.get_mid_for_euid(menu_config.menu_current_mi),
      md,
      csid,
      tid,
      sort: match_sort.value,
      keyword: related_keyword.value.substr(5),
      cuid: get_uid.value,
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
          ? api_common.get_detail_video(_params)
          : api_details.post_fetch_list_latest_match(_params);

      api.then(({ data }) => {
        if (!details.auto_swich_match) return;
        let { mid = -1, csid=sportId, tid } = data || {};
        // 详情时重载页面
        if (cur_page == "details" || cur_page == "video") {
          if (mid && mid != -1) {
            if (cur_page == "details") {
              router.replace({
                name: "details",
                params: {
                  mid, 
                  tid,
                  csid,
                },
              });
                    //mid更新触发
            useMittEmit(MITT_TYPES.EMIT_SWITCH_MATCH, {
              mid, 
              tid,
              csid,
            }) 
            }
            // 大视频页面 切换一场有视频的赛事
            else if (cur_page == "video") {
              video.match_close(null,router);
            }
          } else {
            if (lodash.isFunction(back_to)) {
              back_to(false);
            }
          }
          return;
        }
 
        // 切换右侧赛事
        let playId = details_params.value.play_id;
        MatchDetailCalss.set_match_details_params({
          mid,
          tid,
          sportId,
          playId,
          media_type: "auto",
        })
      });
    }
  };

  //     /**
  //      * 格式化选择的联赛
  //      * @return {string} 以 , 号分隔的联赛ID
  //      */
  const mx_filter_select_ids = () => {
    return filterHeader.filter_select_obj.join(","); //TODO
  };

  return {
    mx_autoset_active_match,
  };
};
