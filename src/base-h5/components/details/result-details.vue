<!--
 * @Author: Supermark
 * @Date: 2021-02-07 10:30:39
 * @Description: 赛果详情
-->
<template>
  <!-- 赛果 -->
  <div class="match-header-result hide-scrollbar">
    <!-- 足球赛事分析 页面-->
    <q-dialog v-model="analysis_show.football" position="bottom">
      <analysis-football-matches></analysis-football-matches>
    </q-dialog>
    <!-- 篮球赛事分析 页面-->
    <q-dialog v-model="analysis_show.basketball" position="bottom">
      <basketball-match-analysis></basketball-match-analysis>
    </q-dialog>
    <!-- 赛果头部+tab区域 -->
    <div class="header-tab">
      <div class="relative-position scroll-video-h">
        <result-header :result_detail_data="result_detail_data" />
      </div>
      <!-- 赛果tab集 -->
      <result-details-tab :tab_index="route.params.index" :result_detail_data="result_detail_data" />
    </div>
    <!-- 下拉联赛列表 -->
    <template>
      <q-dialog v-model="is_dialog_details" position="top" v-cloak>
        <result-details-dialog
          :detail_data="result_detail_data"
          :math_list_data="math_list_data"
        ></result-details-dialog>
      </q-dialog>
    </template>
    <!--玩法集cagetory-->
    <div :class="get_detail_data.csid == 3 ?'baseball-play-pad':'play-pad'">
      <router-view v-if="loading"/>
    </div>
    <!--赛果详情骨架屏-->
    <!-- <SResult v-if="skeleton_loading" :loading_body="skeleton.changeTab"/> -->
  </div>
</template>

<script setup>
// import { mapGetters, mapMutations } from "vuex";
import { api_common } from "src/api/index.js";
// import resultHeader from "src/base-h5/components/details/components/result-header.vue";
import resultDetailsTab from "src/base-h5/components/details/components/result-details-tab.vue";
// TODO: src/components有相同的组件
import resultDetailsDialog from "src/base-h5/components/details/result-details-dialog.vue";
import noData from "src/base-h5/components/common/no-data.vue";
import analysisFootballMatches from "src/base-h5/components/details/analysis-matches/football-match-analysis/analysis-football-matches.vue";
import basketballMatchAnalysis from "src/base-h5/components/details/analysis-matches/basketball-match-analysis/basketball-match-analysis.vue";
// 赛果详情骨架屏
import SResult from "src/base-h5/components/skeleton/match-result.vue" 
import { useMittOn, useMittEmit, MITT_TYPES } from "src/core/mitt/index.js"
import { useRouter, useRoute } from "vue-router";
import lodash from "lodash";
import UserCtr from "src/core/user-config/user-ctr.js";
import { computed, onMounted, onUnmounted, watch, ref, reactive } from "vue";
import { MatchDataWarehouse_H5_Detail_Common, format_plays, format_sort_data, MatchDetailCalss } from "src/output/index.js";

