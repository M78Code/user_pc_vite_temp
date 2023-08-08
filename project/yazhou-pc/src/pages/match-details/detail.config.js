import { reactive,toRefs } from "vue";
export const useGetConfig = () => {
  const state = reactive({
    // 菜单数据
    menu_data: $menu.menu_data,
    match_info_ctr: new MatchInfoCtr(this),
    mid: "", //赛事id
    sportId: "", //球类id
    match_infoData: {}, //赛事状态比分信息
    category_list: [], //玩法集
    mcid: 0, //默认玩法集id
    plays_list: [], //选中玩法集的盘口玩法集
    match_details: [], //玩法盘口列表

    // isInit: false,
    load_data_state: "loading", //整块加载状态
    handicap_state: "loading", //玩法加载状态状态
    background_img: "", // 比分板背景图
    data_loaded: false, //刷新按钮动画开关
    // 是否关闭全部玩法
    close_all_handicap: false,
    socket_name: "details",
    autoset_mid: "", //切换新赛事id
    toggle_panel: true, //比分扳显示|隐藏
    handicap_this: null, // 传给玩法集 tabs 的数据
    change_mid: true,
    active_detials: {},
    err_time: 0, //玩法详情接口报错次数
    countMatchDetailErr: 0, // 计算详情比分面板接口报错次数
    currentRound: null, // 电竞动态玩法集配置--当前玩法集局数标记
    load_detail_statu: "right_details_loading", // loading 状态
    headerHeight: 0, // 头部高度
    is_request: false, // 详情接口 是否请求中
  });


//   computed: {    //TODO

//     ...mapGetters({
//       vx_get_user: "get_user",
//       // 获取右侧布局类型
//       vx_cur_expand_layout: "get_cur_expand_layout",
//       // 赛事详情请求参数
//       vx_details_params: "get_match_details_params",
//       // 获取 uid
//       get_uid: "get_uid",
//       // 获取当前菜单类型
//       vx_cur_menu_type: "get_cur_menu_type",
//       // 获取当前页面从哪个页面跳转来的
//       get_layout_cur_page: "get_layout_cur_page",
//       // 获取置顶的玩法id
//       get_top_id: "get_top_id",
//       // 当前所选的玩法集子项id
//       get_tabs_active_id: "get_tabs_active_id",
//       // 当前所选的玩法集子项id对应的盘口玩法
//       get_tabs_active_plays: "get_tabs_active_plays",
//       // 详情比分板备用数据
//       get_active_detail: "get_active_detail",
//       vx_get_lang_change: "get_lang_change",
//       // 玩法集对应玩法缓存数据
//       get_details_data_cache: "get_details_data_cache",
//       // 聊天室id
//       get_chatroom_id: "get_chatroom_id",
//       // 获取右侧赛事详情视频信息
//       vx_play_media: "get_play_media",
//     }),
//     // 是否为电竞
//     is_esports() {
//       return this.$utils.is_eports_csid(this.$route.params.csid)
//     },
//     // 获取玩法集菜单长度
//     category_list_length(){
//       return _.get(this.category_list,'length',0);
//     }
//   },



  return {
    ...toRefs(state)
  }
};
