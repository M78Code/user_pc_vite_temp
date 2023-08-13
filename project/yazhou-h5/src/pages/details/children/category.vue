<template>
  <div class="category relative-position" ref="category">
    <!-- loading效果 -->
    <loading
        v-if="is_loading"
        :top="get_is_hengping ? '50%' : '58%'"
        :style="get_is_hengping ? 'left: unset;width: 2.8rem;' : ''"
    ></loading>

    <!--无盘口数据时,赛事推荐-->
    <div class="match-recommend-wrapper" v-if="show_recommend">
      <!-- 无数据背景图 -->
      <img :src="get_is_hengping ? (`${ $g_image_preffix }/image/wwwassets/bw3/svg/full_screen_match_odds_closed.svg`) : `${ $g_image_preffix }/image/wwwassets/bw3/svg/match_odds_closed.svg`" />
      <!-- 背景下面文字说明 -->
      <div class="empty-m-list-w">
        <!-- 当前赛事盘口已全部关闭-->
        <span v-if="get_details_item == 0">
          {{$root.$t('detail.odd_all_closed')}}
        </span>
        <!-- 盘口已关闭 -->
        <span v-else>
          {{$root.$t('detail.odd_closed')}}
        </span>
      </div>

      <!-- 热门推荐列表 视频横屏状态下不显示热门推荐 -->
      <div v-if="!get_is_hengping && !no_recommend_match_list">
        <!-- 热门推荐国际化 -->
        <div class="h-recommend-head row items-center">
          <div class="w">
            {{$root.$t('detail.popular_recommendation')}}
          </div>
        </div>
        <!-- 热门赛事列表 -->
        <detailMatchList invoke='category' ref="detail_match_list" />
      </div>
    </div>
    <!-- 详情玩法投注项有数据 -->
    <div v-if="!is_no_data && !is_loading" style="width:100%;height:auto;padding-bottom: 0.18rem;">
      <div slot="scrollList">
        <!-- 置顶操作时增加动画 -->
        <transition-group name="transition-play-list" tag="div" class="transition-zhiding">
          <!-- 置顶 -->
          <template v-for="(item,keyscorll) in match_list_new">
            <template v-if="item.hton!=0">
              <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="matchInfoCtr.list" :item_data="item" :scorllIndex="keyscorll"></tournament-play-new>
            </template>
          </template>
          <!-- 非置顶 -->
          <template v-for="(item,keyscorll) in match_list_normal">
            <template v-if="item.hton==0">
              <template v-if="match_list_new.length == 0">
                <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="matchInfoCtr.list" :item_data="item" :scorllIndex="keyscorll"></tournament-play-new>
              </template>
              <template v-else>
                <tournament-play-new @change_show="change_show" :key="item.topKey + item.hpid" :list="matchInfoCtr.list" :item_data="item"></tournament-play-new>
              </template>
            </template>
          </template>
        </transition-group>
      </div>
    </div>
    <!-- 详情玩法投注项无数据 -->
    <div v-if="!is_loading && is_no_data && !show_recommend" class="no-data-style">
      <no-data which='noMatch' height='500'></no-data>
    </div>
  </div>
</template>

<script>
// #TODO vuex 
// import { mapGetters, mapMutations } from "vuex"
import tournament_play_new from "project_path/src/pages/details/components/tournament-play/tournament-play-new.vue"
// 引入接口封装文件
import { api_common, api_result} from 'src/api/index.js'
//  无数据显示组件
// import no_data from "project_path/src/components/common/no-data.vue"

// #TODO mixins
// 引入skt_data_info
// import websocket_data from "src/public/mixins/websocket/data/skt_data_info.js";
// 引入投注逻辑mixin
// import betting from "project_path/src/mixins/betting/betting.js";


