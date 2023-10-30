<!--
 * @Author: Supermark
 * @Date: 2020-12-23 20:19:33
 * @Description: 虚拟体育玩法投注项区域
-->
<template>
  <div class='category virtual-sport'>
    <!-- 玩法集展示内容 -->
    <details-tab  
     :data_list="data_list" 
     :scroller_scroll_top="scroller_scroll_top" 
     :get_details_item="get_details_item"
     :new_match_detail_ctr="new_match_detail_ctr" /> 
    <!-- loading效果 -->
    <loading v-if="is_loading" :top="route.name == 'virtual_sports' ? '76%' : '64%'"></loading>
      <!-- 详情玩法投注项有数据 -->
    <div v-if="!is_no_data && !is_loading" style="width:100%;height:auto;background:#e4e6ed;">
      <div slot="scrollList" class="scrollList">
        <!-- 置顶操作时增加动画 -->
        <transition-group name="transition-play-list">
          <!-- 置顶 -->
          <template v-for="(item,keyscorll) in match_list_new">
            <template v-if="item.hton!=0">
              <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="matchInfoCtr?.list" :item_data="item" :scorllIndex="keyscorll"></tournament-play-new>
            </template>
          </template>
          <!-- 非置顶 -->
          <template v-for="(item,keyscorll) in match_list_normal">{{item.hpid}}
            <template v-if="item.hton==0">
              <template v-if="match_list_new.length == 0">
                <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="matchInfoCtr?.list" :item_data="item" :scorllIndex="keyscorll"></tournament-play-new>
              </template>
              <template v-else>
                <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="matchInfoCtr?.list" :item_data="item"></tournament-play-new>
              </template>
            </template>
          </template>
        </transition-group>
      </div>
      <div class="empty-box"></div>
    </div>
  </div>
</template>

<script>
// #TODO vuex
// import { mapGetters, mapMutations } from "vuex"
import tournament_play_new from "src/base-h5/components/details/components/tournament-play/tournament-play-new-2.vue"
 // 引入接口封装文件
import { api_common } from "src/api/index.js";
 // 引入投注逻辑mixin
 // #TODO mixins
// import betting from "src/project/mixins/betting/betting.js";
import detailsTab from "src/base-h5/components/details/components/details-tab-2.vue";
 // 引入加载中的组件
