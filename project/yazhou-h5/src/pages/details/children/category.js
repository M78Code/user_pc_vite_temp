import { reactive, computed } from "vue";
// 引入接口封装文件
import { api_common, api_analysis } from "src/api/index.js";
//  无数据显示组件
// import no_data from "project_path/src/components/common/no-data.vue"

// #TODO mixins
// 引入skt_data_info
// import websocket_data from "project_path/src/mixins/websocket/data/skt_data_info.js";
// 引入投注逻辑mixin
// import betting from "project_path/src/mixins/betting/betting.js";

// 引入加载中的组件
// import loading from "project_path/src/components/common/loading.vue"
// 引入处理数据的封装方法
import MatchInfoCtr from "src/core/match-detail-h5/match-info-ctr.js";
// 引入redux
import store from "src/store-redux/index.js";
// import { Level_one_detail_odd_info } from "../category-list.js";
// 精选赛事
// import detailMatchList from 'project_path/src/pages/details/components/detail-match-list.vue';
import uid from "src/core/uuid/index.js";
import lodash from "lodash";
import { useRouter, useRoute } from "vue-router";
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt";
export const category_info = () => {
  const router = useRouter();
  const route = useRoute();
  const store_state = store.getState()
  const component_data = reactive({
    // 测试数据
    match_info_list: [],
    // uid
    send_gcuuid: "",
    emitters: [],
    // 加载数据的效果
    // is_loading: true,
    is_loading: false,
    // 玩法集无数据
    is_no_data: false,
    // is_no_data: true,
    // 是否无热门推荐赛事 // 改为真
    no_recommend_match_list: true,
    // 单个玩法集下的玩法数量
    playlist_length: undefined,
    // 所有数据集合
    matchInfoCtr: new MatchInfoCtr({
      route,
      get_detail_data: {
        mid: route.params.mid
      }
    }),
    // dom_play元素的观察对象
    observer_: undefined,
    // 第一次进来根据数据是否折叠玩法
    first_load: false,
    // 保存当前展开收起的状态
    arr_hshow: [],
    // 是否当前页刷新
    to_refresh: "",
    // 玩法集是否已切换过
    match_play_item_changed: false,
  });
  // #TODO vuex
  // computed:{
  // ...mapGetters([
  //   'get_detail_data',
  //   'get_details_item',
  //   'get_goto_detail_matchid',
  //   'get_menu_type',
  //   'get_uid',
  //   "get_details_tabs_list",
  //   "get_subscript_game_index",
  //   "get_fewer",
  //   "get_curr_sub_menu_type",
  //   'get_is_hengping',
  //   'get_details_data_cache',
  //   'get_details_tabs_list',
  //   'get_chpid_obj'
  // ]),
  const get_detail_data = computed(() => {
    return "";
  });
  const get_details_item = computed(() => {
    return 0;
  });
  const get_goto_detail_matchid = computed(() => {
    return "get_goto_detail_matchid";
  });
  const get_menu_type = computed(() => {
    return "get_menu_type";
  });
  const get_uid = computed(() => {
    return "get_uid";
  });
  const get_details_tabs_list = computed(() => {
    return store_state.detailsReducer.details_tabs_list || [];
  });
  const get_subscript_game_index = computed(() => {
    return "get_subscript_game_index";
  });
  const get_fewer = computed(() => {
    return "get_fewer";
  });
  const get_curr_sub_menu_type = computed(() => {
    return "get_curr_sub_menu_type";
  });
  const get_is_hengping = computed(() => {
    return "get_is_hengping";
  });
  const get_details_data_cache = computed(() => {
    return "get_details_data_cache";
  });
  const get_chpid_obj = computed(() => {
    return "gt_chpid_obj";
  });
  //押注状态0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,7-有投注项锁盘，8-单关投注失败(bet接口返回200)
  const get_bet_status = computed(() => {
    return 0;
  });
  const show_recommend = computed(() => {
    let flag = false;
    if (!component_data.is_loading && component_data.is_no_data) {
      if (route.name != "match_result") {
        if (get_details_item.value) {
          //当前玩法下无数据就显示
          flag = true;
        }
      }
    }
    // #TODO
    return flag;
  });
  // 置顶列表
  const match_list_new = computed(() => {
    // console.log("match_info_list=-===", component_data.match_info_list)
    return component_data.matchInfoCtr.listSortNew();
  });
  // 非置顶列表
  const match_list_normal = computed(() => {
    // return component_data.matchInfoCtr.listSortNormal();
    return component_data.match_info_list;
  });
  // 赛事id
  const match_id = computed(() => {
    return (
      get_goto_detail_matchid.value ||
      get_detail_data.mid.value ||
      route.params.mid
    );
  });
  // #TODO VUEX
  // methods: {
  // ...mapMutations([
  //   "set_fewer",
  //   "set_details_data_cache",
  //   'set_chpid_obj'
  // ]),
  /**
   *@description 设置外层容器的最小高
   */
  const change_minheight = () => {
    if ($refs.category) {
      // 0.44 + 0.4 + 0.4 = 1.24
      let val = [1, 2].includes(+get_detail_data.value.csid) ? 1.24 : 0.84;

      // 横屏 或 赛事盘口全部关闭 且无推荐赛事 时 不设置最小高度
      if (
        get_is_hengping ||
        (show_recommend.value && !$refs.detail_match_list)
      ) {
        $refs.category.style.minHeight = "unset";
      } else {
        $refs.category.style.minHeight = window.innerHeight - rem(val) + "px";
      }
    }
  };
  // 点击玩法名称,隐藏或是显示玩法赔率
  const change_show = () => {
    component_data.arr_hshow = [];
    if (Array.isArray(component_data.matchInfoCtr.list) && component_data.matchInfoCtr.list.length) {
      let flag1 = component_data.matchInfoCtr.list.every((item) => {
        return item.hshow == "Yes";
      });
      let flag2 = component_data.matchInfoCtr.list.every((item) => {
        return item.hshow == "No";
      });
      let obj_ = {};
      component_data.matchInfoCtr.list.forEach((v_item, v_index) => {
        obj_.topKey = v_item.topKey;
        obj_.hshow = v_item.hshow;
        component_data.arr_hshow.push(obj_);
        obj_ = {};
      });
      if (flag1) {
        set_fewer(1);
      } else if (flag2) {
        set_fewer(2);
      } else {
        set_fewer(3);
      }
    }
  };

  //列表子项增加自定义属性
  const listItemAddCustomAttr = (item) => {
    if (!item) {
      return;
    }
    if (get_fewer == 2 && playlist_length) {
      item.hshow = "No";
    }
    if (get_fewer == 1 && playlist_length && first_load) {
      item.hshow = "Yes";
    }
    if (item && item.hl && item.hl.length) {
      item.hl.forEach((item2) => {
        if (item2.hid) {
          component_data.matchInfoCtr.hl_obj[item2.hid] = item2;
        }
        if (item2 && item2.ol && item2.ol.length) {
          item2.ol.forEach((item3) => {
            // 押注项设置盘口状态
            Object.assign(item3, {
              hs: item2.hs ? item2.hs : 0,
              ms: 0,
              id_: item2.hn
                ? `${item.mid}_${item.chpid || item.hpid}_${item3.ot}_${
                    item2.hn
                  }`
                : item3.oid,
            });
          });
        }
      });
    }
  };

  //列表子项恢复之前的自定义属性
  const listItemRecoverCustomAttr = (item_new, item_old) => {
    if (item_old.length && Array.isArray(item_old)) {
      for (const item of item_old) {
        for (const item2 of item_new) {
          if (item.hpid == item2.hpid) {
            //根据玩法id判断是否合并数据
            let temp__ = {};
            temp__ = { hshow: item.hshow };
            //恢复数据
            Object.assign(item2, temp__);
          }
        }
      }
    }
  };

  // 获取vuex中tab切换的玩法集数据，根据玩法集plays对应到所有数据hpid即可过滤数据。
  const get_details_data_cache_fillter = (all_data) => {
    const mcid =
      get_details_item.value || (route.params.csid ? "" : route.params.mcid);
    const findItme = get_details_tabs_list.value.find((item) => item.id == mcid) || {};
    console.log(findItme,"findItme");
    const { plays = [], round = "" } = findItme;

    // console.log(get_chpid_obj,"set_chpid_objset_chpid_obj");
    const res = all_data.filter((item) => {
      // 电竞需要判断第一局和第二局的原因，需要加上chpid判断
      if (get_menu_type == 3000) {
        if (round) {
          console.log(
            get_chpid_obj[`${item.hpid}-${round}`],
            round,
            item.chpid,
            item.hpid,
            "dsjfkldskjfs"
          );
          //
          console.log(
            get_chpid_obj[`${item.hpid}-${round}`],
            item.chpid,
            "get_chpid_obj[`${item.hpid}-${round}`] == `${item.hpid}-${round}`"
          );
          return (
            plays.includes(+item.hpid) &&
            (get_chpid_obj[`${item.hpid}-${round}`] == item.chpid ||
              item.chpid === item.hpid)
          );
        } else {
          // 所有投注
          return plays.includes(+item.hpid);
        }
      } else {
        return plays.includes(+item.hpid);
      }
    });
    // console.log(plays,"playsplaysplaysplaysplays");
    // console.log(all_data,"all_dataall_dataall_data.all_dataall_data");
    // console.log(res,"最终过滤得数据");
    return res;
  };

  /**
   * @description 初始化方法
   * @param to_refresh
   * @param init_req
   * @returns {Promise<void>}
   */
  const initEvent = async (to_refresh, init_req) => {
    // debugger
    if (to_refresh) {
      to_refresh = to_refresh;
    } else {
      component_data.arr_hshow = [];
    }
    let params = {
      // 赛果，赛果详情默认采用0，即是拉取所有的赛果
      // mcid: ['result_details', 'match_result'].includes(route.name) ? 0 : get_details_item || (route.params.csid?'':route.params.mcid), // 玩法集id
      // 2023/3/4 普通赛事,电竞详情拉取所有玩法集数据
      mcid: 0,
      // mid: match_id.value, // 赛事id
      // cuid: get_uid.value, // userId或者uuid
      cuid: '507708033232540302',
      mid: route.params.mid,
      // round: get_menu_type == 3000 ? (get_details_tabs_list && get_details_tabs_list[get_subscript_game_index] && get_details_tabs_list[get_subscript_game_index].round) : null
      round: null,
    };
    // 如果是 赛果下边的 电竞，则加 isESport 参数
    if (
      get_menu_type.value == 28 &&
      [3001, 3002, 3003, 3004].includes(+get_curr_sub_menu_type.value)
    ) {
      params.isESport = 1;
    } else {
      params.isESport = null;
    }

    component_data.is_loading = to_refresh !== "hide_loading";
    // #TODO
    const tabs_active_data_cache =
      get_details_data_cache.value[
        `${match_id.value}-${get_details_item.value}`
      ];
    if (tabs_active_data_cache) {
      component_data.is_no_data = false;
    }
    // 调用: /v1/m/matchDetail/getMatchOddsInfoPB接口
    //赛果页面调用赛果玩法详情接口
    let http = ["result_details", "match_result"].includes(route.name)
      ? api_analysis.get_match_result
      : get_menu_type.value == 3000
      ? api_common.get_DJ_matchDetail_getMatchOddsInfo
      : api_common.get_matchDetail_getMatchOddsInfo;
    component_data.send_gcuuid = uid();
    params.gcuuid = component_data.send_gcuuid;
    // console.log(params,"paramsparamsparams");

    let temp = [];
    // 记录是否走的是缓存
    let is_cache = false;
    // 将要设置vuex中的详情玩法数据
    const details_data_cache = {};
    // 切换玩法集的时候先去判断历史的玩法集是否有数据，有数据则拦截返回 get_details_data_cache 中所有投注得信息，没有则继续请求
    if (
      !to_refresh &&
      !["result_details", "match_result"].includes(route.name) &&
      Object.keys(get_details_data_cache.value).length &&
      get_details_data_cache.value[`${match_id.value}-0`] &&
      get_details_data_cache.value[`${match_id.value}-0`].length
    ) {
      // 将 get_details_data_cache 中所有投注得信息的数据给details_data_cache
      details_data_cache[`${match_id.value}-0`] = JSON.parse(
        JSON.stringify(get_details_data_cache.value[`${match_id.value}-0`])
      );
      temp = get_details_data_cache_fillter(
        details_data_cache[`${match_id.value}-0`]
      );
      console.log("走缓存了", temp);
      component_data.is_cache = true;
      component_data.is_loading = true;
    }
    // temp.length === 0 在这里更新所有投注得信息
    if (temp.length === 0) {
      try {
        const _obj = {
          // axios api对象
          axios_api: http,
          // axios api对象参数
          params: params,
          max_loop: init_req ? 3 : 1,
          fun_catch: (err) => {
            component_data.is_loading = false;
            component_data.is_no_data = true;
          },
        };
        /************** 响应成功则继续往下走，失败则执行fun_catch **************/
        const { data: res } = await axios_api_loop(_obj);
        if (component_data.send_gcuuid != res.gcuuid) {
          return;
        }
        component_data.first_load = false;
        if (!lodash.get(res, "data") || lodash.get(res, "data.length") == 0) {
          component_data.is_loading = false;
          component_data.is_no_data = true;
          return;
        }

        component_data.is_no_data = false;
        const data = lodash.get(res, "data");
        details_data_cache[`${match_id}-0`] = data;
        // chipid进行处理
        const chpid_obj = {};
        data.forEach((item) => {
          if (item.chpid) {
            chpid_obj[item.chpid] = item.chpid;
          }
        });
        component_data.matchInfoCtr.setList(data);
        component_data.match_info_list = data;
        // console.log(chpid_obj,"chpid_obj");
        // set_chpid_obj(chpid_obj)

        if (["result_details", "match_result"].includes(route.name)) {
          temp = details_data_cache[`${match_id}-0`];
        } else {
          temp = get_details_data_cache_fillter(
            details_data_cache[`${match_id}-0`]
          );
        }
      } catch (error) {
        console.error(error);
      }
    }

    // 接着正常走历史逻辑
    try {
      //getMatchOddsInfo 接口拉取时，联动跟新投注框的数据
      //投注框初始状态或者锁盘时才跟新数据
      if (
        get_bet_status.value == 1 ||
        get_bet_status.value == 7 ||
        get_bet_status.value == 5
      ) {
        update_ol(null, temp);
      }

      if (temp && temp.length) {
        if (to_refresh == "details_refresh" && arr_hshow.length > 0) {
          save_expanded_state(temp);
        }
        playlist_length = temp.length;
        temp.forEach((item) => {
          // 盘口赔率同级别增加赛事类编号csid
          if (lodash.isArray(item.hl)) {
            item.hl.forEach((hls_array) => {
              if (lodash.isArray(hls_array.ol)) {
                hls_array.ol.forEach((ol_item) => {
                  ol_item.csid = get_detail_data.csid;
                });
              }
            });
          }
          // 附加盘收缩
          listItemAddCustomAttr(item);
        });
      }

      temp = save_hshow(temp); // 保存当前相关hshow状态;
      // 当前玩法集下数据缓存和所有的投注项
      details_data_cache[`${match_id}-${get_details_item.value}`] = temp;
      // set_details_data_cache(details_data_cache);
    } catch (err) {
      console.error(err);
    } finally {
      if (is_cache) {
        setTimeout(() => {
          component_data.is_loading = false;
        }, 100);
      } else {
        component_data.is_loading = false;
      }
      if (!["result_details", "match_result"].includes(route.name)) {
        // #TODO emit
        useMittEmit(MITT_TYPES.EMIT_MATCHINFO_LOADING, true);
        // useMittEmit(MITT_TYPES.EMIT_MATCHINFO_LOADING, true)
      }
      const tabs_active_data_cache =
        get_details_data_cache[`${match_id}-${get_details_item.value}`];

      // 当前赛事对应玩法集存在缓存数据
      // #TODO
      // if (tabs_active_data_cache) {
      //   component_data.matchInfoCtr.setList(
      //     lodash.cloneDeep(tabs_active_data_cache)
      //   );
      // } else {
      //   // 无数据
      //   component_data.is_no_data = true;
      //   component_data.matchInfoCtr.setList([]);
      // }
    }

    // return http(params).then(res => {
    //   if(send_gcuuid != res.gcuuid) return;
    //   first_load = false;
    //   if(!lodash.get(res,'data') || lodash.get(res,'data.length') == 0){
    //     return;
    //   }
    //   component_data.is_no_data = false;

    //   let temp = lodash.get(res, 'data');
    //   //getMatchOddsInfo 接口拉取时，联动跟新投注框的数据
    //   //投注框初始状态或者锁盘时才跟新数据
    //   if(get_bet_status == 1 || get_bet_status ==7 || get_bet_status == 5){
    //     update_ol(null, temp)
    //   }

    //   if(temp&&temp.length){
    //     if(to_refresh == 'details_refresh' && arr_hshow.length > 0){
    //       save_expanded_state(temp)
    //     }
    //     playlist_length = temp.length;
    //     temp.forEach(item => {
    //       // 盘口赔率同级别增加赛事类编号csid
    //       if(lodash.isArray(item.hl)){
    //         item.hl.forEach(hls_array => {
    //           if(lodash.isArray(hls_array.ol)){
    //             hls_array.ol.forEach(ol_item => {
    //               ol_item.csid = get_detail_data.csid;
    //             });
    //           }
    //         });
    //       }
    //       // 附加盘收缩
    //       listItemAddCustomAttr(item)
    //     });
    //   }

    //   // 当前玩法集下数据缓存
    //   const details_data_cache = {
    //     [`${match_id}-${get_details_item}`]: temp
    //   }
    //   set_details_data_cache(details_data_cache)
    // })
    //   .catch(err=>{
    //     console.error(err);
    //   })
    //   .finally(() => {
    //     is_loading = false;
    //     if(!['result_details', 'match_result'].includes(route.name)){
    //       useMittEmit(MITT_TYPES.EMIT_MATCHINFO_LOADING, true)
    //     }
    //     const tabs_active_data_cache = get_details_data_cache[`${match_id}-${get_details_item}`]

    //     // 当前赛事对应玩法集存在缓存数据
    //     if (tabs_active_data_cache) {
    //       matchInfoCtr.setList(lodash.cloneDeep(tabs_active_data_cache))
    //     } else {
    //       // 无数据
    //       component_data.is_no_data = true;
    //       matchInfoCtr.setList([])
    //     }
    //   })
  };
  /**
       * @description: axios_api轮询调用方法
       *
       * 使用例子:
       * let obj_ = {
        // axios api对象
        axios_api:api_home.get_menu_init,
        // axios api对象参数
        params:params,
        // axios中then回调方法
        fun_then: res => {},
        // axios中catch回调方法
        fun_catch: err => {},
        // 最大循环调用次数(异常时会循环调用),默认3次
        max_loop:3,
        // 异常调用时延时时间,毫秒数,默认1000
        timers:1000
      }
       // axios_api轮询调用方法
       $utils.axios_api_loop(obj_);
       *
       * @param {*} axios_api axios api对象
       * @param {*} params 参数
       * @param {*} fun_then axios中then回调方法
       * @param {*} fun_catch axios中catch回调方法
       * @param {*} max_loop 最大循环调用次数(异常时会循环调用),默认3次
       * @param {*} timers 异常调用时延时时间,毫秒数,默认1000
       * @param {*} loop_count 当前循环次数(只在内部回调时使用)
       * @param {*} timer 异常调用时延时器对象(只在内部回调时使用)
       * @return {*}
       */
  const axios_api_loop = async ({
    axios_api,
    params,
    fun_then = null,
    fun_catch = null,
    max_loop = 3,
    timers = 1000,
    loop_count = 0,
    timer = 0,
    new_params,
  }) => {
    // loop_count 当前循环次数(只在内部回调时使用)
    // timer 异常调用时延时器对象(只在内部回调时使用)
    // console.log({msg:'axios_api_loop',params,new_params,v:lodash.isEqual(params, new_params)}); // 比较新老参数方法
    // todo 传进来的params直接干掉,新的param直接在这里调用方法生成

    return new Promise((resolve, reject) => {
      //调用接口数据
      axios_api(params)
        .then((result) => {
          let res = {}
          if (result.status) {
            res = result.data
          } else {
            res = result
          }
          clearTimeout(timer);
          resolve(res);
        })
        .catch((e) => {
          console.error("----请求loop----", e);
          clearTimeout(timer);
          if (loop_count++ >= max_loop - 1) {
            fun_catch && fun_catch();
          } else {
            timer = setTimeout(() => {
              axios_api_loop({
                axios_api,
                params,
                fun_then,
                fun_catch,
                max_loop,
                timers,
                loop_count,
                timer,
              });
            }, timers);
          }
        });
    });
  };
  // 是否隐藏详情热门推荐
  const hide_detail_match_list = (flag) => {
    if (flag) {
      no_recommend_match_list = true;
    }
  };
  // 调用 玩法集列表接口
  const triggle_tabs_update = () => {
    // #TODO emit
    useMittEmit(MITT_TYPES.EMIT_TABS_LIST_UPDATE_HANDLE);
    // useMittEmit(MITT_TYPES.EMIT_TABS_LIST_UPDATE_HANDLE);
  };
  // 保存当前展开状态
  const save_expanded_state = (arr_list) => {
    arr_list.forEach((v_item) => {
      component_data.arr_hshow.forEach((v_m) => {
        if (v_item.topKey == v_m.topKey) {
          v_item.hshow = v_m.hshow;
        }
      });
    });
  };
  // 调用:/v1/m/matchDetail/getMatchOddsInfoPB接口
  const socket_upd_list = (skt_data, callback) => {
    // 调用接口的参数
    let params = {
      // 当前选中玩法项的id
      mcid: get_details_item.value,
      // 赛事id
      mid: match_id,
      // userId或者uuid
      cuid: get_uid,
      round:
        get_menu_type == 3000
          ? get_details_tabs_list.value &&
            get_details_tabs_list.value[get_subscript_game_index] &&
            get_details_tabs_list.value[get_subscript_game_index].round
          : null,
    };
    // 如果是 赛果下边的 电竞，则加 isESport 参数
    if (
      get_menu_type == 28 &&
      [100, 101, 102, 103].includes(+get_detail_data.csid)
    ) {
      params.isESport = 1;
    } else {
      params.isESport = null;
    }
    // 如果不是赛果多加上一个参数
    if (!["result_details", "match_result"].includes(route.name)) {
      params.showType = "2";
    }
    //赛果页面调用赛果玩法详情接口
    let http = ["result_details", "match_result"].includes(route.name)
      ? api_analysis.get_match_result
      : get_menu_type == 3000
      ? api_common.get_DJ_matchDetail_getMatchOddsInfo
      : api_common.get_matchDetail_getMatchOddsInfo;
      component_data.send_gcuuid = uid();
    params.gcuuid = component_data.send_gcuuid;
    http(params)
      .then((result) => {
        let res = {}
          if (result.status) {
            res = result.data
          } else {
            res = result
          }
        if (component_data.send_gcuuid != res.gcuuid) return;
        component_data.is_loading = false;
        if (!res.data || res.data.length == 0) {
          if (callback) callback();
          return;
        }
        component_data.is_no_data = false;
        var temp = lodash.get(res, "data");
        //getMatchOddsInfo 接口拉取时，联动跟新投注框的数据
        if (get_bet_status.value == 1 || get_bet_status.value == 7 || get_bet_status.value == 5) {
          update_ol(null, temp);
        }
        if (temp && temp.length) {
          if (component_data.arr_hshow.length > 0) {
            save_expanded_state(temp);
          }
          playlist_length = temp.length;
          temp.forEach((item) => {
            // 盘口赔率同级别增加赛事类编号csid
            if (lodash.isArray(item.hl)) {
              item.hl.forEach((hls_array) => {
                if (lodash.isArray(hls_array.ol)) {
                  hls_array.ol.forEach((ol_item) => {
                    ol_item.csid = get_detail_data.csid;
                  });
                }
              });
            }
            // 附加盘收缩
            listItemAddCustomAttr(item);
          });
        }

        temp = save_hshow(temp); // 保存当前相关hshow状态;
        // 当前玩法集下数据缓存
        const details_data_cache = {
          [`${match_id.value}-${get_details_item.value}`]: temp,
        };
        // set_details_data_cache(details_data_cache)
        if (callback) callback();
      })
      .catch((err) => console.error(err))
      .finally(() => {
        const tabs_active_data_cache =
          get_details_data_cache.value[
            `${match_id.value}-${get_details_item.value}`
          ];

        // 当前赛事对应玩法集存在缓存数据
        if (tabs_active_data_cache) {
          component_data.matchInfoCtr.setList(
            lodash.cloneDeep(tabs_active_data_cache)
          );
        } else {
          // 无数据
          component_data.is_no_data = true;
          component_data.matchInfoCtr.setList([]);
        }
      });
  };

  const save_hshow = (temp, list_old) => {
    let middle_data = null;
    if (list_old) {
      middle_data = lodash.cloneDeep(list_old);
    } else {
      middle_data = lodash.cloneDeep(component_data.matchInfoCtr.list);
    }
    let middle_obj = {};
    lodash.forEach(middle_data, (item) => {
      middle_obj[item.hpid + "-" + item.hpn] = [
        {
          hshow: item.hshow,
        },
      ];
    });
    lodash.forEach(temp, (item) => {
      if (middle_obj.hasOwnProperty(item.hpid + "-" + item.hpn)) {
        Object.assign(item, middle_obj[item.hpid + "-" + item.hpn][0]);
      }
    });
    return temp;
  };

  // 获取缓存数据
  const getdetail_cache_session = (params) => {
    // cach_key是存储在SessionStorage里面的单个玩法项
    let cach_key = `${params.mid}-${params.cuid}-${params.mcid}-cache`;
    // 获取在SessionStorage里面的缓存
    let cach_string = sessionStorage.getItem(cach_key);
    // 如果玩法存在
    if (cach_string) {
      // 解析JSON字符串
      let data = JSON.parse(cach_string);
      if (data && data.length) {
        if (component_data.arr_hshow.length > 0) {
          save_expanded_state(data);
        }
        // data是数组，其中每一项表示单个投注项
        playlist_length = data.length;
        data.forEach((item) => {
          // 盘口赔率同级别增加赛事类编号csid
          if (lodash.isArray(item.hl)) {
            item.hl.forEach((hls_array) => {
              if (lodash.isArray(hls_array.ol)) {
                hls_array.ol.forEach((ol_item) => {
                  ol_item.csid = get_detail_data.csid;
                });
              }
            });
          }
          // 列表子项增加自定义属性
          listItemAddCustomAttr(item);
        });
      }
      component_data.matchInfoCtr.setList(lodash.cloneDeep(data));
    }
    return cach_string;
  };

  //设置玩法缓存
  const set_detail_data_storage = (params, detail_data) => {
    let cach_key = `${params.mid}-${params.cuid}-${params.mcid}-cache`;
    if (!detail_data) {
      sessionStorage.removeItem(cach_key);
    } else {
      sessionStorage.setItem(cach_key, JSON.stringify(detail_data));
    }
  };

  //移除本地缓存
  const remove_session_storage = () => {
    let params = {
      mcid: get_details_item.value, // 玩法集id
      mid: match_id, // 赛事id
      cuid: get_uid, // userId或者uuid
    };
    let cach_key = `${params.mid}-${params.cuid}-${params.mcid}-cache`;
    sessionStorage.removeItem(cach_key);
  };

  //清除所有玩法缓存
  const remove_detail_storage = () => {
    remove_session_storage();

    let mid = match_id, // 赛事id
      cuid = get_uid.value; // userId或者uuid

    get_details_tabs_list.value &&
      get_details_tabs_list.value.forEach((tab) => {
        let mcid = tab.id;
        let cach_key = `${mid}-${cuid}-${mcid}-cache`;
        sessionStorage.removeItem(cach_key);
      });
  };
  // 添加相应监听事件
  const on_listeners = () => {
    // #TODO emit
    component_data.emitters = [
      // #TODO
      // useMittOn(MITT_TYPES.EMIT_CATEGORY_SKT, sendSocketInitCmd).off,
      useMittOn(MITT_TYPES.EMIT_REF_API, initEvent).off,
      useMittOn(MITT_TYPES.EMIT_HIDE_DETAIL_MATCH_LIST, hide_detail_match_list)
        .off,
    ];

  };
  // 移除相应监听事件
  const off_listeners = () => {
    // #TODO emit
    component_data.emitters.map((x) => x());
    useMittOn(MITT_TYPES.EMIT_CATEGORY_SKT, sendSocketInitCmd).off;
    useMittOn(MITT_TYPES.EMIT_REF_API, initEvent).off;
    useMittOn(MITT_TYPES.EMIT_HIDE_DETAIL_MATCH_LIST, hide_detail_match_list).off
  };
  return {
    component_data,
    show_recommend,
    match_list_new,
    match_list_normal,
    match_id,
    get_detail_data,
    get_details_item,
    get_goto_detail_matchid,
    get_menu_type,
    get_uid,
    get_details_tabs_list,
    get_subscript_game_index,
    get_fewer,
    get_curr_sub_menu_type,
    get_is_hengping,
    get_details_data_cache,
    get_chpid_obj,
    change_minheight,
    change_show,
    listItemAddCustomAttr,
    listItemRecoverCustomAttr,
    get_details_data_cache_fillter,
    initEvent,
    axios_api_loop,
    hide_detail_match_list,
    triggle_tabs_update,
    save_expanded_state,
    socket_upd_list,
    save_hshow,
    getdetail_cache_session,
    set_detail_data_storage,
    remove_session_storage,
    remove_detail_storage,
    on_listeners,
    off_listeners,
  };
};