// 引入加载中的组件
import loading from "project_path/src/components/common/loading.vue"
// 引入处理数据的封装方法
import MatchInfoCtr from "src/core/match-class/match-info-ctr.js";
// 精选赛事
import detailMatchList from 'project_path/src/pages/details/components/detail-match-list.vue';
import { uid } from "quasar"
import lodash from "lodash";
import { useRouter, useRoute } from "vue-router";
import { useMittOn, useMittEmit, MITT_TYPES } from  "src/core/mitt"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch, defineComponent } from "vue";
export default defineComponent({
  name: "category",
  // #TODO mixins 
  // mixins:[websocket_data, betting],
  components: {
    'tournament-play-new': tournament_play_new,
    // 'no-data':no_data,
    loading,
    detailMatchList
  },
  props: {},
  setup(props, evnet) {
    const router = useRouter()
    const route = useRoute()
    const data = reactive({
      emitters: [],
      // 加载数据的效果
      is_loading: true,
      // 玩法集无数据
      is_no_data: true,
      // 是否无热门推荐赛事 // 改为真
      no_recommend_match_list: true,
      // 单个玩法集下的玩法数量
      playlist_length:undefined,
      // 所有数据集合
      matchInfoCtr: new MatchInfoCtr(this),
      // dom_play元素的观察对象
      observer_:undefined,
      // 第一次进来根据数据是否折叠玩法
      first_load: false,
      // 保存当前展开收起的状态
      arr_hshow: [],
      // 是否当前页刷新
      to_refresh: '',
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
    const show_recommend = computed(() => {
      let flag = false;
      if(!is_loading && is_no_data){
        if(route.name != 'match_result'){
          if(get_details_item){ //当前玩法下无数据就显示
            flag = true;
          }
        }
      }
      return flag;
    });
    // 置顶列表
    const match_list_new = computed(() => {
      return matchInfoCtr.listSortNew()
    });
    // 非置顶列表
    const match_list_normal = computed(() => {
      return matchInfoCtr.listSortNormal()
    });
    // 赛事id
    const match_id = computed(() => {
      return  get_goto_detail_matchid || get_detail_data.mid || route.params.mid
    });
    watch(
      () => route,
      (to, from) => {
        // 1. 非赛果页 且 不是通过搜索进入 2.搜索进入且已切换过玩法集
        if (
            get_menu_type !== 28 && !to.query.search_term && to.params.mid === from.params.mid
            || to.query.search_term && match_play_item_changed
        ) {
          initEvent();
        }
        // 当切换玩法集的时候变为: true
        first_load = true;
        match_play_item_changed = true
      }
    );
    // 监听赛事id的变化 如果赛事id变化 及时更新调用玩法集合的接口
    watch(
      () => get_goto_detail_matchid,
      () => {
        if(matchInfoCtr){
          matchInfoCtr.destroy()
        }
        matchInfoCtr = new MatchInfoCtr(this);
      }
    );
    // 监听get_fewer的值
    watch(
      () => get_fewer,
      (n) => {
        if(n != 3){
          if(Array.isArray(matchInfoCtr.list) && matchInfoCtr.list.length){
            for (const item of matchInfoCtr.list) {
              item.hshow = n == 1 ? 'Yes':'No'
            }
          }
        }
      }
    );
    // 横屏状态变化时
    watch(
      () => get_is_hengping,
      () => {
        change_minheight()
      }
    );
    // 显示推荐状态变化时
    watch(
      () => show_recommend,
      () => {
        change_minheight()
      }
    );
    onMounted(() => {
      // 原created 
      on_listeners();

      // 满足刷新页面保持向上展开的状态
      set_fewer(1);
      // 只有赛果详情才调用相应接口
      if (get_menu_type === 28 && route.name === 'match_result') {
        initEvent().then(() => {
          // 获取赛果数据后，滑动到顶部
          document.querySelector('.match-header-result').scrollTop = 0
        });
      }


      //函数防抖 在500毫秒内只触发最后一次需要执行的事件
      if(!['result_details', 'match_result'].includes(route.name)){
        socket_upd_list = debounce(socket_upd_list, 500);

        /*// 调用接口的参数
        let params = {
          // 当前选中玩法项的id
          mcid: get_details_item,
          // 赛事id
          mid: match_id,
          // userId或者uuid
          cuid: get_uid,
          round: get_menu_type == 3000 ? (get_details_tabs_list && get_details_tabs_list[get_subscript_game_index] && get_details_tabs_list[get_subscript_game_index].round) : null
        }

        cache_limiting_throttling_get_list(params, socket_upd_list, 'match_detail_odds_info')*/
      }

      // 原mounted 
      $nextTick(() => {
        change_minheight()
      })
    })
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
        let val = [1, 2].includes(+get_detail_data.csid) ? 1.24 : 0.84

        // 横屏 或 赛事盘口全部关闭 且无推荐赛事 时 不设置最小高度
        if (
            get_is_hengping ||
            show_recommend && !$refs.detail_match_list
        ) {
          $refs.category.style.minHeight = 'unset'
        } else {
          $refs.category.style.minHeight = window.innerHeight - rem(val) + 'px'
        }
      }
    };
    // 点击玩法名称,隐藏或是显示玩法赔率
    const change_show = () => {
      arr_hshow = []
      if(Array.isArray(matchInfoCtr.list) && matchInfoCtr.list.length){
        let flag1 = matchInfoCtr.list.every(item =>{
          return item.hshow == 'Yes'
        })
        let flag2 = matchInfoCtr.list.every(item =>{
          return item.hshow == 'No'
        })
        let obj_ = {}
        matchInfoCtr.list.forEach( (v_item, v_index)=> {
          obj_.topKey = v_item.topKey
          obj_.hshow = v_item.hshow
          arr_hshow.push(obj_)
          obj_ = {}
        })
        if(flag1){
          set_fewer(1)
        }else if(flag2){
          set_fewer(2)
        }else{
          set_fewer(3)
        }
      }
    };

    //列表子项增加自定义属性
    const listItemAddCustomAttr = (item) => {
      if(!item) {return;}
      if(get_fewer == 2 && playlist_length){
        item.hshow = 'No';
      }
      if(get_fewer == 1 && playlist_length && first_load){
        item.hshow = 'Yes';
      }
      if(item&&item.hl&&item.hl.length){
        item.hl.forEach(item2 => {
          if(item2.hid){
            matchInfoCtr.hl_obj[item2.hid]=item2;
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

    // 获取vuex中tab切换的玩法集数据，根据玩法集plays对应到所有数据hpid即可过滤数据。
    const get_details_data_cache_fillter = (all_data) => {
      const mcid =  get_details_item || (route.params.csid?'':route.params.mcid)
      const findItme = get_details_tabs_list.find( item=>item.id == mcid )
      // console.log(findItme,"findItme");
      const { plays= [],round='' } = findItme

      // console.log(get_chpid_obj,"set_chpid_objset_chpid_obj");
      const res = all_data.filter( item=>{
        // 电竞需要判断第一局和第二局的原因，需要加上chpid判断
        if( get_menu_type == 3000 ){
          if( round ){

            console.log( get_chpid_obj[`${item.hpid}-${round}`] ,round, item.chpid , item.hpid,"dsjfkldskjfs");
            //
            console.log(get_chpid_obj[`${item.hpid}-${round}`] , item.chpid,"get_chpid_obj[`${item.hpid}-${round}`] == `${item.hpid}-${round}`");
            return plays.includes( +item.hpid ) && ( get_chpid_obj[`${item.hpid}-${round}`] == item.chpid || item.chpid === item.hpid)
          }else{
            // 所有投注
            return plays.includes( +item.hpid )
          }
        }else{
         return plays.includes( +item.hpid )
        }
      })
      // console.log(plays,"playsplaysplaysplaysplays");
      // console.log(all_data,"all_dataall_dataall_data.all_dataall_data");
      // console.log(res,"最终过滤得数据");
      return res
    };

    /**
     * @description 初始化方法
     * @param to_refresh 
     * @param init_req
     * @returns {Promise<void>} 
     */
    const initEvent = async(to_refresh, init_req) => {
      if(to_refresh) {
        to_refresh = to_refresh
      }else{
        arr_hshow = []
      }

      let params = {
        // 赛果，赛果详情默认采用0，即是拉取所有的赛果
        // mcid: ['result_details', 'match_result'].includes(route.name) ? 0 : get_details_item || (route.params.csid?'':route.params.mcid), // 玩法集id
        // 2023/3/4 普通赛事,电竞详情拉取所有玩法集数据
        mcid:0,
        mid: match_id, // 赛事id
        cuid: get_uid, // userId或者uuid
        // round: get_menu_type == 3000 ? (get_details_tabs_list && get_details_tabs_list[get_subscript_game_index] && get_details_tabs_list[get_subscript_game_index].round) : null
        round:null
      }
      // 如果是 赛果下边的 电竞，则加 isESport 参数
      if(get_menu_type == 28 && [3001,3002,3003,3004].includes(+get_curr_sub_menu_type)){
        params.isESport = 1
      }else{
        params.isESport = null
      }

      is_loading = to_refresh !== 'hide_loading'

      const tabs_active_data_cache = get_details_data_cache[`${match_id}-${get_details_item}`]
      if(tabs_active_data_cache) {
        is_no_data = false;
      }
      // 调用: /v1/m/matchDetail/getMatchOddsInfoPB接口
      //赛果页面调用赛果玩法详情接口
      let http = ['result_details', 'match_result'].includes(route.name) ? api_result.get_match_result :
          (get_menu_type == 3000 ? api_common.get_DJ_matchDetail_getMatchOddsInfo : api_common.get_matchDetail_getMatchOddsInfo)
      send_gcuuid = uid();
      params.gcuuid = send_gcuuid;

      // console.log(params,"paramsparamsparams");

      let temp = []
      // 记录是否走的是缓存
      let is_cache = false
      // 将要设置vuex中的详情玩法数据
      const details_data_cache = {}
      // 切换玩法集的时候先去判断历史的玩法集是否有数据，有数据则拦截返回 get_details_data_cache 中所有投注得信息，没有则继续请求
      if( !to_refresh &&  !['result_details', 'match_result'].includes(route.name) && Object.keys(get_details_data_cache).length && get_details_data_cache[`${match_id}-0`] && get_details_data_cache[`${match_id}-0`].length ){
        // 将 get_details_data_cache 中所有投注得信息的数据给details_data_cache
        details_data_cache[`${match_id}-0`] = JSON.parse(JSON.stringify(get_details_data_cache[`${match_id}-0`]))
        temp = get_details_data_cache_fillter(details_data_cache[`${match_id}-0`])
        console.log("走缓存了",temp);
        is_cache = true
        is_loading = true
      }
      // temp.length === 0 在这里更新所有投注得信息
      if(temp.length === 0){
        try {
          const _obj = {
            // axios api对象
            axios_api: http,
            // axios api对象参数
            params: params,
            max_loop: init_req ? 3 : 1,
            fun_catch: err => {
              is_loading = false;
              is_no_data = true;
            }
          }
          /************** 响应成功则继续往下走，失败则执行fun_catch **************/
          const res = await axios_api_loop(_obj)

          if(send_gcuuid != res.gcuuid) {
            return;
          }
          first_load = false;
          if(!lodash.get(res,'data') || lodash.get(res,'data.length') == 0){
            is_loading = false;
            is_no_data = true;
            return;
          }
          
          is_no_data = false;
          const data = lodash.get(res, 'data');
          details_data_cache[`${match_id}-0`] = data
          // chipid进行处理
          const chpid_obj = {}
          data.forEach(item=>{
            if( item.chpid ){
              chpid_obj[item.chpid] = item.chpid
            }
          })
          // console.log(chpid_obj,"chpid_obj");
          set_chpid_obj(chpid_obj)
          
          if (['result_details', 'match_result'].includes(route.name)) {
            temp = details_data_cache[`${match_id}-0`]
          } else {
            temp = get_details_data_cache_fillter(details_data_cache[`${match_id}-0`])
          }
        } catch (error) {
          console.error(error);
        }
      }

      // 接着正常走历史逻辑
      try {
        //getMatchOddsInfo 接口拉取时，联动跟新投注框的数据
        //投注框初始状态或者锁盘时才跟新数据
        if(get_bet_status == 1 || get_bet_status ==7 || get_bet_status == 5){
          update_ol(null, temp)
        }

        if(temp&&temp.length){
          if(to_refresh == 'details_refresh' && arr_hshow.length > 0){
            save_expanded_state(temp)
          }
          playlist_length = temp.length;
          temp.forEach(item => {
            // 盘口赔率同级别增加赛事类编号csid
            if(lodash.isArray(item.hl)){
              item.hl.forEach(hls_array => {
                if(lodash.isArray(hls_array.ol)){
                  hls_array.ol.forEach(ol_item => {
                    ol_item.csid = get_detail_data.csid;
                  });
                }
              });
            }
            // 附加盘收缩
            listItemAddCustomAttr(item)

          });
        }

        temp = save_hshow(temp); // 保存当前相关hshow状态;
        // 当前玩法集下数据缓存和所有的投注项
        details_data_cache[`${match_id}-${get_details_item}`] = temp
        set_details_data_cache(details_data_cache)
      }catch(err){
        console.error(err);
      }finally{
        if(is_cache){
          setTimeout(() => {
            is_loading = false;
          }, 100);
        }else{
          is_loading = false;
        }
        if(!['result_details', 'match_result'].includes(route.name)){
          // #TODO emit 
          useMittEmit(MITT_TYPES.EMIT_MATCHINFO_LOADING, true);
          // $root.$emit(emit_cmd.EMIT_MATCHINFO_LOADING, true)
        }
        const tabs_active_data_cache = get_details_data_cache[`${match_id}-${get_details_item}`]

        // 当前赛事对应玩法集存在缓存数据
        if (tabs_active_data_cache) {
          matchInfoCtr.setList(lodash.cloneDeep(tabs_active_data_cache))
        } else {
          // 无数据
          is_no_data = true;
          matchInfoCtr.setList([])
        }
      }

      // return http(params).then(res => {
      //   if(send_gcuuid != res.gcuuid) return;
      //   first_load = false;
      //   if(!lodash.get(res,'data') || lodash.get(res,'data.length') == 0){
      //     return;
      //   }
      //   is_no_data = false;

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
      //       $root.$emit(emit_cmd.EMIT_MATCHINFO_LOADING, true)
      //     }
      //     const tabs_active_data_cache = get_details_data_cache[`${match_id}-${get_details_item}`]

      //     // 当前赛事对应玩法集存在缓存数据
      //     if (tabs_active_data_cache) {
      //       matchInfoCtr.setList(lodash.cloneDeep(tabs_active_data_cache))
      //     } else {
      //       // 无数据
      //       is_no_data = true;
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
    const axios_api_loop = async({axios_api,params,fun_then=null,fun_catch=null,max_loop=3,timers=1000, loop_count=0,timer=0,new_params}) => {
      // loop_count 当前循环次数(只在内部回调时使用)
      // timer 异常调用时延时器对象(只在内部回调时使用)
      // console.log({msg:'axios_api_loop',params,new_params,v:lodash.isEqual(params, new_params)}); // 比较新老参数方法
      // todo 传进来的params直接干掉,新的param直接在这里调用方法生成

      return new Promise((resolve,reject) => {
        //调用接口数据
        axios_api(params).then(res => {
          clearTimeout(timer);
          resolve(res);
        }).catch(e => {
          console.error('----请求loop----', e)
          clearTimeout(timer);
          if(loop_count++>=(max_loop-1)){
            fun_catch && fun_catch();
          } else {
            timer=setTimeout(() => {
              axios_api_loop({axios_api,params,fun_then,fun_catch,max_loop,timers,loop_count,timer});
            }, timers);
          }
        });
      })
      
    };
    // 是否隐藏详情热门推荐
    const hide_detail_match_list = (flag) => {
      if (flag) {
        no_recommend_match_list = true
      }
    };
    // 调用 玩法集列表接口
    const triggle_tabs_update = () => {
      // #TODO emit 
      useMittEmit(MITT_TYPES.EMIT_TABS_LIST_UPDATE_HANDLE);
      // $root.$emit(emit_cmd.EMIT_TABS_LIST_UPDATE_HANDLE);
    };
    // 保存当前展开状态
    const save_expanded_state = (arr_list) => {
      arr_list.forEach(v_item => {
        arr_hshow.forEach(v_m => {
          if(v_item.topKey == v_m.topKey){
            v_item.hshow = v_m.hshow
          }
        })
      })
    };
    // 调用:/v1/m/matchDetail/getMatchOddsInfoPB接口
    const socket_upd_list = (skt_data,callback) => {
      // 调用接口的参数
      let params = {
        // 当前选中玩法项的id
        mcid: get_details_item,
        // 赛事id
        mid: match_id,
        // userId或者uuid
        cuid: get_uid,
        round: get_menu_type == 3000 ? (get_details_tabs_list && get_details_tabs_list[get_subscript_game_index] && get_details_tabs_list[get_subscript_game_index].round) : null
      }
      // 如果是 赛果下边的 电竞，则加 isESport 参数
      if(get_menu_type == 28 && [100,101,102,103].includes(+get_detail_data.csid)){
        params.isESport = 1
      }else{
        params.isESport = null
      }
      // 如果不是赛果多加上一个参数
      if(!['result_details', 'match_result'].includes(route.name)){
        params.showType = '2'
      }
      //赛果页面调用赛果玩法详情接口
      let http = ['result_details', 'match_result'].includes(route.name) ? api_result.get_match_result :
          (get_menu_type == 3000 ? api_common.get_DJ_matchDetail_getMatchOddsInfo : api_common.get_matchDetail_getMatchOddsInfo)
      send_gcuuid = uid();
      params.gcuuid = send_gcuuid;
      http(params).then(res=>{
        if(send_gcuuid != res.gcuuid) return;
        is_loading = false;
        if(!res.data || res.data.length == 0){
          if(callback) callback();
          return;
        }
        is_no_data = false;
        var temp = lodash.get(res, 'data');
        //getMatchOddsInfo 接口拉取时，联动跟新投注框的数据
        if(get_bet_status == 1 || get_bet_status == 7 || get_bet_status == 5){
          update_ol(null, temp)
        }
        if(temp&&temp.length)
        {
          if(arr_hshow.length > 0){
            save_expanded_state(temp)
          }
          playlist_length = temp.length;
          temp.forEach(item => {
            // 盘口赔率同级别增加赛事类编号csid
            if(lodash.isArray(item.hl)){
              item.hl.forEach(hls_array => {
                if(lodash.isArray(hls_array.ol)){
                  hls_array.ol.forEach(ol_item => {
                    ol_item.csid = get_detail_data.csid;
                  });
                }
              });
            }
            // 附加盘收缩
            listItemAddCustomAttr(item)
          });
        }

        temp = save_hshow(temp); // 保存当前相关hshow状态;
        // 当前玩法集下数据缓存
        const details_data_cache = {
          [`${match_id}-${get_details_item}`]: temp
        }
        set_details_data_cache(details_data_cache)
        if(callback) callback();
      })
        .catch(err =>console.error(err))
        .finally(() => {
          const tabs_active_data_cache = get_details_data_cache[`${match_id}-${get_details_item}`]

          // 当前赛事对应玩法集存在缓存数据
          if (tabs_active_data_cache) {
            matchInfoCtr.setList(lodash.cloneDeep(tabs_active_data_cache))
          } else {
            // 无数据
            is_no_data = true;
            matchInfoCtr.setList([])
          }
        })
    };

    const save_hshow = (temp,list_old) => {
      let middle_data = null;
      if(list_old)
      {
        middle_data = lodash.cloneDeep(list_old);
      } else {
        middle_data = lodash.cloneDeep(matchInfoCtr.list);
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
        if(data && data.length){
          if(arr_hshow.length > 0){
            save_expanded_state(data)
          }
          // data是数组，其中每一项表示单个投注项
          playlist_length = data.length;
          data.forEach(item => {
            // 盘口赔率同级别增加赛事类编号csid
            if(lodash.isArray(item.hl)){
              item.hl.forEach(hls_array => {
                if(lodash.isArray(hls_array.ol)){
                  hls_array.ol.forEach(ol_item => {
                    ol_item.csid = get_detail_data.csid;
                  });
                }
              });
            }
            // 列表子项增加自定义属性
            listItemAddCustomAttr(item)
          });
        }
        matchInfoCtr.setList(lodash.cloneDeep(data));
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
        mcid: get_details_item, // 玩法集id
        mid: match_id, // 赛事id
        cuid: get_uid, // userId或者uuid
      }
      let cach_key = `${params.mid}-${params.cuid}-${params.mcid}-cache`;
      sessionStorage.removeItem(cach_key);
    };

    //清除所有玩法缓存
    const remove_detail_storage = () => {
      remove_session_storage();

      let mid = match_id, // 赛事id
          cuid = get_uid; // userId或者uuid

      get_details_tabs_list && get_details_tabs_list.forEach(tab => {
        let mcid = tab.id;
        let cach_key = `${mid}-${cuid}-${mcid}-cache`;
        sessionStorage.removeItem(cach_key);
      });

    };
    // 添加相应监听事件
    const on_listeners = () => {
      // #TODO emit 
      emitters = [
        useMittOn(MITT_TYPES.EMIT_CATEGORY_SKT, sendSocketInitCmd).off,
        useMittOn(MITT_TYPES.EMIT_REF_API, initEvent).off,
        useMittOn(MITT_TYPES.EMIT_HIDE_DETAIL_MATCH_LIST, hide_detail_match_list).off,
      ]
      // $root.$on(emit_cmd.EMIT_CATEGORY_SKT, sendSocketInitCmd);
      // $root.$on(emit_cmd.EMIT_REF_API, initEvent);
      // $root.$on(emit_cmd.EMIT_HIDE_DETAIL_MATCH_LIST, hide_detail_match_list)
    };
    // 移除相应监听事件
     const off_listeners = () => {
      // #TODO emit 
      emitters.map((x) => x())
      // $root.$off(emit_cmd.EMIT_CATEGORY_SKT, sendSocketInitCmd);
      // $root.$off(emit_cmd.EMIT_REF_API, initEvent);
      // $root.$off(emit_cmd.EMIT_HIDE_DETAIL_MATCH_LIST, hide_detail_match_list)
    };
    /**
    *@description: 销毁前:清除回调函数
    *@param {Undefined}
    *@return {Undefined} undefined
    */
    onUnmounted(() => {
      off_listeners();
      debounce_throttle_cancel(socket_upd_list);

      // 清除数据避免下次进来产生干扰
      set_details_data_cache({})

      if(matchInfoCtr) {
        arr_hshow = []
        matchInfoCtr.clearData()
        matchInfoCtr.destroy()
      }
    })
    return {
      ...toRefs(data),
      show_recommend,
      match_list_new,
      match_list_normal,
      match_id,
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
      off_listeners
    }
  }
})
</script>
<style lang="scss" scoped>
.category {
  width: 100%;
  min-height: 3.38rem;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 0.06rem;

  .match-recommend-wrapper {
    width: 100%;
    padding-top: 0.11rem;
    position: relative;

    img {
      width: 2rem;
      height: 1rem;
      display: block;
      margin: auto;
    }

    .empty-m-list-w {
      text-align: center;
      color: var(--q-color-com-fs-color-49);
      position: absolute;
      width: 100%;
      top: 0.8rem;
      font-size: 0.14rem;
    }

    .h-recommend-head {
      font-size: 0.14rem;
      color: var(--q-color-fs-color-1);
      line-height: 1;
      flex-wrap: nowrap;
      justify-content: center;

      &:after, &:before {
        content: ' ';
        display: block;
        width: 1.3rem;
        height: 0.01rem;
        transform: translateY(-0.01rem);
        background-image: var(--q-color-com-img-bg-1);
      }

      &:after {
        transform: translateY(-0.01rem) scaleX(-1);
      }

      .w {
        font-family: PingFangSC-Medium sans-serif;
        margin: 0 0.19rem;
      }
    }
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

.play-list-enter, .play-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.play-list-leave-active {
  position: absolute;
}
</style>
