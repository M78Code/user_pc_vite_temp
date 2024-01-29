//  // api详情
import { api_details } from "src/api";
import lodash from "lodash";
import axios_debounce_cache from "src/core/http/debounce-module/axios-debounce-cache.js";
import { update_match_time } from "src/core/bet/common-helper/module/common-sport.js";
import axios_api_loop from "src/core/http/axios-loop.js"
import {
  useMittOn,
  MITT_TYPES,
  // MenuData,
  UserCtr,
  is_eports_csid,
  MatchDataWarehouse_PC_Detail_Common,
  format_plays,
  MenuData,
  format_sort_data,
  useMittEmitterGenerator,
  useMittEmit,
  MatchDetailCalss,
  GlobalSwitchClass,
  computed_background,
} from "src/output/index.js";
import {LayOutMain_pc} from "src/output/project/index.js";
import detailUtils from "src/core/match-detail/match-detail-pc/match-detail.js";
import { reactive, toRefs, ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
export const useRightDetails = (props) => {
  //视频是否展开状态
  const get_is_fold_status = ref(GlobalSwitchClass.is_fold_status);
  // 获取当前页路由信息
  const layout_cur_page = ref(LayOutMain_pc.layout_current_path);
    // 当前所选的玩法集子项id
  const get_tabs_active_id = ref(MatchDetailCalss.current_category_id);

// 获取指定的玩法id
const  get_top_id = ref(MatchDetailCalss.top_id)

  const { route,details_params } = props;
  //全局混入hooks
  // const {  } = useGetGlobal({ });
  const MatchDataWarehouseInstance = reactive(
    MatchDataWarehouse_PC_Detail_Common
  );
  
  const cur_menu_type = ref(MenuData.cur_menu_type)

  /**
   * 把当前页面的数据给到玩法集
   */
  const set_handicap_this = (val) => {
    allData.handicap_this = val;
  };

  /**
   * 自动切换赛事
   */
  const emit_autoset_match = (mid) => {
    if (allData.autoset_mid != mid || !mid) {
      // this.mx_autoset_active_match({ mid: mid || 0 });
      allData.autoset_mid = mid;
    }
  };

  /**
   * 页面从休眠状态被激活时重新拉取数据
   */
  const emit_site_tab_active = () => {
    let { mid = null } = route.params;
    //  mid = mid || allData.details_params.mid todo
    // 如果当前是详情或者视频，就直接初始化
    if (["video"].includes(layout_cur_page.value.cur)) {
      init({ mid, is_ws: true });
      // 否则就拉取比分面板数据
    } else {
      api_details.get_match_detail_MatchInfo({ mid }).then(({ data }) => {
        let code = lodash.get(data, "code");

        if (code == "0400500") {
          emit_autoset_match(0);
          return;
        }

        if (code == 200) {
          let match = lodash.get(data, "data") || {};
          // 当赛事不是 未开赛 0 不是滚球 1 不是暂停 2 也不是即将开赛 110
          if (match.ms > 2 && match.ms != 110) {
            // 重新设置详情选中的赛事
            // this.mx_autoset_active_match();
          } else {
            // 否则就直接初始化
            init({ mid, is_ws: true });
          }
        } else {
          // this.mx_autoset_active_match();
        }
      });
    }
  };

  /**
   * @description: 隐藏其他tips
   * @param {}
   * @return {}
   */
  const close_tips = (hpid) => {
    match_details.value.forEach((item) => {
      item.tipstatus = item.hpid == hpid;
    });
  };
    /**
   * @description: 初始化数据（赛事详情、玩法集、玩法列表）
   * @param {string} mcid玩法集id默认0
   */
  /**
   * @description 初始化详情数据，获取赛事比分信息、玩法集数据以及玩法投注项
   *
   * 调用后通过传参判断是否是 ws 调用
   */
  const m_init = (param = { is_ws: false }) => {
    // console.log(MatchDataWarehouseInstance.get_quick_mid_obj(param),'11111');
    //给仓库类设置id
    //限流 防止mitt多次触发
    if(allData.mid == param) return
    allData.details_params = param
    clearTimeout(allData.get_match_details_timer);
    //如果是ws推送
    let mid =null
    let is_ws = false
    if(lodash.isObject(param)){
      
       mid  = param.mid;
       is_ws  = param.is_ws;
    }else{
      //如果是mitt 列表触发
      if (route.name=='details') {
        mid = route.params.mid;
      }else{
        mid = param;
      }   
    } 
    // 如果有传参，并且不是 ws 调用
    if (mid) {
      allData.mid = mid;
    } else {
      allData.mid = allData.details_params.mid; //赛事id
    }
    if (!allData.mid || allData.mid == -1) {
      allData.match_infoData = { mid: -1, csid: -1 };
      allData.handicap_state = "all_empty";
      return;
    }
    // 重置比分接口调用失败次数
    allData.countMatchDetailErr = 0;
    let params = allData.details_params; //vx_details_params，列表页点击进入详情所保存的赛事参数
    // allData.details_params.mid = mid;
    allData.sportId =lodash.get(MatchDataWarehouseInstance.get_quick_mid_obj(mid),'csid'); //球类id

    // 1. C104 mhs 0  仅开盘 循环四次调用  每两次发起之间次间隔最低3秒 一共 理论上9秒以上，
    // 两个原则：
    //   1：上次回来再调用下一次
    //   2：两次发起之间至少间隔差3秒
    if (param.cmd === "C104") {
      get_matchInfo(3);
    } else if (!allData.is_go_match_list) {
      // 2.详情页 返回列表页 ，多调用一次 matchdetail
      get_matchInfo(1);
    } else {
      // 其他情况只调用一次
      get_matchInfo();
    }

    // 电竞不用请求玩法数据
    if (
      (is_esports.value && route.name != "video") ||
      route.name == "details"
    ) {
      return;
    }
    // 如果是 右侧动画区切换赛事 并且当前在详情页就不请求玩法集
    if (!allData.details_params.category) {
      // 获取玩法集数据
      get_category_list(() => {
        set_cur_match_plays_list();
        // 如果不是 ws 推送的，就展示 loading
        if (!is_ws) {
          allData.handicap_state = "loading";
        }
        //玩法投注项列表
        get_match_detail(is_ws);
      }, is_ws);
    } else {
      MatchDetailCalss.set_current_category_id(0)
      get_tabs_active_id.value =0
    }
  };
  /** 批量注册mitt */
  const { emitters_off } = useMittEmitterGenerator([
    //获取tab数据
    { type: MITT_TYPES.EMIT_SET_HANDICAP_THIS, callback: set_handicap_this },
    // 自动选择赛事
    { type: MITT_TYPES.EMIT_AUTOSET_MATCH, callback: emit_autoset_match },

    // 站点 tab 休眠状态转激活
    { type: MITT_TYPES.EMIT_SITE_TAB_ACTIVE, callback: emit_site_tab_active },
    // 隐藏tips
    { type: MITT_TYPES.EMIT_SET_CLOSE_TIPS, callback: close_tips },
    //mid更新触发
    { type: MITT_TYPES.EMIT_SHOW_DETAILS, callback: m_init }
  ]);
  onUnmounted(emitters_off);
   //多语言触发
  const {off}  = useMittOn(MITT_TYPES.EMIT_LANG_CHANGE, ()=>{
     // 其他情况只调用一次
     get_matchInfo();
     // 获取玩法集数据
     get_category_list(() => {
       set_cur_match_plays_list();
         allData.handicap_state = "loading";
       //玩法投注项列表
      //  get_match_detail(false);
     }, false);
  }) //语言切换
  onUnmounted(off)
  const  match_details = ref([]); //详情盘口
  const allData = reactive({
    handicap_this: null,
    // 菜单数据
    menu_data: MenuData,
    mid: "2771987", //赛事id
    sportId: "", //球类id
    match_infoData: {},
    category_list: [], //玩法集
    mcid: 0, //默认玩法集id
    plays_list: [], //选中玩法集的盘口玩法集
   
    // isInit: false, //是否首次加载
    load_data_state: "loading", //整块加载状态
    handicap_state: "loading", //玩法加载状态状态
    close_all_handicap: false,
    background_img: "", // 比分板背景图
    socket_name: "h_details",
    autoset_mid: "", //切换新赛事id
    change_mid: true,
    err_time: 0, //玩法详情接口报错次数
    countMatchDetailErr: 0, // 计算详情比分面板接口报错次数
    is_go_match_list: true, // 判断是不是从详情页返回列表
    headerHeight: null, // 右侧头部比分板处高度
    round: null, // 电竞动态玩法集配置--当前玩法集局数标记
    load_detail_statu: "empty",
    currentPath: route.name, // 当前路由
    bet_flag: false,
    is_expand: true,
    bet_this: null,
    currentIndex: 0,
    is_display_saidai: false, //是否显示晒单列表
    chatroom_info: {
      all_mute: 0,
      ban_share: 0,
    },
    share_order_time: 0,
    refresh_loading: false, // 刷新按钮loading
    refresh_time: 0, // 刷新次数
    axios_debounce_timer: null, //定时器
    axios_debounce_timer2: null, //定时器
    get_match_details_timer: null, //定时器
    get_match_details_timer2: null, //定时器
    last_by_mids_uuid: null, //暂时不知道数据是从哪里定义的  todo
    refresh_loading_timer: null, //暂时不知道数据是从哪里定义的  todo
    // 之前vuex的数据暂时放这里
    set_match_detail_count: null, //暂时不知道数据是从哪里定义的  todo
    // details_params: {
    //   //赛事参数
    //   media_type: "",
    //   mid: "",
    //   sportId: "",
    //   tid: "",
    //   time: "",
    // },
    details_params:MatchDetailCalss.params,
    match_sort: 1,
  });
  //    // 是否为电竞
  const is_esports = computed(() => {
    // let is_esports_val;
    // // 详情页判断球种ID  其他页面取菜单
    // if (route.name == "details" || route.name == "video") {
    //   is_esports_val = is_eports_csid(route.params.csid);
    // } else if (route.name == "search") {
    //   is_esports_val = false;
    // } else {
    //   // is_esports_val = allData.menu_data.is_esports //todo
    //   is_esports_val = false;
    // }
    // console.log(is_esports_val, "is_esports_val");
    return MenuData.is_esports();
  });

  /**
   * @description: 玩法投注项列表
   * @param {boolean} is_bymids 是否bymids触发
   * @param {boolean} isWs 是否是 ws 触发
   */
  const get_match_detail_base = (
    obj = { isWs: false, mid: "", is_bymids: false }
  ) => {
    // 如果当前是电竞页，就不请求右侧玩法列表
    if (is_esports.value && route.name != "video") {
      return false;
    }
    // 如果当前在详情页或者接收数据的 mid 和当前 mid 不一样也不展示玩法列表
    if (route.name == "details" || (obj.mid && allData.mid != obj.mid)) {
      return false;
    }
    // 非ws拉取的情况下，展示 loading
    if (!obj.isWs && allData.handicap_state != "loading") {
      allData.handicap_state = "loading";
    }
    // let euid = MenuData.match_list_api_params.euid;todo
    let euid = 11;

    // 获得当前的模板ID
    let orpt = 0; //todo
    let { play_id } = allData.details_params;
    let baseParam = {
      cuid: UserCtr.get_uid(),
      euid,
      orpt,
      sort: allData.match_sort,
    };
    let params = {
      baseParam,
      // mcid: allData.mcid, //玩法集id
      mcid: "0", //玩法集id
      mid: allData.mid, //赛事id
      cuid: UserCtr.get_uid(), //用户id
    };
    let type_name = cur_menu_type.value.type_name;
    //today：今日  early：早盘
    if (["today", "early"].includes(type_name)) {
      params.baseParam.cos = MenuData.is_corner_menu() || orpt == 25 ? 1 : 0;
    } else {
      params.baseParam.cos = 0;
    }
    // 非滚球传 玩法ID
    if (type_name != "play") {
      // params.baseParam.pids = MenuData.match_list_api_params.pids;
      params.baseParam.pids = "";
    }
    // 竟足
    if (euid == 30101) {
      play_id = 1001;
      params.baseParam.orpt = 12;
      params.baseParam.pids = -999;
    }
    // 如果有角球 罚牌玩法
    else if (play_id) {
      baseParam.tabs = [{ mid: allData.mid, playId: play_id }];
    }

    let fun_temp = async () => {
      // 记录当前请求gcuuid
      allData.last_by_mids_uuid = params.gcuuid = UserCtr.uid;

      // // 如果当前是电竞
      if (is_esports.value) {
        params.newUser = 0;
        // 电竞接口无用的参数删除
        delete params.baseParam;
        // 电竞接口参数补全，round 是电竞赛事才有的动态玩法id
        params.round = allData.round;
        await api_details
          .get_match_odds_info_ES(params)
          .then((res) => {
            set_home_loading_time_record("ok");
            // 检查gcuuid
            if (allData.last_by_mids_uuid != res.config.gcuuid) return;

            allData.err_time = 0;
            const code = lodash.get(res, "data.code");
            let timestap = lodash.get(res, "data.ts");
            // 获取详情下所有玩法集数据
            let data = lodash.get(res, "data.data", []);
            //mhs赛事盘口状态 0:开, 封, 2:关, 11:锁
            if (
              code === 200 &&
              data.length &&
              allData.match_infoData.mhs != 2
            ) {
              data.forEach((item) => {
                item = format_plays(item);
                item.tipstatus = false;
              });

              let obj = [];
              // 保存详情玩法个数
              allData.set_match_detail_count = data.length;

              // 置顶数据排序
              let arr = []; //暂存本地置顶的数据
              for (var i = 0; i < data.length; i++) {
                if (data[i].hton != "0") {
                  MatchDetailCalss.set_top_id({ id: data[i].topKey, type: true })
                } else {
                  if (get_top_id.value.includes(data[i].topKey)) {
                    data[i].hton = new Date().getTime() + "";
                    arr.unshift(data.splice(i, 1)[0]);
                    i--;
                  }
                }
              }
              if (arr.length) {
                //插入置顶的数据
                for (var i in arr) {
                  data.unshift(arr[i]);
                }
              }
              data.forEach((item, index) => {
                obj.push(item);
                item.initIndex = index;
                item.index = index;
              });
              // 初始化控制类中的玩法数据
              MatchDataWarehouseInstance.set_match_details(allData.match_infoData,
                data
              );
              let str = allData.mid + "_";
              match_details.value = [lodash.get(
                MatchDataWarehouseInstance.list_to_obj.mid_obj,
                str
              )];
              // 玩法列表loading状态值
              allData.handicap_state = "data";
              // 同步投注项 todo
              // if (!this.vx_get_lang_change) {
              //   this.yabo_common.upd_bet_obj(this, timestap, allData.mid);
              // }
              // this.vx_set_lang_change(false);
            } else {
              match_details.value = [];
              allData.handicap_state =
                params.mcid == 0 ? "all_empty" : "new_empty";
            }
          })
          .catch((err) => {
            set_home_loading_time_record("err");
            console.error(err);
            if (!obj.isWs) {
              err_tips(err);
            }
          });
        // 常规赛事
      } else {
        await api_details
          .get_match_detail2(params)
          .then((res) => { 
            set_home_loading_time_record("ok");
            // 检查gcuuid
            if (allData.last_by_mids_uuid != res.gcuuid) return;

            allData.err_time = 0;
            const code = lodash.get(res, "code");
            // 获取赛事数据
            let match_info = lodash.get(res, "data.baseData[0]", {});
            // 获取详情下所有玩法集数据
            let data = lodash.get(res, "data.plays", []);
            let timestap = lodash.get(res, "ts");
            if (code == "0400500") {
              // 跳转赛事
              emit_autoset_match(0);
              return;
            }
            if (!lodash.isEmpty(match_info) && !obj.is_bymids) {
              // 同步列表的赛事数据
              useMittEmit(MITT_TYPES.EMIT_SYNCH_FROM_DETAIL, res);
              if (allData.is_go_match_list) {
                let match_obj = {};
                for (let [key, value] of Object.entries(match_info)) {
                  if (!lodash.isUndefined(allData.match_infoData[key])) {
                    match_obj[key] = value;
                  } else {
                    delete match_obj[key];
                  }
                }
                // 同步数据到详情
                if(match_info.csid !=1 && match_info.csid !=2 ){
                  match_obj.msc = detailUtils.build_msc(match_obj);
                }
                Object.assign(
                  allData.match_infoData,
                  match_obj
                );
              }
              // 是否是从详情页返回列表页
              allData.is_go_match_list = true;
            }
            //mhs赛事盘口状态 0:开, 封, 2:关, 11:锁
            if (code == 200 && data.length && allData.match_infoData?.mhs != 2) {
              data.forEach((item) => {
                item = format_plays(item);
                item.tipstatus = false;
              });

              let obj = [];
              // 保存详情玩法个数
              allData.set_match_detail_count = data.length;

              // 置顶数据排序
              let arr = []; //暂存本地置顶的数据
              for (var i = 0; i < data.length; i++) {
                if (data[i].hton != "0") {
                  MatchDetailCalss.set_top_id({ id: data[i].topKey, type: true });
                } else {
                  if (get_top_id.value.includes(data[i].topKey)) {
                  data[i].hton = new Date().getTime() + "";
                  arr.unshift(data.splice(i, 1)[0]);
                  i--;
                  }
                }
              }
              if (arr.length) {
                //插入置顶的数据
                for (var i in arr) {
                  data.unshift(arr[i]);
                }
              }
              data.forEach((item, index) => {
                //投注项ol排序
                obj.push(format_sort_data(item));
                item.initIndex = index;
                item.index = index;
              });
              // 初始化控制类中的玩法数据
              MatchDataWarehouseInstance.set_match_details(allData.match_infoData,
                data
              );
              // match_details.value = MatchDataWarehouseInstance.list;
              let str = allData.mid + "_";
              match_details.value = [lodash.get(
                MatchDataWarehouseInstance.list_to_obj.mid_obj,
                str
              )];
              // 玩法列表loading状态值
              allData.handicap_state = "data";
              // 同步投注项
              // if (!this.vx_get_lang_change) {
              //   this.yabo_common.upd_bet_obj(this, timestap, allData.mid);
              // }
              // this.vx_set_lang_change(false);
            } else {
              match_details.value = [];
              if (code == "0401038") {
                allData.handicap_state = "api_limited";
                return;
              }
              allData.handicap_state =
                params.mcid == 0 ? "all_empty" : "new_empty";
            }
          })
          .catch((err) => {
            console.error(err,'err');
            set_home_loading_time_record("err");
            if (!obj.isWs) {
              err_tips(err);
            }
          });
      }
      ["new_empty", "all_empty"].includes(allData.handicap_state) &&
      useMittEmit(MITT_TYPES.EMIT_GET_HISTORY);
    };
    let api_axios_flg = "match_odds_Info2";
    if (
      axios_debounce_cache &&
      axios_debounce_cache[api_axios_flg] &&
      axios_debounce_cache[api_axios_flg]["ENABLED"]
    ) {
      let instance = axios_debounce_cache[api_axios_flg];
      let info = instance.can_send_request(params);
      if (info.can_send) {
        //直接发请求    单次数 请求的方法
          fun_temp();
      } else {
        // 记录timer
        this.current_hash_code = 0;
        clearTimeout(this.axios_debounce_timer2);
        this.axios_debounce_timer2 = setTimeout(() => {
          //直接发请求    单次数 请求的方法
            fun_temp();
          this.current_hash_code = 0;
        }, info.delay_time || 1000);
      }
    } else {
      //直接发请求    多 次数  循环请求 的方法
        fun_temp();
    }
  };


  const refresh = lodash.throttle(
    () => {
      allData.refresh_loading = true;
      get_matchInfo(1);
      allData.refresh_time += 1;
      allData.refresh_loading_timer &&
        clearTimeout(allData.refresh_loading_timer);
      allData.refresh_loading_timer = setTimeout(() => {
        allData.refresh_loading = false;
      }, 3000);
    },
    1000,
    {
      leading: true,
      trailing: false,
    }
  );
  // 对获取玩法集所有玩法接口进行节流操作
  const get_match_detail_base_throttle = lodash.throttle(
    () => {
      get_match_detail_base();
    },
    1000,
    {
      leading: true,
      trailing: true,
    }
  );
  const init =lodash.debounce(()=>{
    m_init(allData.details_params)
  },1000)
  onMounted(() => {
    /**
     * @description: 初始化数据 调取赛事详情、玩法集、玩法列表接口
     * @return {undefined} undefined
     */
    // init();
    // get_match_detail_base_throttle();
    // get_matchInfo_fun(1,allData.mid)
    // m_init();
    //获取详情
    // get_matchInfo();

    /*  mitt todo*/
    // // 自动切换赛事
    // useMittOn("autoset_match", this.emit_autoset_match);
    // // 检查玩法关盘
    // useMittOn("check_plays_show", this.check_plays_show);

    // // 关闭 tips
    // useMittOn("close_tips", this.close_tips);

    // //列表刷新拉取详情数据
    // // useMittOn("refreshList", init.value);
    // // 拉取玩法列表
    // useMittOn("match_detail_base", this.get_match_detail_base);

    // // 接受 loading 状态
    // useMittOn("change_loading_status_right_details", this.getLoading);
    // // 右侧头部高度
    // useMittOn(
    //   "match_details_header_height_right_details",
    //   this.getHeaderHeight
    // );
    // useMittOn(MITT_TYPES.EMIT_SAIDAN_PAGE_CHANGE_MSG_EVENT, this.change_saidan);
    /*  mitt todo*/

    // 刷新按钮节流
    // refresh();
  });

  //  ...mapActions({
  //    // 设置展开区块
  //    vx_set_cur_expand_layout: "set_cur_expand_layout",
  //    // 置顶的玩法id
  //    set_top_id: "set_top_id",
  //    // 保存玩法个数
  //    allData.set_match_detail_count: "set_match_detail_count",
  //    // 视频播放信息
  //    vx_set_play_media: "set_play_media",
  //    // 当前选中玩法id
  //    set_tabs_active_id: "set_tabs_active_id",
  //    // 当前选中玩法对应的盘口玩法
  //    set_tabs_active_plays: "set_tabs_active_plays",
  //    // 切换多语言
  //    vx_set_lang_change: "set_lang_change",
  //    vx_bet_single_clear: 'bet_single_clear',
  //    vx_bet_mix_clear: 'bet_mix_clear',
  //    vx_set_match_details_params: "set_match_details_params",
  //    // 设置获取视频是否展开状态
  //    vx_set_is_fold_status: "set_is_fold_status"
  //  }),
  /**
   * @description 晒单列表显示状态改变
   */
  const change_saidan = (evt) => {
    allData.is_display_saidai = evt;
  };
  /**
   * @description 控制聊天室是否显示
   */
  const handle_chatroom_show = () => {
    // 跳转赛事后，先关闭聊天室
    //  this.set_chatroom_available(0)   todo
    // 聊天室开关开启后才显示聊天室
    //  if (this.vx_get_user.chatRoomSwitch) {
    //    // 获取直播、聊天室信息
    //    this.get_live_chat_info()
    //  }
  };

  /**
   *设置视频展开关状态
   */
  const setfoldStatus = () => {
    // todo
    //  this.vx_set_is_fold_status(!this.get_is_fold_status)
    //  if(this.get_is_fold_status){
    //    let { mid, media_type, play_id } = allData.details_params;
    //    this.vx_set_play_media({
    //      mid,
    //      media_type,
    //      play_id,
    //      time:new Date()*1,
    //    });
    console.log(get_is_fold_status.value);
    GlobalSwitchClass.set_is_fold_status(!get_is_fold_status.value)
    let { media_type, play_id } = allData.details_params;
    MatchDetailCalss.set_play_media({
      mid: allData.mid,
      media_type,
      play_id,
      time: new Date() * 1,
    })

    //  }
  };
  /**
   * @description 获取头部高度
   */
  const getHeaderHeight = (height) => {
    allData.headerHeight = height || 0;
  };
  /**
   * @description 获取loading状态
   */
  const getLoading = (status) => {
    allData.load_detail_statu = status;
  };

  /**
   * @description 返回顶部
   * @return {Undefined} Undefined
   */
  const on_go_top = () => {
    useMittEmit(MITT_TYPES.EMIT_SET_SCROLL_POSITION, ["vertical", 0])
  };
  /**
   * @description: 检查玩法关盘
   * @return {undefined} undefined
   */
  const check_plays_show = () => {
    match_details.value.forEach((item) => {
      item = format_plays(item);
    });
  };

  /**
   * @description: 设置选中玩法集 （mcid,plays_list）
   */
  const set_cur_match_plays_list = () => {
    // 获取当前玩法集里第一个子项的
    let mcid = lodash.get(allData.category_list, "0.id", "");
    if (
      lodash.some(
        allData.category_list,
        (item) => item.id === get_tabs_active_id.value
      ) &&
      !allData.change_mid
    ) {
      mcid = get_tabs_active_id.value
    }
    allData.mcid = mcid;
    let { plays = [] } = lodash.find(
      allData.category_list,
      (item) => item.id === allData.mcid,
      {}
    );
    allData.plays_list = plays;
    // 保存当前选中的玩法集子项id todo
    // this.set_tabs_active_id(allData.mcid);
    // // 保存当前选中的玩法集子项玩法集合
    // this.set_tabs_active_plays(allData.plays_list);
    allData.change_mid = false;
  };

  /**
   * @description: 赛事详情比分板数据
   * @param {number} loop_count 循环调用次数
   */
  const get_matchInfo = (loop_count) => {
    if (route.name=='details') {
      allData.mid = route.params.mid
    }
    let params = {
      mid: allData.mid || 0, //赛事id
    };
    if (params.mid == -1) {
      allData.match_infoData = { mid: -1, csid: -1 };
      allData.handicap_state = "all_empty";
      return;
    }
    let api;
    // 如果是电竞就用电竞的请求配置

    if (is_esports.value) {
      api = api_details.get_match_detail_ESMatchInfo;
      // 非电竞就用通用的请求配置
    } else {
      api = api_details.get_match_detail_MatchInfo;
    }
    let send_request = () => {
      api(params)
        .then((res) => {
          const code = lodash.get(res, "code");
          const data = lodash.cloneDeep(lodash.get(res, "data"));
          const timestap = lodash.get(res, "ts");
          if (code == "0400500") {
            // 跳转赛事
            emit_autoset_match(0);
            return;
          }

          if (code == 200 && data && Object.keys(data).length) {
            // 请求成功就清零错误次数
            allData.countMatchDetailErr = 0;
            // 设置当前赛种的背景图
            allData.background_img = computed_background(data.csid);
            // mmp状态修正
            if (
              [
                "4",
                "5",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12",
                "13",
                "16",
                "15",
                "14",
              ].includes(data.csid)
            ) {
              if (data.ms != 0 && data.mmp == "0") {
                Object.assign(data, {
                  mmp: "8",
                  mct: 1,
                });
              }
            }
            MatchDataWarehouseInstance.set_match_details(data,[]);
            allData.match_infoData = MatchDataWarehouseInstance.get_quick_mid_obj(allData.mid);
          
            let mid = lodash.get(data, "mid");
            let csid = lodash.get(data, "csid");
            let mst = lodash.get(data, "mst");
            let mstst = lodash.get(data, "mstst");
            let mststs = lodash.get(data, "mststs");
            MatchDetailCalss.set_match_details_params({mid,csid,media_type:'auto'})
            //获取赔率
              // get_match_detail_base()
              get_match_detail_base_throttle();
            //同步赛事时间
            update_match_time({ mid, mst, mstst, mststs });
            let { media_type, play_id } = allData.details_params;
            MatchDetailCalss.set_play_media( {
              mid: data.mid,
              media_type:'auto',
              play_id,
              time: new Date() * 1,
            })
            allData.load_data_state = "data";
            // 保存数据,用于接口报错时填充
            MatchDetailCalss.set_active_detail(lodash.cloneDeep(allData.match_infoData) )
          } else {
            countMatchDetail();
          }
          sessionStorage.setItem("currentIndex", 0);
        })
        .catch((err) => {
          console.error(err);
          //设置错误数据
          GlobalSwitchClass.set_error_data({
            site: "match_details--get_matchInfo",
            error: err,
          })
          countMatchDetail();
        })
        .finally(() => {
          // 循环调用 赛事详情页比分板接口，固定间隔3s
          if (loop_count) {
            clearTimeout(allData.get_match_details_timer2);
            allData.get_match_details_timer2 = setTimeout(() => {
              loop_count--;
              get_matchInfo(loop_count);
            }, 3000);
          } else {
          }
        });
    };
    const match_details_debounce_cache = axios_debounce_cache.get_match_details;
    if (
      match_details_debounce_cache &&
      match_details_debounce_cache["ENABLED"]
    ) {
      let info = match_details_debounce_cache.can_send_request(params);
      if (info.can_send) {
        //直接发请求    单次数 请求的方法
        send_request();
      } else {
        // 记录timer
        this.current_hash_code = 0;
        clearTimeout(allData.axios_debounce_timer);
        allData.axios_debounce_timer = setTimeout(() => {
          //直接发请求    单次数 请求的方法
          send_request();
          this.current_hash_code = 0;
        }, info.delay_time || 1000);
      }
    } else {
      //直接发请求    多 次数  循环请求 的方法
      send_request();
    }
  };
  /**
   * @description: 详情比分面板接口报错处理
   * @param {*}
   * @return {*}
   */
  const countMatchDetail = () => {
    // 计算错误次数
    allData.countMatchDetailErr += 1;
    // 如果接口一直报错，最多拉取5次
    if (allData.countMatchDetailErr < 5) {
      // 延迟3秒 再次调详情接口
      allData.get_match_details_timer = setTimeout(() => {
        get_matchInfo();
      }, 3000);
    } else {
      allData.match_infoData = { mid: -1, csid: -1 };
      allData.handicap_state = "all_empty";
    }
  };

  /**
   * @description: 玩法集
   * @param {function} callback 判断是否调玩法列表接口
   */
  const get_category_list = (callback, is_ws) => {
    let params = {
      sportId: allData.sportId || 0, //球类id
      mid: allData.mid || 0, //赛事id
    };
    // 全屏模式
    if (route.params.video_size == 1) {
      params.type = 2;
    }
    const _obj = {
      axios_api: api_details.get_category_list,
      error_codes: ["0401038"],
      params: params,
      fun_then: (res) => {
        if (!MatchDataWarehouseInstance) {
          return;
        }
        const code = lodash.get(res, "code");
        if (code == "0400500") {
          emit_autoset_match(0);
          return;
        }
        const data = lodash.get(res, "data");
        if (code == 200 && data.length) {
          allData.category_list = data;
          // 初始化玩法列表
          // MatchDataWarehouseInstance.init_play_menu_list(data);
          if (callback) {
            callback();
          }
        } else {
          allData.load_data_state = "empty";
        }
      },
      fun_catch: (err) => {
        // 连续3次请求无响应则网络异常
        if (!is_ws) {
          allData.load_data_state = "user_api_limited";
        }
      },
      timers: 1500,
      max_loop: 1,
    };
    axios_api_loop(_obj);
  };

  /**
   * @description: 弹出报错提示
   * @param {}
   * @return {}
   */
  const err_tips = (err) => {
    match_details.value = [];
        //设置错误数据
     GlobalSwitchClass.set_error_data({
      site: "details--get_match_detail",
      error: err,
    })
    if (
      lodash.isPlainObject(err) ||
      lodash.get(err, "response.status") == 404
    ) {
      allData.handicap_state = "404";
    } else {
      allData.handicap_state = "refresh";
    }
  };
  /**
   * @description: ws逻辑调取玩法列表
   */
  const get_match_detail= lodash.throttle(
    (isWs) => {
      get_match_detail_base(isWs);
    }, 1000
  );

  /**
   * @description: 子组件玩法切换
   * @param {string} id 玩法集id
   */
  const get_mattch_details = (obj) => {
    allData.mcid = lodash.get(obj, "id");
    allData.round = lodash.get(obj, "round");
    allData.plays_list = lodash.get(obj, "plays", []);
    // get_match_detail_base();
  };
  /**
   * 切换玩法集时增加 loading 效果
   */
  const change_loading_state = (n) => {
    allData.handicap_state = n;
  };
  /**
   * @description 设置滚动数据
   * @param  {string} type  类型
   * @param  {oject} _this  上下文对象
   * @return {undefined} undefined
   */
  const set_scroll_this = ({ type, _this }) => {
    this[type] = _this;
  };
  /**
   * 切换玩法集
   * @param {*} obj 从tab里获取的玩法集参数
   */
  const switchTabs = (obj) => {
    this.currentIndex = obj.index;
    // 设置当前玩法集所在的id
    this.set_tabs_active_id(obj.item.id);
    // 设置当前玩法集对应的盘口玩法
    this.set_tabs_active_plays(obj.item.plays);
    // 请求当前选中的玩法项
    get_mattch_details({
      id: obj.item.id,
      plays: obj.item.plays,
      round: obj.item.round,
    });
    // 投注项列表回到顶部
    on_go_top();
    if (allData.match_infoData.csid == 1) {
      // 发送埋点
      let zhuge_obj = {
        玩法集名称: obj.item.marketName,
        玩法集ID: obj.item.id,
        区域位置: "大屏",
      };
      send_zhuge_event("TY_PC_足球_玩法分类导航_点击", zhuge_obj);
    }
  };
  // 批量清除定时器
  const clear_timer = () => {
    const timer_arr = [
      "axios_debounce_timer",
      "axios_debounce_timer2",
      "get_match_details_timer",
      "get_match_details_timer2",
    ];

    for (const timer of timer_arr) {
      clearTimeout(allData[timer]);
      allData[timer] = null;
    }
  };
  // 自动化测试页面加载时间时使用
  const set_home_loading_time_record = (status) => {
    if (
      window.init_loading_time_obj &&
      lodash.get(window, "env.config.DOM_ID_SHOW")
    ) {
      if (!window.init_loading_time_obj.right_details_end_time) {
        window.init_loading_time_obj.right_details_end_time =
          new Date().getTime();
      }
      let time_obj = window.init_loading_time_obj;
      if (!time_obj.start) {
        time_obj.start = new Date(time_obj.start_time).Format(
          "yyyy-MM-dd hh:mm:ss"
        );
      }
      if (time_obj.list_end_time && time_obj.right_details_end_time) {
        let end_time =
          time_obj.list_end_time > time_obj.right_details_end_time
            ? time_obj.list_end_time
            : time_obj.right_details_end_time;
        (time_obj.end = new Date(end_time).Format("yyyy-MM-dd hh:mm:ss")),
          (time_obj.end_time = end_time);
        time_obj.status = status;
        time_obj.duration = time_obj.end_time - time_obj.start_time;
        sessionStorage.setItem(
          "home_loading_time_record",
          JSON.stringify(time_obj)
        );
        window.init_loading_time_obj = null;
      }
    }
  };
  /**
   * @description: 玩法列表除的加载状态展示逻辑
   * @param {*}
   * @return {boolean} 是否展示遮罩层
   */
  const show_load_status = computed(() => {
    // 不展示有数据和无数据和 empty 状态
    // 如果当前在详情页并且是 loading 状态也不展示
    // 当前页是暂无数据时也不展示，会有重复展示的情况
    // 当前在电竞列表页也不展示
    // 当前在滚球电竞，不展示
    if (
      !["data", "no-data", "empty"].includes(allData.load_detail_statu) &&
      !(
        route.name == "details" &&
        ["new_empty", "loading", "all_empty"].includes(
          allData.load_detail_statu
        )
      ) &&
      !is_esports.value
    ) {
      return true;
    } else {
      return false;
    }
  });
  /**
   * @description: 组件销毁前回调方法
   */
  onUnmounted(() => {
    clear_timer();
    // off todo
    // off("check_plays_show", this.check_plays_show);
    // off("close_tips", this.close_tips);
    // del(this.ol_obj);
    // del(this.hl_obj);
    // this.debounce_throttle_cancel(refresh());
    allData.refresh_loading_timer &&
      clearTimeout(allData.refresh_loading_timer);
    // off("match_detail_base", this.get_match_detail_base);

    // off("change_loading_status_right_details", this.getLoading)
    // off("match_details_header_height_right_details", this.getHeaderHeight)

    MatchDataWarehouseInstance.destroy();
    allData.match_infoData = null;
    allData.category_list = null;
    match_details.value = null;
  });
  const routeData = useRouter();
  // 全局路由守卫
  routeData.beforeEach((to, from, next) => {
      console.log(to, from,'tofrom')
       let _to = lodash.get(to, "name") || '';
       let _from = lodash.get(from, "name") || '';
       // 在首页刷新时不要重复调用 init
       if (_from == '' && _to == 'home') {
       } else if(_to== 'home' && _from=='details') {
         // 从详情页返回列表页也要初始化右侧详情
         allData.is_go_match_list = false;
         init(allData.details_params);
       } else if(_to!='details') {
        init(allData.details_params);
       } else if (_to === 'details') {
         clearTimeout(allData.get_match_details_timer2)
         allData.get_match_details_timer2 = null
         handle_chatroom_show()
       }
  next()
})
watch(
  () => MatchDetailCalss.details_data_version.version,
  (val) => {
    if (val) {
     allData.details_params =  MatchDetailCalss.params
    }
  },
  { deep: true }
);
/*
 ** 监听GlobalSwitchClass的版本号  获取最新的全局状态
 */
 watch(
  () => GlobalSwitchClass.global_switch_version,
  (val) => {
    if (val) {
      get_is_fold_status.value = GlobalSwitchClass.is_fold_status;
    }
  },
  { deep: true }
);
  return {
    ...toRefs(allData),
    get_is_fold_status, //视频开关
    layout_cur_page,
    is_esports,
    show_load_status,
    MatchDataWarehouseInstance,
    match_details,
    on_go_top,
    change_loading_state,
    set_handicap_this,
    setfoldStatus,
    get_mattch_details,
    refresh
  };

};
//  mixins: [global_mixin,   details_mixins,],
//  components: {
//   //  "match-info": match_info,
//   //  "match-handicap": match_handicap,
//   //  "chart": chart,
//   //  "handicap-tabs-bar": handicap_tabs_bar,
//   //  recents,
//   //  hot,
//   //  esportsMatchList,
//   //  videoCtrlEsports,
//   //  videoHistoryLine,
//   //  "bet-single": bet_single,
//   //  "bet-scroll-footer": bet_scroll_footer,
//   //  "esports-bet-single": esports_bet_single,
//   //  "chatroom": chatroom,
//   //  'saidan-list': saidan_list,  //晒单列表
//   //  refresh
//  },

//  computed: {
//   //  ...mapGetters({
//   //   
//   //    // 左侧详情参数
//   //    vx_details_params: "get_match_details_params",
//   //    // 获取串关投注项对象
//   //    vx_get_bet_obj: "get_bet_obj",
//   //    // 是否是单关投注
//   //    is_bet_single: 'is_bet_single',
//   //    vx_get_is_single_handle: "get_is_single_handle", // 单关是否正在处理
//   //    vx_get_is_handle: "get_is_handle", // 串关是否正在处理
//   //    // 获取当前选中的tab对应的盘口玩法
//   //    get_tabs_active_plays: "get_tabs_active_plays",
//   //    // 详情比分面板，接口报错时的备用数据
//   //    get_active_detail: "get_active_detail",
//   //    get_is_show_full_bet: "get_is_show_full_bet",
//   //    // 获取当前菜单类型
//   //    vx_get_bet_mode: "get_bet_mode", // 投注模式
//   //    // 获取多语言是否变化
//   //    vx_get_lang_change: "get_lang_change",
//   //    // 赛事列表排序 1:按联赛排序 2:按时间排序
//   //    vx_match_sort: "get_match_sort",
//   //    vx_get_bet_single_list: "get_bet_single_list",
//   //    vx_get_user: "get_user",
//   //    vx_get_virtual_bet_list: "get_virtual_bet_list",
//   //    vx_get_theme: "get_theme",
//   //    vx_get_chatroom_available: "get_chatroom_available",
//   //    get_chatroom_id: "get_chatroom_id",
//   //    vx_get_layout_size: "get_layout_size",
//   //    //视频是否展开状态
//   //    get_is_fold_status:'get_is_fold_status',
//   //  }),
//
//  },

//  watch: {
//    "vx_details_params.mid"() {
//      // this.isInit = true;
//      match_details.value.splice(0, match_details.value.length);
//      allData.category_list.splice(0, allData.category_list.length);
//     MatchDataWarehouseInstance.clear_hl_obj();
//     MatchDataWarehouseInstance.clear_hn_obj();
//     MatchDataWarehouseInstance.clear_ol_obj();
//      this.change_mid = true;
//      allData.is_go_match_list = true;
//       init.value();
//    },

//    /**
//    * @description: 计算各球种背景图片
//    * @return {undefined} undefined
//    */
//    sportId:{
//      handler(res){
//        allData.background_img = this.computed_background(res)
//      }
//    },
//    get_is_show_full_bet() {
//      if(route.params.video_size==undefined) {
//        // 清除单关投注
//        this.vx_bet_single_clear();
//        // 清除串关投注
//        this.vx_bet_mix_clear();
//        // 设置默认为单关
//        this.vx_set_is_bet_single(true);
//      }
//    },
//    // 监听赛事状态mmp的值
//    'match_infoData.mmp'(_new, _old){
//      if(_new !== 999 && _old){
//        // 更新右侧详情
//        init.value()
//      }
//    },
//    // 监听赛事状态ms的值，0:未开赛 1:滚球阶段 2:暂停 3:结束 4:关闭 5:取消 6:比赛放弃 7:延迟 8:未知 9:延期 10:比赛中断 110:即将开赛
//    'match_infoData.ms'(_new, _old) {
//      let arr_ms = [0, 1, 2, 7, 10, 110];
//      // 1.赛事状态为 0:未开赛 1:滚球阶段 2:暂停 7:延迟 10:比赛中断 110:即将开赛 时更新玩法集
//      // 2.ms变更时才调用
//      if(arr_ms.includes(Number(_new)) && _old){
//        // 更新右侧详情
//        init.value()
//      }
//    },
//  },