import loading from "src/base-h5/components/common/loading.vue"
import VirtualClass from "src/core/match-list-h5/virtual-sports/virtual-class"
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent,ref } from "vue";
import { useRoute, useRouter } from "vue-router"
import {debounce} from "lodash";
import { MatchDataWarehouse_H5_Detail_Common ,MatchDetailCalss,UserCtr } from "src/core";
import VirtualData from 'src/core/match-list-h5/virtual-sports/virtual-data.js'
import {details_main} from "../details.js";
export default defineComponent({
  name: "virtual_sports_category",
  props: {
    source:String,
    mid:String|Number,
    current_match:Object,
    // 顶部二级菜单切换状态
    top_menu_changed: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'tournament-play-new': tournament_play_new,
    loading,
    detailsTab
  },
  beforeRouteEnter(to, from, next) {
    next(() => {
      if(get_details_item == -1){
        router.replace({name: 'details_unsettle', params:{id: vm.get_goto_detail_matchid}})
      }
    });
  },
  // #TODO mixins
  // mixins:[betting],
  setup(props, evnet) {
    // 所有数据集合
    const matchInfoCtr =ref(MatchDataWarehouse_H5_Detail_Common)
    //数据仓库版本号  
    const match_info_version =ref(MatchDataWarehouse_H5_Detail_Common.data_version.version )
    let route =  useRoute()
    let router = useRouter()
    let state = reactive({
      // 事件集合
      emitters: [],
      // 加载数据的效果
      is_loading: true,
      // 玩法集无数据
      is_no_data: true,
      // 单个玩法集下的玩法数量
      playlist_length:undefined,
      // 玩法集合投注底部兼容白块的处理PS-12302
      // dom_play_bool: false,
   
      // dom_play元素的观察对象
      observer_:undefined,
      // 第一次进来根据数据是否折叠玩法
      first_load: false,
      // 赛事ID
      match_mid: 0,
      // 是否封盘
      is_lock_add: false,
      // 赛事状态变化监听计时器
      // match_setInterval:null,
      vsport:null,
      // 赛事总时长
      total_time:0,
      // 调用赛事总时长接口次数限制为10次
      count_num:0,
      // 赛事状态
      match_status:0,
      // 上次请求的虚拟体育赛马赛事id
      pre_params_mid:'',
    
      created_init_event:false,
      // 玩法集是否已切换过
      match_play_item_changed: false,
    });
    // #TODO VUEX
    // computed:{
    // ...mapGetters([
    //   'get_detail_data',
    //   'get_details_item',
    //   'get_first_details_item',
    //   'get_goto_detail_matchid',
    //   'get_uid.value',
    //   'get_show_video',
    //   "get_details_tabs_list",
    //   "get_fewer",
    //   "get_current_mid",
    //   "get_menu_type",
    //   "get_current_league",
    //   'get_is_user_refreshing',
    //   'get_is_show_details_analyse',
    // ]),
    const get_menu_type = VirtualData.current_sub_menu
    //详情页是否显示统计 
    const  get_is_show_details_analyse =ref(MatchDetailCalss.is_show_details_analyse) 
    const get_is_user_refreshing = ref(VirtualData.is_user_refreshing)
    let get_video_timer = null
     // 正在跳转详情的赛事 玩法集id 
     const  get_details_item =ref(MatchDetailCalss.details_item)
     //获取赛事ID
     const  get_current_mid =ref(route.params.mid)
     //
     const get_goto_detail_matchid =  ref(MatchDetailCalss.get_goto_detail_matchid)
     const get_first_details_item =  ref(MatchDetailCalss.first_details_item)

     const get_fewer =  ref(MatchDetailCalss.fewer)

     const get_uid =  ref(UserCtr.get_uid())
    // 置顶列表
    // const match_list_new = computed(() => {
    //   // TODO: 还未调试待修改
    //   return  lodash.get(matchInfoCtr.value, `list_to_obj.mid_obj[${route.query.mid}_].odds_info`);
    // });
    const match_list_new = ref([])
    // 非置顶列表
    const match_list_normal = ref(lodash.get(matchInfoCtr.value, `list_to_obj.mid_obj[${route.query.mid}_].odds_info`))
    console.log(matchInfoCtr.value,'matchInfoCtr.value',match_list_normal);
    const get_match_list_normal = () => {
      match_list_normal.value =  lodash.get(matchInfoCtr.value, `list_to_obj.mid_obj[${route.query.mid}_].odds_info`)
    };


    //押注状态0-隐藏状态 1-初始弹出状态,2-注单处理中状态,3-投注成功,4-投注失败(bet接口没返回200),5-盘口变化、失效，赔率变化，6-注单确认中（提交成功）,7-有投注项锁盘，8-单关投注失败(bet接口返回200)
    const get_bet_status = computed(() => {
      return 0;
    });
    // #TODO vuex
    // watch(
    //   () => get_current_league.menuId,
    //   () => {
    //     initEvent();
    //   }
    // );
    // 监听current_match的状态
    watch(
      () =>state.match_status,
      (new_) => {
        // match_status == 1 比赛开始时 拉取当前此赛事的视频总时长
        if(new_ == 1){
          get_video_Time()
        }
        // match_status == 2 比赛结束时 拉取当前赛事的赛果接口 显示赛果
        if(new_ == 2){
          get_match_result()
        }
      }
    );
    // 虚拟体育切换玩法集id(赛事结束也可以切换玩法集ID)
    watch(
      () => get_details_item.value,
      () => {
        if(state.created_init_event){
          state.created_init_event = false
          // return
        }

        // 当赛事结束时:切换玩法集调用赛事结果的接口
        if(state.match_status == 2){
          get_match_result()
        }else{
          // 当赛事等于赛前/开赛中的时候  调用玩法集的接口
          initEvent();
        }
      }
    );
    watch(
      () => route,
      (to, from) => {
        initEvent();
        // 当切换玩法集的时候变为: true
        state.first_load = true;
      }
    );
    watch(
      () => props.current_match,
      (to, from) => {
        if(!state.created_init_event){
          initEvent();
        }
        state.created_init_event = false;
      }
    );
    watch(
      () => get_current_mid.value,
      () => {
        initEvent();
      }
    );
    // 监听赛事id的变化 如果赛事id变化 及时更新调用玩法集合的接口
    watch(
      () => get_goto_detail_matchid.value,
      (new_) => {
        initEvent();
      }
    );
    // 监听详情数据仓库版本号更新odds_info数据
    watch(() => matchInfoCtr.value.data_version.version, () => {
        get_match_list_normal()
    },{deep:true})
    // 监听get_fewer的值
    watch(
      () => get_fewer.value,
      (n) => {
        if(n != 3){
          if(Array.isArray(matchInfoCtr.value.list) && matchInfoCtr.value.list.length){
            for (const item of matchInfoCtr.value.list) {
              item.hshow = n == 1 ? 'Yes':'No'
            }
          }
        }
      }
    );
       // 调用:/v1/m/matchDetail/getMatchOddsInfoPB接口
    const socket_upd_list =debounce((skt_data,callback) => {
           let mid
           if(route.name == "virtual_sports"){
             mid = get_current_mid.value
           }else if(route.name == "virtual_sports_details"){
             mid = route.query.mid
           }

           // 调用接口的参数
           let params = {
             // 当前选中玩法项的id
             mcid: get_details_item.value,
             // 赛事id
             mid: mid,
             // userId或者uuid
             cuid: get_uid.value,
             showType: '2'
           }
           // 获取缓存数据，将参数params传进去
           getdetail_cache_session(params);
           api_common.get_matchDetail_getVirtualMatchOddsInfo(params).then(res=>{
             state.is_loading = false;

             if(!res.data || res.data.length == 0){
               state.is_no_data = true;
               matchInfoCtr.value.set_match_details(matchInfoCtr.value.get_quick_mid_obj(params.mid),[]);
               set_detail_data_storage(params,'');
               if(callback) callback();
               return;
             }
             state.is_no_data = false;
             var temp = lodash.get(res, 'data');
             set_detail_data_storage(params,temp);
             try {   //getMatchOddsInfo 接口拉取时，联动跟新投注框的数据
               if(get_bet_status == 1 || get_bet_status == 7 || get_bet_status == 5){
                 update_ol(null, temp)
               }
             } catch (error) {
               console.error(error)
             }
             if(temp&&temp.length)
               {
                state.playlist_length = temp.length;
                 temp.forEach(item => {
                   // 附加盘收缩
                   listItemAddCustomAttr(item)
                 });
               }
             temp = save_hshow(temp); // 保存当前相关hshow状态;
             matchInfoCtr.value.set_match_details(matchInfoCtr.value.get_quick_mid_obj(params.mid),lodash.cloneDeep(temp));
             delete res.data;
             if(callback) callback();
           }).catch(err =>console.error(err));
           $forceUpdate();
          },500)
     
    onMounted(() => {
      // 原created
      // 延时器
     get_video_timer = null;
      // 满足刷新页面保持向上展开的状态
      MatchDetailCalss.set_fewer(1);
      // #TODO emit
      state.emitters.push(useMittOn(MITT_TYPES.EMIT_REF_API, sendSocketInitCmd).off);
      // useMittOn(MITT_TYPES.EMIT_REF_API, initEvent);

      if(route.query.mid || route.name == 'virtual_sports'){
        init_vsport();
      }

      state.created_init_event = true;
      // 不做ms的判断 进入详情页即调玩法集接口  :因为现在ms的状态不统一
      // 虚拟体育赛事结束时调用赛事结果的接口  否则刷新调用玩法集的接口
      if((props.current_match && props.current_match.match_status == 2) || get_score_list().length){
        get_match_result()
      }
      // 1.顶部菜单切换及赛事期数切换时 过滤重复请求
      // 2.顶部按钮刷新触发
      else if (
          !props.top_menu_changed && get_first_details_item.value=== get_details_item.value
          || get_is_user_refreshing.value
          || !get_is_show_details_analyse.value
      ) {
        initEvent(props.mid);
        // 刷新过后重置刷新状态
        VirtualData.set_is_user_refreshing(false)
      }

      // 重置顶部菜单切换状态
      // #TODO emit
      // $emit('top_menu_change', false)
      // #TODO emit
      state.emitters.push(useMittOn(MITT_TYPES.EMIT_CATEGORY_SKT, sendSocketInitCmd).off);
      // useMittOn(MITT_TYPES.EMIT_CATEGORY_SKT, sendSocketInitCmd);
      //函数防抖 在500毫秒内只触发最后一次需要执行的事件
      // 调用接口的参数
      let params = {
        // 当前选中玩法项的id
        mcid: get_details_item.value,
        // 赛事id
        mid: get_goto_detail_matchid.value,
        // userId或者uuid
        cuid: get_uid.value,
        showType: '2'
      }
      // cache_limiting_throttling_get_list(params, socket_upd_list, 'match_detail_odds_info')
    })
    // #TODO vuex
    // methods: {
    // ...mapMutations([
    //   "set_fewer",
    //   "set_detail_data_assign",
    //   'set_is_user_refreshing',
    // ]),
    /* 后续做 todo */ 
    const sendSocketInitCmd =()=>{

    }
    /**
     * 获取赛马最终结果
     */
    const get_score_list = () => {
      let res = [];
      if(props.current_match && props.current_match.list && props.current_match.list.length){
        let last_win_obj = props.current_match.list[props.current_match.list.length - 1];
        if(last_win_obj){
          res.push(last_win_obj.ranking1);
          res.push(last_win_obj.ranking2);
          res.push(last_win_obj.ranking3);
        }
      }
      return res;
    };
    /**
     * @description: 初始化VSport
     */
    const init_vsport = () => {
      if(VirtualClass){
        VirtualClass.destroy();
      }
      // vsport = new VSport(props.current_match,(res)=>{
      //   if(res.match_status == 0){
      //     // console.warn(res.match_status,"----->>match_status",res.upd_time,"----->>upd_time");
      //     if(res.upd_time>=-10){
      //       if(!is_lock_add){
      //         set_all_match_os_status(2)
      //         $forceUpdate();
      //       }
      //       is_lock_add = true;
      //     }
      //   } else if(res.match_status == 1){
      //     if(!is_lock_add){
      //       set_all_match_os_status(2)
      //       $forceUpdate();
      //     }
      //     is_lock_add = true;
      //   } if(res.match_status == 2){
      //   }
      //   if(source=='virtual_sports_details')
      //   {
      //     set_detail_data_assign((detail_data)=>{
      //       $set(detail_data, 'match_status',res.match_status);
      //     });
      //   } else{
      //     $set(props.current_match, 'match_status',res.match_status);
      //   }
      //   match_status = res.match_status;
      //   // console.log(props.current_match.totalTime+'---------props.current_match----------'+props.current_match.match_status)
      // })
    };
    /**
     *@description: 获取当前赛事视频总时长
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    const get_video_Time = () => {
      if(get_detail_data){
        let params = {
          tid: get_detail_data.tid,
          batchNo: get_detail_data.batchNo
        }
        api_common.get_Video_MaxTime(params).then(res => {
          let res_data = null;
          if (res.code == 200) {
            res_data = lodash.get(res,'data');
            let totalTime = res_data[params.tid]
            if(source=='virtual_sports_details')
            {
              set_detail_data_assign((detail_data)=>{
                $set(detail_data, 'totalTime',totalTime);
              });
            } else{
              $set(props.current_match, 'totalTime',totalTime);
            }
          }
          if(get_video_timer) { clearTimeout(get_video_timer) }
          get_video_timer = setTimeout(() => {
            if(!res_data && count_num < 10){
              count_num++
              get_video_Time()
            }
          },1000);
        }).catch(err => {
          console.error(err);
        });
      }
    };
    /**
     *@description: 虚拟体育title字段新增
     *@param {Object} 所有的玩法数据集合
     *@return {Object} 组合后的所有玩法数据集合
     */
    const vir_add_title = (temp) => {
      let res = [];
      if(temp){
        temp.forEach(item => {
          //虚拟体育不对这3个模板特殊处理
          if ([13,14,15].includes(item.hpt)) {
          } else if(item.title && item.hpid && (![0, 2, 4, 5, 7, 10, 11].includes(item.hpt))){
            let title = item.title;
            if(item.hl){
              item.hl.forEach(hl_item => {
                if(hl_item && hl_item.ol){
                  hl_item.ol.forEach((ol_item, i) => {
                    ol_item.otd = ol_item.otd?ol_item.otd:(100*i)+ol_item.otd;
                    title.push({osn:ol_item.on, otd:ol_item.otd});
                  });
                }
              });
            }
          }
        });
        temp = temp;
      }
      return temp;
    };
    /**
     * @description:  设置所有盘口状态(虚拟足球+赛马)
     * @param {Number} status 盘口状态
     */
    const set_all_match_os_status = (status, list_data) => {
      let list = matchInfoCtr.value.list;
      if(list_data){
        list = list_data;
      }
      if(list && list.length){
        list.forEach(item => {
          if(item.title && item.hpid){
            if(item.hl){
              item.hl.forEach(hl_item => {
                if(hl_item && hl_item.ol){
                  hl_item.ol.forEach((ol_item, i) => {
                    ol_item.os = status;
                  });
                }
              });
            }
          } else if(item.plays&&item.plays.length){
            item.plays.forEach(plays_item => {
              if(plays_item.hpid){
                if(plays_item.hl){
                  plays_item.hl.forEach(hl_item => {
                    if(hl_item && hl_item.ol){
                      hl_item.ol.forEach((ol_item, i) => {
                        ol_item.os = status;
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    };
    const change_show = (val) => {
      if(Array.isArray(matchInfoCtr.value.list) && matchInfoCtr.value.list.length){

        let flag1 = matchInfoCtr.value.list.every(item =>{
          return item.hshow == 'Yes'
        })

        let flag2 = matchInfoCtr.value.list.every(item =>{
          return item.hshow == 'No'
        })

        if(flag1 || (val && val ==1)){
          MatchDetailCalss.set_fewer(1)
        }else{
          MatchDetailCalss.set_fewer(3)
        }

        if(val){
          if(flag2 && (val && val ==2)){
            MatchDetailCalss.set_fewer(2)
          }else{
            MatchDetailCalss.set_fewer(3)
          }
        }else{
          if(flag2){
            MatchDetailCalss.set_fewer(2)
          }else{
            MatchDetailCalss.set_fewer(3)
          }
        }

      }
    };
    const check_data = (data) => {
      var bool =  lodash.some(data,async(v,k)=>{
        if(v.hl.length >=80) return true;
      })
      return bool;
    };

    const zhiding = () => {
      initEvent();
    };

    //列表子项增加自定义属性
    const listItemAddCustomAttr = (item) => {
      if(!item) {return;}
      // 附加盘收缩
      // playlist_length:单个玩法集下的玩法数量存在而且玩法数量小于11
      if(state.playlist_length && state.playlist_length < 11) item.hshow = 'Yes';
      if(get_fewer.value == 2 && state.playlist_length){
        item.hshow = 'No';
      }
      if(get_fewer.value == 1 && state.playlist_length && state.first_load){
        item.hshow = 'Yes';
      }
      if(item&&item.hl&&item.hl.length)
      {
        item.hl.forEach(item2 => {
          if(item2.hid){
            matchInfoCtr.value.list_to_obj.hl_obj[item2.hid]=item2;
          }
          if(item2&&item2.ol&&item2.ol.length){
            item2.ol.forEach(item3 => {
              // 押注项设置盘口状态
              Object.assign(item3,{
                hs:(item2.hs?item2.hs:0),
                ms:0,
                id_: item2.hn?`${item.mid}_${item.chpid || item.hpid}_${item3.ot}_${item2.hn}`:item3.oid,
                });
            });
          }
        });
      }
    };

    //列表子项恢复之前的自定义属性
    const listItemRecoverCustomAttr = (item_new, item_old) => {
      if(item_old.length && Array.isArray(item_old)){
        for (const item of item_old) {
          for (const item2 of item_new) {
            if(item.hpid == item2.hpid){  //根据玩法id判断是否合并数据
              let temp__ = {};
                temp__ = {hshow:item.hshow};
                //恢复数据
              Object.assign(item2, temp__);
            }
          }
        }
      }
    };

    const initEvent = () => {
      if(state.match_status == 2) return
      state.is_loading = true;

      let mid
      if(route.name == "virtual_sports"){
        mid = get_current_mid.value
      }else if(route.name == "virtual_sports_details" ||  route.name == "virtual_sports_category"){
        mid = route.query.mid
      }

      state.match_mid = mid;
      let params = {
        mcid: get_details_item.value, // 玩法集id
        mid, // 赛事id
        cuid: get_uid.value, // userId或者uuid
      }
      if(!params.mid) {
        return;
      }
      state.pre_params_mid = params.mid;
      let cache_data_str = getdetail_cache_session(params);
      if(cache_data_str) {
        // is_loading = false;
        state.is_no_data = false;
      }
      // 正常赛事调用: /v1/m/matchDetail/getMatchOddsInfoPB接口
      // 虚拟体育调用: /v1/m/matchDetail/getVirtualMatchOddsInfo接口
      api_common.get_matchDetail_getVirtualMatchOddsInfo(params).then(res => {
       state.is_loading = false;
        if(!res.data || res.data.length == 0){
          state.is_no_data = true;
          matchInfoCtr.value.set_match_details(matchInfoCtr.value.get_quick_mid_obj(params.mid),[]);
          set_detail_data_storage(params,'');
          return;
        }
        state.is_no_data = false;

        let temp = lodash.get(res, 'data');
        if(state.is_lock_add){
          set_all_match_os_status(2, temp);
        }
        // 赛马数据字段增加
        if(temp){
          vir_add_title(temp)
        }

        try {  //getMatchOddsInfo 接口拉取时，联动更新投注框的数据
          //投注框初始状态或者锁盘时才跟新数据
          if(get_bet_status == 1 || get_bet_status ==7 || get_bet_status == 5){
            update_ol(null, temp)
          }
        } catch (error) {
          console.error(error)
        }
        set_detail_data_storage(params,temp);
        if(temp&&temp.length)
        {
          state.playlist_length = temp.length;
          temp.forEach(item => {
            // 附加盘收缩
            listItemAddCustomAttr(item)
          });
        }
        let list_ = lodash.cloneDeep(temp);
        matchInfoCtr.value.set_match_details(matchInfoCtr.value.get_quick_mid_obj(params.mid),list_);
        delete res.data;
      })
    };
    /**
     *@description: 获取虚拟足球赛事的赛果
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    const get_match_result = () => {
      let params = {
        mid: route.query.mid,
        mcid: get_details_item.value,
        cuid: get_uid.value, // userId或者uuid
      }
      // 传值赛事id: mid
      api_common.get_virtual_matchResult(params).then( res => {
        state.is_loading = false;
        if(!res.data || res.data.length == 0){
          state.is_no_data = true;
          matchInfoCtr.value.set_match_details(matchInfoCtr.value.get_quick_mid_obj(params.mid),[]);
          set_detail_data_storage(params,'');
          return;
        }
        state.is_no_data = false;

        let result_list = lodash.get(res, 'data');
        // 虚拟体育title字段增加
        vir_add_title(result_list)
        let result_ = lodash.cloneDeep(result_list);
        matchInfoCtr.value.set_match_details(matchInfoCtr.value.get_quick_mid_obj(params.mid),result_);
      }).catch( err=> {
        console.error(err);
      })
    };

    const triggle_tabs_update = () => {
      // #TODO emit
      useMittEmit(MITT_TYPES.EMIT_TABS_LIST_UPDATE_HANDLE);
      // useMittEmit(MITT_TYPES.EMIT_TABS_LIST_UPDATE_HANDLE);
    };

 

    const save_hshow = (temp,list_old) => {

      let middle_data = null;
      if(list_old)
      {
        middle_data = lodash.cloneDeep(list_old);
      } else {
        middle_data = lodash.cloneDeep(matchInfoCtr.value.list);
      }
      let middle_obj = {}
      lodash.forEach(middle_data, (item) =>{
        middle_obj[item.hpid+ '-' +item.hpn] = [{
          hshow: item.hshow
        }]
      })
      lodash.forEach(temp, item=>{
        if(middle_obj.hasOwnProperty(item.hpid+'-'+item.hpn)){
          Object.assign(item, middle_obj[item.hpid+ '-' +item.hpn][0]);
        }
      })
      return temp;
    };
    // 获取缓存数据
    const getdetail_cache_session = (params) => {
      // cach_key是存储在SessionStorage里面的单个玩法项
      let cach_key = `${params.mid}-${params.cuid}-${params.mcid}-cache`;
      // 获取在SessionStorage里面的缓存
      let cach_string = sessionStorage.getItem(cach_key);
      // 如果玩法存在
      if(cach_string){
        // 解析JSON字符串
        let data = JSON.parse(cach_string);
        let none_data = '';
        if(data && data.length){
          // data是数组，其中每一项表示单个投注项
          state.playlist_length = data.length;
          data.forEach(item => {
            // 列表子项增加自定义属性
            listItemAddCustomAttr(item)
          });
        }
        let list_ = lodash.cloneDeep(data);
        if(state.is_lock_add){
          set_all_match_os_status(2, list_);
        }
        matchInfoCtr.value.set_match_details(matchInfoCtr.value.get_quick_mid_obj(params.mid),list_);
      }
      return cach_string;
    };

   //设置玩法缓存
   const set_detail_data_storage = (params,detail_data) => {
      let cach_key = `${params.mid}-${params.cuid}-${params.mcid}-cache`;
      if(!detail_data){
        sessionStorage.removeItem(cach_key);
      }else{
        sessionStorage.setItem(cach_key,JSON.stringify(detail_data));
      }
    };

    //移除本地缓存
    const remove_session_storage = () => {
      let params = {
        mcid: get_details_item.value, // 玩法集id
        mid: get_goto_detail_matchid.value, // 赛事id
        cuid: get_uid.value, // userId或者uuid
      }
      let cach_key = `${params.mid}-${params.cuid}-${params.mcid}-cache`;
      sessionStorage.removeItem(cach_key);
    };

    //清除所有玩法缓存
    const remove_detail_storage = () => {
      remove_session_storage();

      let mid = get_goto_detail_matchid.value, // 赛事id
        cuid = get_uid.value; // userId或者uuid

      get_details_tabs_list && get_details_tabs_list.forEach(tab => {
        let mcid = tab.id;
        let cach_key = `${mid}-${cuid}-${mcid}-cache`;
        sessionStorage.removeItem(cach_key);
      });
    };
    //设置玩法集
    const data_list = ref(MatchDetailCalss.category_arr)
    watch(
      () => MatchDetailCalss.details_data_version.version,
      (val) => {
        if (val) {
          data_list.value = MatchDetailCalss.category_arr
          get_details_item.value = MatchDetailCalss.details_item
        }
      },
      { deep: true }
   );
    /**
     *@description: 销毁前:清除回调函数
     *@param {Undefined}
     *@return {Undefined} undefined
    */
    onUnmounted(() => {
      // 取消订阅事件
      // #TODO emit
      state.emitters.map((x) => x())
      // useMittOn(MITT_TYPES.EMIT_REF_API, initEvent).off;
      // useMittOn(MITT_TYPES.EMIT_CATEGORY_SKT, sendSocketInitCmd).off;
      if(VirtualClass){
        VirtualClass.destroy();
      }

      clearTimeout(get_video_timer)
      get_video_timer = null
    })
    const {
      scroller_scroll_top,
      new_match_detail_ctr

    } = details_main()
    return {
      ...toRefs(state),
      match_list_new,
      match_list_normal,
      get_score_list,
      init_vsport,
      get_video_Time,
      vir_add_title,
      set_all_match_os_status,
      change_show,
      check_data,
      zhiding,
      listItemAddCustomAttr,
      listItemRecoverCustomAttr,
      initEvent,
      get_match_result,
      triggle_tabs_update,
      socket_upd_list,
      save_hshow,
      getdetail_cache_session,
      set_detail_data_storage,
      remove_session_storage,
      remove_detail_storage,
      route,
      match_info_version,
      matchInfoCtr,
      data_list,
      scroller_scroll_top,
      get_details_item,
      new_match_detail_ctr
    }
  }
})
</script>
<style lang="scss" scoped>
.category {
  width: 100%;
  height: auto;
  max-width: 7rem;

  .scrollList {
    padding-top:0.06rem;
    &::-webkit-scrollbar {
      display: none;
    }

    overflow-x: scroll;
    overflow-y: hidden;
  }
}

.no-data-style {
  position: absolute;
  left: 0;
  right: 0;
}

.max-width {
  max-width: 7rem;
}

.dom_play {
  width: 100%;
  height: 0.47rem;
  max-width: 7rem;
}

.empty-box {
  height: 0.18rem;
}
</style>
