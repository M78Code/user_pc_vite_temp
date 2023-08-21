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
      <result-details-tab :tab_index="$route.params.index" :result_detail_data="result_detail_data" />
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
    <SResult v-if="skeleton_loading" :loading_body="skeleton.changeTab"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { api_common } from "src/project/api/index.js";
import resultHeader from "project_path/src/pages/details/components/result_header.vue";
import resultDetailsTab from "project_path/src/pages/details/components/result_details_tab.vue";
import resultDetailsDialog from "src/project/components/details/result_details_dialog.vue";
import noData from "src/project/components/common/no_data.vue";
import analysis_football_matches from "project_path/src/pages/details/analysis-matches/football_match_analysis/analysis_football_matches";
import basketball_match_analysis from "project_path/src/pages/details/analysis-matches/basketball_match_analysis/basketball_match_analysis";
import SResult from "src/project/components/skeleton/match-result" // 赛果详情骨架屏

export default {
  name:"result_details",
  data() {
    return {
      // 详情接口所有数据
      result_detail_data: {},
      // 是否显示下拉联赛列表
      is_dialog_details: false,
      // 赛事列表数据
      math_list_data: [],
      loading: false,
      // 是否显示分析页面
      analysis_show: {
        football: false,
        basketball: false,
      },
      //骨架屏加载状态
      skeleton:{
        header: false,//头部数据
        list: false,//列表数据
        changeTab: false,//切换tab
      }
    };
  },
  computed: {
    ...mapGetters([
      // 获取列表页当前选中二级菜单时间
      "get_current_menu",
      "get_menu_type",
      "get_uid",
      "get_detail_data",
      "get_goto_detail_matchid",
      "get_curr_sub_menu_type"
    ]),
    is_match_result(){
      return ['result_details', 'match_result'].includes(this.$route.name)
    },
    skeleton_loading(){
      if(this.skeleton.header && this.skeleton.list){
        return false
      } else{
        return true
      }
    }
  },
  components: {
    resultHeader,
    resultDetailsDialog,
    resultDetailsTab,
    noData,
    "analysis-football-matches": analysis_football_matches,
    "basketball-match-analysis": basketball_match_analysis,

    SResult
  },
  watch: {
    // 监听is_dialog_details(控制是否显示联赛列表)
    is_dialog_details(new_value, old_value) {
      // 新的值等于true的时候也就是点击下三角准备查看联赛列表 此时调用接口:详情页下拉列表接口(/v1/m/matchDetail/getMatchDetailByTournamentIdPB)
      if (new_value) {
        let time_,mgt,date_,dateTime;  //菜单里取不到dateTime 就去详情数据对象里取
        try {
          mgt = Number(this.get_detail_data.mgt);
          date_ = new Date(mgt).toLocaleDateString()
          time_ = new Date(date_).getTime()
        } catch (error) {
          console.error(error)
        }
        // tid: 联赛id
        let tId = this.result_detail_data.tid;
        if (this.get_current_menu && this.get_current_menu.date_menu && this.get_current_menu.date_menu.field1) {
          dateTime = this.get_current_menu.date_menu.field1
        } else {
          dateTime = time_
        }
        let params = {
          tId,

          type: 1,
          dateTime
          };
        this.get_match_list(params);
      }
    },
  },
  created() {
    // 默认加载赛事详情页面接口getMatchDetail
    this.get_match_detail_info()
    // 监听是否下拉联赛列表
    useMittOn(MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, this.changge_bool);
    // 监听调用赛事详情页面接口
    useMittOn(MITT_TYPES.EMIT_REFRESH_DETAILS, this.get_match_detail_info);
    useMittOn(MITT_TYPES.EMIT_ANA_SHOW,this.ana_show);

    useMittOn(MITT_TYPES.EMIT_RESULT_LIST_LOADING,()=>{
      this.skeleton.list = true
    });

    useMittOn(MITT_TYPES.EMIT_CHANGE_TAB, ()=>{
      this.skeleton.changeTab = true
    });

  },
  methods: {
    ...mapMutations([
      // 三角状态
      "set_sanjiao_is_bool",
      "set_toast",
      "set_goto_detail_matchid",
      "set_detail_data",
      "set_event_list",
    ]),
    //  足篮显示分析页
    ana_show(val){
      if(val == 1) { // 足球
        this.analysis_show.football = true;
        return
      }else if(val == 2){ // 篮球
        this.analysis_show.basketball = true;
        return
      }else{
        Object.getOwnPropertyNames(this.analysis_show).forEach((key) => {
          this.analysis_show[key] = false
        });
      }
    },
    /**
     *@description: 赛事详情页面接口(/v1/m/matchDetail/getMatchDetailPB)
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    get_match_detail_info() {
      // 从url取值赛事id：mid
      let mid = this.$route.params.mid || this.get_goto_detail_matchid;
      if(mid){
        this.set_goto_detail_matchid(mid);
      }
      let params = {
        mid: mid,
        type: 1,
        cuid: this.get_uid, // userId或者uuid
        isESport: (this.get_menu_type == 28 && [3001,3002,3003,3004].includes(+this.get_curr_sub_menu_type)) ? 1 : null
      }
      api_common.get_matchResultDetail_MatchInfo( params ).then(({ data,code }) => {
        // 当状态码为0400500, data:null,data:{} 去到列表中的早盘
        if( code == '0400500' || !data || Object.keys(data).length===0 ){
          this.$router.push({name: 'matchList'})
        }else if(code === 200){
          this.skeleton.header = true
          this.loading = true
          if(!data) return false
          this.result_detail_data = data;
          // 61-比赛延迟,80-比赛中断,90-比赛放弃
          if(!(['90','80','61'].includes(data.mmp+''))){
            data.mmp = '999'
          }
          if(['result_details', 'match_result'].includes(this.$route.name) && data.mo == 1){
            // 61-比赛延迟,80-比赛中断,90-比赛放弃
            if(!(['90','80','61'].includes(data.mmp+''))){
              data.mmp = '999'
            }
          }
          // 克隆一份;
          let cloneData = _.cloneDeep(data);
          this.set_detail_data(cloneData);
        }
      }).catch((err) =>{
        this.loading = true
        this.skeleton.header = true
      });
    },
    /**
     *@description: 联赛下拉选择组件展开时的联赛列表获取
     *@param {Undefined}
     *@return {Undefined} undefined
     */
    get_match_list(params) {
      let sessiong_store = sessionStorage.getItem('match_list_ofdetails');
      if(sessiong_store) {
        let store_data = JSON.parse(sessiong_store);
        if(store_data.tId == params.tId){
          this.math_list_data = store_data.list;
        }
      }
      if(this.get_menu_type == 28 && [100,101,102,103,104].includes(+this.get_detail_data.csid)){
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

            this.set_toast({
              txt: i18n.t("bet_record.bet_match_tishi"),
              is_show: true
            });

          sessionStorage.setItem('match_list_ofdetails','');
          this.math_list_data = [];
          this.set_sanjiao_is_bool(false);
        }else{
          let store_data = {
            tId:params.tId,
            list:data
          };
          // 将store_data对象转换为 JSON 字符串
          let sessiong_store = JSON.stringify(store_data);
          // 将sessiong_store的值存在sessionStorage里面
          sessionStorage.setItem('match_list_ofdetails',sessiong_store);
          this.math_list_data = data;
          this.set_sanjiao_is_bool(true);
        }
      });
    },
    /**
     *@description: 监听is_bool_dialog_details事件，控制是否显示下拉联赛列表
     *@param {String} 判断是否下拉
     *@return {Undefined} undefined
     */
    changge_bool(bool) {
      // bool 的值为true或者是false
      this.is_dialog_details = bool;
    },
  },
  beforeUnmount() {
    // 清除监听下拉联赛列表
    this.$root.$off(MITT_TYPES.EMIT_IS_BOOL_DIALOG_DETAILS, this.changge_bool);
    // 清除刷新详情页;
    this.$root.$off(MITT_TYPES.EMIT_REFRESH_DETAILS, this.get_match_detail_info);
    // 组件销毁时设置vuex的值为空对象
    // this.set_detail_data({})
    this.$root.$off(MITT_TYPES.EMIT_ANA_SHOW,this.ana_show)
    this.$root.$off(MITT_TYPES.EMIT_RESULT_LIST_LOADING)
    this.$root.$off(MITT_TYPES.EMIT_CHANGE_TAB)
    this.set_event_list([])
  },
}
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
</style>