let route = useRoute()
// 赛果详情初始化数据仓库数据
const MatchDataWarehouseInstance = reactive(MatchDataWarehouse_H5_Detail_Common)
  // 详情接口所有数据
  const result_detail_data = ref({}) 
  // 是否显示下拉联赛列表
  const is_dialog_details = ref(false) 
  // 赛事列表数据
  const math_list_data = ref([]) 
  const loading = ref(false) 
  // 是否显示分析页面
  const analysis_show = ref({
    football: false,
    basketball: false,
  }) 
  //骨架屏加载状态
  const skeleton = ref({
    header: false,//头部数据
    list: false,//列表数据
    changeTab: false,//切换tab
  }
  )
    // ...mapGetters([
    //   // 获取列表页当前选中二级菜单时间
    //   "get_current_menu",
    //   "get_menu_type",
    //   "get_detail_data",
    //   "get_goto_detail_matchid",
    //   "get_curr_sub_menu_type"
    // ]),
    //   "get_current_menu",
    //   "get_menu_type",
    //   "get_detail_data",
    //   "get_goto_detail_matchid",
    //   "get_curr_sub_menu_type"
   const get_current_menu = computed(() =>{
      return ""
    })
   const get_menu_type = computed(() =>{
      return ""
    })
   const get_detail_data = computed(() =>{
      return ""
    })
   const get_goto_detail_matchid = computed(() =>{
      return ""
    })
   const get_curr_sub_menu_type = computed(() =>{
      return ""
    })
   const is_match_result = computed(() =>{
      return ['result_details', 'match_result'].includes(route.name)
    })
   const skeleton_loading = computed(() =>{
      if(skeleton.header && skeleton.list){
        return false
      } else{
        return true
      }
    })
    // 监听is_dialog_details(控制是否显示联赛列表)
   watch(() => is_dialog_details.value, (new_value, old_value) => {
      // 新的值等于true的时候也就是点击下三角准备查看联赛列表 此时调用接口:详情页下拉列表接口(/v1/m/matchDetail/getMatchDetailByTournamentIdPB)
      if (new_value) {
        let time_,mgt,date_,dateTime;  //菜单里取不到dateTime 就去详情数据对象里取
        try {
          mgt = Number(get_detail_data.mgt);
          date_ = new Date(mgt).toLocaleDateString()
          time_ = new Date(date_).getTime()
        } catch (error) {
          console.error(error)
        }
        // tid: 联赛id
        let tId = result_detail_data.value.tid;
        if (get_current_menu && get_current_menu.date_menu && get_current_menu.date_menu.field1) {
          dateTime = get_current_menu.date_menu.field1
        } else {
          dateTime = time_
        }
        let params = {
          tId,

          type: 1,
          dateTime
          };
        get_match_list(params);
      }
    })
    let mitt_list=[]
  onMounted(() => {
    // 默认加载赛事详情页面接口getMatchDetail
    get_match_detail_info()
    mitt_list=[
    // 监听调用赛事详情页面接口
    useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS, get_match_detail_info).off,
    useMittOn(MITT_TYPES.EMIT_ANA_SHOW,ana_show).off,

    useMittOn(MITT_TYPES.EMIT_RESULT_LIST_LOADING,()=>{
      skeleton.list = true
    }).off,

    useMittOn(MITT_TYPES.EMIT_CHANGE_TAB, ()=>{
      skeleton.changeTab = true
    }).off
    ]

  }) 
    // ...mapMutations([
    //   // 三角状态
    //   "set_sanjiao_is_bool",
    //   "set_toast",
    //   "set_goto_detail_matchid",
    //   "set_detail_data",
    //   "set_event_list",
    // ]),
    //  足篮显示分析页
   const ana_show = (val) => {
      if(val == 1) { // 足球
        analysis_show.value.football = true;
        return
      }else if(val == 2){ // 篮球
        analysis_show.value.basketball = true;
        return
      }else{
        Object.getOwnPropertyNames(analysis_show.value).forEach((key) => {
          analysis_show.value[key] = false
        });
      }
    }
    /**
     *@description: 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
     *@param {Undefined}
     *@return {Undefined} undefined
     */
   const get_match_detail_info = () => {
      // 从url取值赛事id：mid  || get_goto_detail_matchid
      let mid = route.params.mid ;
      // if(mid){
      //   set_goto_detail_matchid(mid);
      // }
      let params = {
        mid: mid,
        type: 1,
        cuid: UserCtr.uid, // userId或者uuid
        isESport: (get_menu_type == 28 && [3001,3002,3003,3004].includes(+get_curr_sub_menu_type)) ? 1 : null
      }
      api_common.get_matchResultDetail_MatchInfo( params ).then(({ data,code }) => {
        
        // 当状态码为0400500, data:null,data:{} 去到列表中的早盘
        if( code == '0400500' || !data || Object.keys(data).length===0 ){
          router.push({name: 'matchList'})
        }else if(code == 200){
          skeleton.header = true
          loading.value = true
          if(!data) return false
          result_detail_data.value = data;
          // 61-比赛延迟,80-比赛中断,90-比赛放弃
          if(!(['90','80','61'].includes(data.mmp+''))){
            data.mmp = '999'
          }
          if("" && data.mo == 1){
            // 61-比赛延迟,80-比赛中断,90-比赛放弃
            if(!(['90','80','61'].includes(data.mmp+''))){
              data.mmp = '999'
            }
          }
          // 克隆一份;
          let cloneData = lodash.cloneDeep(data);
          // set_detail_data(cloneData);
          cloneData['mhs'] = 0
          cloneData['os'] = 1
          MatchDataWarehouseInstance.set_match_details(cloneData)
        }
      }).catch((err) =>{
        loading.value = true
        skeleton.header = true
      });
    }
    /**
     *@description: 联赛下拉选择组件展开时的联赛列表获取
     *@param {Undefined}
     *@return {Undefined} undefined
     */
   const get_match_list = (params) => {
      let sessiong_store = sessionStorage.getItem('match_list_ofdetails');
      if(sessiong_store) {
        let store_data = JSON.parse(sessiong_store);
        if(store_data.tId == params.tId){
          math_list_data.value = store_data.list;
        }
      }
      if(get_menu_type == 28 && [100,101,102,103,104].includes(+get_detail_data.csid)){
        params.isESport = 1
      }else{
        params.isESport = null
      }
      /**
       *@description 详情页下拉列表接口(/v1/m/matchDetail/getMatchDetailByTournamentIdPB)
       *@param {obj}
       *@return {obj}
       */
      api_common.get_matchDetail_getMatchDetailByTournamentId(params).then(({ data }) => {
        if(!data || data.length == 0){

            set_toast({
              txt: i18n_t("bet_record.bet_match_tishi"),
              is_show: true
            });

          sessionStorage.setItem('match_list_ofdetails','');
          math_list_data.value = [];
          // // 设置详情下拉三角是否显示
          // set_sanjiao_is_bool(false);
        }else{
          let store_data = {
            tId:params.tId,
            list:data
          };
          // 将store_data对象转换为 JSON 字符串
          let sessiong_store = JSON.stringify(store_data);
          // 将sessiong_store的值存在sessionStorage里面
          sessionStorage.setItem('match_list_ofdetails',sessiong_store);
          math_list_data.value = data;
          // // 设置详情下拉三角是否显示
          // set_sanjiao_is_bool(true);
        }
      });
    }
    /**
     *@description: 监听is_bool_dialog_details事件，控制是否显示下拉联赛列表
     *@param {String} 判断是否下拉
     *@return {Undefined} undefined
     */
  const change_bool = (bool) => {
    // bool 的值为true或者是false
    is_dialog_details.value = bool;
  }
  // 监听是否下拉联赛列表
  const { off: change_bool_off } =  useMittOn(MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, change_bool);
  // 清除监听下拉联赛列表

  onUnmounted(() => {
    // 清除刷新详情页;
    mitt_list.forEach(i=>i())
    change_bool_off()
    // 组件销毁时设置vuex的值为空对象
    // set_detail_data({})
    // set_event_list([])
  }) 
</script>

<style lang="scss" scoped>
.match-header-result {
  height: calc(var(--vh, 1vh) * 100);
  overflow: auto;
}

.header-tab {
  min-width: 3.75rem;
  position: fixed;
  top: 0;
  z-index: 80;
}

.play-pad {
  padding-top: 1.61rem;
}

.baseball-play-pad {
  padding-top: 1.8rem;
}
:deep(.skeleton-wrap) {
  z-index: 10 !important;
}
</style>