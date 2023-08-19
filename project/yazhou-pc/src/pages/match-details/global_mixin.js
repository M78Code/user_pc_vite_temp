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

const route = useRoute();
const router = useRouter();
export const useGetGlobal = ({ details_params, back_to }) => {
  const state = reactive({
    latest_match_params_pre: "",
    default_select_all: true,
  });

  const store_state = store.getState();
  const layout_cur_page = ref(store_state.layoutReducer.layout_cur_page);
  const filter_select_obj = ref(store_state.filterReducer.filter_select_obj); // 选择的筛选数据
  // 获取当前菜单类型
  const cur_menu_type = ref(store_state.menuReducer.cur_menu_type);
  // 赛事列表排序 1:按联赛排序 2:按时间排序
  const match_sort = ref(store_state.globalReducer.match_sort);

  // 监听状态变化
  let un_subscribe = store.subscribe(() => {
   let state_data = store.getState();
    layout_cur_page.value = state_data.layoutReducer.layout_cur_page;
    filter_select_obj.value = state_data.filterReducer.filter_select_obj;
    cur_menu_type.value = state_data.menuReducer.cur_menu_type;
    match_sort.value = state_data.globalReducer.match_sort;
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
    let { name: route_name, params: cur_parmas } = route;
    let return_status =
      (route_name === "video" && [3, 4, 5].includes(+cur_parmas.play_type)) ||
      (route_name === "details" &&
        ["studio", "topic", "anchor"].includes(
          this.vx_play_media.media_type
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
    let { cur: cur_page, from: from_page } = vx_layout_cur_page.value;

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
      md = menu_config.match_list_api_params.md;
    }

    /** 自动选择 */
    let _params = {
      sm,
      euid: menu_config.match_list_api_params.euid,
      md,
      csid,
      tid,
      sort: match_sort.value,
      keyword: this.vx_related_keyword.substr(5),
      cuid: this.vx_get_uid,
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
              back_to(false);
            }
          }
          return;
        }

        // 切换右侧赛事
        let playId = details_params.play_id;
        store.dispatch("set_match_details_params", {
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

// export default {
//   data() {
//     return {
//       latest_match_params_pre: "",
//       default_select_all:true,
//     }
//   },
//   computed: {
//     ...mapGetters({
//       // 获取当前页路由信息
//       vx_layout_cur_page: "get_layout_cur_page",
//       // 获取当前盘口类型
//       vx_cur_odd: "get_cur_odd",
//       // 赛事列表排序 1:按联赛排序 2:按时间排序
//       vx_match_sort: "get_match_sort",

//       // 左侧详情参数
//       vx_details_params: "get_match_details_params",
//       // 登录是否失效
//       vx_get_is_invalid: "get_is_invalid",
//       // 获取用户信息
//       vx_get_user: "get_user",
//       // 获取用户uid
//       vx_get_uid: "get_uid",
//       // 获取联赛关键字
//       vx_related_keyword: "get_related_keyword",

//       // 是否是单关投注
//       is_bet_single: 'is_bet_single',
//       vx_get_is_single_handle: "get_is_single_handle", // 单关是否正在处理
//       vx_get_is_handle: "get_is_handle", // 串关是否正在处理
//       // 获取选中的赛事数量(列表右上角赛选功能)
//       vx_get_checked_count: "get_checked_count",
//       //播放类型
//       vx_play_media: "get_play_media",
//     })
//   },
//   methods: {
//     ...mapMutations({
//       // 赛事详细参数（赛事/联赛/球类/直播类型）
//       vx_set_match_details_params: "set_match_details_params",
//     }),
//     ...mapActions({
//       // 设置当前赔率
//       vx_set_cur_odd: "set_cur_odd",
//       // 赛事列表排序 1:按联赛排序 2:按时间排序
//       vx_set_match_sort: "set_match_sort",
//       // 清空用户信息
//       vx_clear_user: "clear_user",
//       // 获取选中的赛事数量(列表右上角赛选功能)
//       vx_set_checked_count: "set_checked_count"
//     }),
//     get_full_sr_url(match) {
//       return details.get_full_sr_url(match)
//     },
//     // sr 分析数据点击跳转
//     sr_click_handle(match, type) {
//       if (type == 'details') {
//         // 发送埋点事件
//         this.$utils.send_zhuge_event("PC_情报分析");
//       }else if(type == 1){
//         this.$utils.send_zhuge_event("PC_热门推荐_赛事分析点击");
//       }
//       details.sr_click_handle(match)
//     },
//     /**
//      * 格式化选择的联赛
//      * @return {string} 以 , 号分隔的联赛ID
//      */
//     mx_filter_select_ids() {
//       return this.vx_filter_select_obj.join(",");
//     },

//     // /**
//     // * 设置赛事列表/详情选中赛事
//     // * @param  {number} remove_mid - 被移除赛事的ID
//     // * @return {undefined} undefined
//     // */
//     // mx_autoset_active_match(params = { mid: 0 }) {
//     //   let {name:route_name,params:cur_parmas} = this.$route
//     //   let return_status = (route_name ==='video' && [3,4,5].includes(+cur_parmas.play_type))  || (route_name ==='details'  && ['studio','topic','anchor'].includes(this.vx_play_media.media_type)) || $menu.menu_data.is_esports
//     //   // 电竞不用调自动切右侧接口
//     //   if(return_status){
//     //     return
//     //   }

//     //   /** 非冠军联赛筛选 不调用右侧切换接口 ***********************/
//     //   // 模板 ID
//     //   let match_tpl_number  = $menu.menu_data.match_tpl_number

//     //   //非 冠军
//     //   if(match_tpl_number==18){
//     //     let tid = this.mx_filter_select_ids()

//     //     // 是联赛筛选
//     //     if(tid){
//     //       return false
//     //     }

//     //   }

//     //   details.auto_swich_match = true
//     //   let { mid: remove_mid, tid  } = params
//     //   let { cur: cur_page, from: from_page } = this.vx_layout_cur_page

//     //   // 查找参数:1赛事列表，2现场滚球盘，3赛事筛选，4赛事搜索，如果不传，默认赛事列表
//     //   let sm = 1
//     //   if (cur_page == "details" && this.vx_cur_menu_type.type_name == "play") {
//     //     sm = 2
//     //   } else if (cur_page == "search" || from_page == "search") {
//     //     sm = 4
//     //   } else if (this.mx_filter_select_ids()) {
//     //     sm = 3
//     //   }

//     //   let csid = 0

//     //   if (cur_page == "details") {
//     //     let { tid: _tid, csid: _csid } = this.$route.params;
//     //     if (_tid) {
//     //       tid = _tid
//     //       csid = _csid
//     //     } else {
//     //       tid = this.vx_details_params.tid
//     //       csid = this.vx_details_params.csid
//     //     }

//     //   } else {
//     //     tid = this.mx_filter_select_ids() || this.vx_details_params.tid
//     //     csid = this.vx_details_params.csid
//     //   }

//     //   let md = ""
//     //   if (["early"].includes(this.vx_cur_menu_type.type_name)) {
//     //     md = $menu.match_list_api_params.md
//     //   }

//     //   /** 自动选择 */
//     //   let _params = {
//     //     sm,
//     //     euid: $menu.match_list_api_params.euid,
//     //     md,
//     //     csid,
//     //     tid,
//     //     sort: this.vx_match_sort,
//     //     keyword: this.vx_related_keyword.substr(5),
//     //     cuid: this.vx_get_uid,
//     //     mid: remove_mid,
//     //   }

//     //   // 如果是聚合冠军页面
//     //   if(this.vx_cur_menu_type.type_name == 'winner_top'){
//     //     _params.euid = ''
//     //     delete _params.tid
//     //     delete _params.keyword
//     //     delete _params.md
//     //     delete _params.mid
//     //   }

//     //    // 获得当前的模板ID
//     //    let orpt = $menu.menu_data.match_tpl_number
//     //    if(orpt){
//     //     _params.orpt = orpt;
//     //    }

//     //   let latest_match_params_cur = JSON.stringify({ ..._params, time: Date.now() })
//     //   // 防止同一请求连续多次发送
//     //   if (latest_match_params_cur != this.latest_match_params_pre ) {
//     //     this.latest_match_params_pre = latest_match_params_cur

//     //     let api = cur_page == "details" ? api_details.get_fetch_detail_latest_match(_params) : api_details.post_fetch_list_latest_match(_params)

//     //     api.then(({ data }) => {
//     //       if(!details.auto_swich_match) return

//     //       let { mid = -1, csid: sportId, tid } = _.get(data, "data") || {};
//     //       // 详情时重载页面
//     //       if (cur_page == "details" || cur_page == 'video') {
//     //         if (mid && mid != -1) {
//     //           if(cur_page == "details"){
//     //             this.$router.push({
//     //               name: 'details',
//     //               params: {
//     //                 mid,
//     //                 tid,
//     //                 csid: sportId
//     //               }
//     //             })
//     //           }
//     //           // 大视频页面 切换一场有视频的赛事
//     //           else if(cur_page == 'video'){
//     //             video.match_close()
//     //           }
//     //         } else {
//     //           if(_.isFunction(this.back_to)) {
//     //             this.back_to(false);
//     //           }
//     //         }
//     //         return
//     //       }

//     //       // 切换右侧赛事
//     //       let playId = this.vx_details_params.play_id;
//     //       this.vx_set_match_details_params({
//     //         mid,
//     //         tid,
//     //         sportId,
//     //         playId,
//     //         media_type: "auto"
//     //       })

//     //     });
//     //   }
//     // },
//     //显示token失效弹窗
//     show_fail_alert() {
//       let ret = false;
//       let callbackUrl = this.vx_get_user.callbackUrl

//       if (this.vx_get_is_invalid) { //是否失效
//         // if ((!callbackUrl) && (callbackUrl != undefined)) {
//         //   // 弹出提示消息、登录层
//         //   window.vue.$root.$emit(
//         //     window.vue.emit_cmd.EMIT_SHOW_TOAST_CMD,
//         //     window.vue.$root.$t("login.login_timeout")
//         //   );
//         // } else {
//           // 登录失效直接展示 alert
//           this.$root.$emit(this.emit_cmd.EMIT_SHOW_ALERT_CMD, {
//             text: this.$root.$t("login.login_timeout"),
//             callback: () => {

//               location.href = callbackUrl
//               // 清除旧的登录信息
//               this.vx_clear_user()
//             }
//           });
//         // }
//         ret = true;
//       }
//       return ret;
//     },
//     // 获取比赛阶段是否需要查询接口
//     get_phase_result(csid, mmp) {
//       let check_result = false;
//       if(csid == 2) {  // 篮球
//         if(mmp > 0 && mmp < 3) { // 上下半场
//           check_result = true;
//         } else if(mmp > 12 && mmp < 17) { // 第一节~第四节
//           check_result = true;
//         } else if(mmp == 40) { // 加时赛
//           check_result = true;
//         } else if(mmp == 303) { // 第三节休息
//           check_result = true;
//         }
//       } else if (csid == 3) { // 棒球
//         if(mmp > 400 && mmp < 421) { // 第一局上,第一局下~加时上,加时下
//           check_result = true;
//         }
//       } else if (csid == 4) { // 冰球
//         if(mmp > 0 && mmp < 4) { // 第一节~第三节
//           check_result = true;
//         } else if(mmp == 40) { // 加时赛
//           check_result = true;
//         }
//       } else if (csid == 5) { // 网球
//         if(mmp > 7 && mmp < 13) { // 第一盘~第五盘
//           check_result = true;
//         }
//       } else if (csid == 6) { // 美式足球
//         if(mmp > 12 && mmp < 17) { // 第一节~ 第四节 加时赛
//           check_result = true;
//         } else if(mmp == 40) { // 加时赛
//           check_result = true;
//         }
//       } else if (csid == 7) { // 斯洛克
//         if(mmp == 21) {    // 进行中
//           check_result = true;
//         }
//       } else if (csid == 8) { // 乒乓球
//         if((mmp > 7 && mmp < 13) || (mmp > 440 && mmp < 443)) { // 第一局~第七局
//           check_result = true;
//         }
//       } else if (csid == 9) { // 排球
//         if((mmp > 7 && mmp < 13) || mmp==17 || (mmp > 440 && mmp < 443)) { // 第一局~第七局
//           check_result = true;
//         } else if(mmp==17) { // 第五局
//           check_result = true;
//         }
//       } else if (csid == 10) { // 羽毛球
//         if((mmp > 7 && mmp < 13)) { // 第一局~第五局
//           check_result = true;
//         }
//       }
//       return check_result;
//     }
//   },

// };
