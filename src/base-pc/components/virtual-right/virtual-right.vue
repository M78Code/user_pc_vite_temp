<!--
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 虚拟体育右侧
-->

<template>
  <load-data class="fit" id="virtual-right-wrap" :state="VrSportCtr.load_data_state">
    <v-scroll-area class="c-virtual-right" :class="{bg2:VrSportCtr.info.csid != 1001}" :observer_area="1" page_type="virtual_right_list" @on_scroll="cur_scroll_height">
      <!-- 头部 -->
      <template v-slot:header>
        <div class="header-title c-video-ctrl relative-position">
          <div class="text col ellipsis">
            <template v-if="VrSportCtr.info.csid == 1004">
              {{VrSportCtr.info.no}}
            </template>
            <template v-else>
              {{VrSportCtr.info.tn}}
              <!-- 足球  1011赛马期号-->
              <template v-if="[1001,1011].includes(VrSportCtr.info.csid*1)">
                &nbsp;{{VrSportCtr.info.no}}
              </template>
            </template>  
          </div>
          
          <div class="icon"></div>
         
        </div>
        <!-- 视频区域 -->
        <virtual-video :VrSportCtr="VrSportCtr" />
      </template>

      <!-- 赛狗、赛马 、摩托车、泥地摩托车-->
      <template v-if="[1002,1011,1010,1009].includes(VrSportCtr.info.csid*1)">
        <!-- 赛马进程 -->
        <template v-if="VrSportCtr.status != 2">
          <div class="horse-title">
            <div style="width:40px"></div>
            <div class="col">{{VrSportCtr.info.no}}</div>
            <!-- 冠军 -->
            <div class="horse-col">{{i18n_t('list.virtual_match_type_title.type1011.bet_col.0')}}</div>
            <!-- 前二 -->
            <div class="horse-col">{{i18n_t('list.virtual_match_type_title.type1011.bet_col.1')}}</div>
            <!-- 前三 -->
            <div class="horse-col" v-if="VrSportCtr.info.csid !='1009'">{{i18n_t('list.virtual_match_type_title.type1011.bet_col.2')}}</div>
          </div>
          <horse-replay :VrSportCtr="VrSportCtr" :key="VrSportCtr.vue_key" />
        </template>
        <!-- 赛马赛果 -->
        <horse-result v-else :VrSportCtr="VrSportCtr" />
      </template>
      
      <!-- 足球 、篮球-->
      <template v-if="[1001,1004].includes(VrSportCtr.info.csid*1)">
        <footbal-replay 
          :VrSportCtr="VrSportCtr" 
          v-for="(match,match_index) in VrSportCtr.replay_list" :key="match_index" 
          :match="match" 
          :match_index="match_index"
        />
        <!-- 足球杯赛排行榜 -->
        <template v-if="VrSportCtr.info.csid == 1001 && VrSportCtr.info.isc == 1">
          <!-- 排行榜标题 -->
          <div class="rank-title">
            <!-- 小组赛 -->
            <div class="item" 
              :class="{active:VrSportCtr.cup_tab == 'group'}"
              @click="VrSportCtr.set_cup_tab('group')"
            >{{i18n_t('vsport.group')}}</div>
            <!-- 淘汰赛 -->
            <div class="item" 
              :class="{active:VrSportCtr.cup_tab == 'elimination',disable:VrSportCtr.info.mmp == 'GROUPS'}"
              @click="VrSportCtr.set_cup_tab('elimination')"
            >{{i18n_t('vsport.elimination')}}</div>
          </div>
          <!-- 小组赛积分榜 -->
          <group-rank v-if="VrSportCtr.cup_tab == 'group'" :VrSportCtr="VrSportCtr" />
          <!-- 淘汰赛积分榜 -->
          <elimination-rank v-else :VrSportCtr="VrSportCtr" />
        </template>
        <!-- 足球联赛排行榜 -->
        <league-rank v-if="VrSportCtr.info.csid == 1001 && VrSportCtr.info.isc != 1"
        :VrSportCtr="VrSportCtr"
        :titleFixed="isFixed" />
      </template>
    
    </v-scroll-area>
  </load-data>
</template>

<script>
import loadData from "src/components/load_data/load_data.vue"
import eliminationRank from "src/base-pc/components/virtual-right/elimination-rank.vue"
import groupRank from "src/base-pc/components/virtual-right/group-rank.vue"
import leagueRank from "src/base-pc/components/virtual-right/league-rank.vue"
import virtualVideo from "src/base-pc/components/virtual-right/virtual-video.vue"
import horseResult from "src/base-pc/components/virtual-right/horse-result.vue"
import horseReplay from "src/base-pc/components/virtual-right/horse-replay.vue"
import footbalReplay from "src/base-pc/components/virtual-right/footbal-replay.vue"
import vScrollArea from "src/base-pc/components/v-scroll-area/v-scroll-area.vue";
import {VrSportCtr} from "src/output/index.js"
export default {
  name: "virtualRight",
  components:{
    loadData,
    eliminationRank,
    groupRank,
    leagueRank,
    horseResult,
    horseReplay,
    footbalReplay,
    virtualVideo,
    vScrollArea
  },
  data(){
    return {
      // 虚拟体育操作类
      VrSportCtr: new VrSportCtr(this),
      // 是否显示视频提示内容 
      is_show_content:false,
      // 赛事对阵列表高度
      listsHeight: 0,
      // title 排行榜是否吸顶
      isFixed: false,
      // 获取右侧参数
      get_vsport_params: "get_vsport_params",
      // 获取服务器时间
      get_timestamp: "get_timestamp",
      // 获取页面尺寸
      get_layout_list_size: "get_layout_list_size"
    }
  },
  computed:{
    // ...mapGetters({
    //   // 获取右侧参数
    //   get_vsport_params: "get_vsport_params",
    //   // 获取服务器时间
    //   get_timestamp: "get_timestamp",
    //   // 获取页面尺寸
    //   get_layout_list_size: "get_layout_list_size"
    // })
  },
  watch:{
    // 监听切换批次
    'get_vsport_params.id':{
      handler(res){
        if(res){
          this.VrSportCtr.init()
        }
      },
      immediate: true,
    },
    // 监听切换单场赛事
    'get_vsport_params.mid'(mid){
      this.VrSportCtr.mid_change(mid)
    },
    // 监听页面宽度大小变化
    'get_layout_list_size.width':{
      handler(){
        this.$nextTick(() => {
          this.VrSportCtr.set_result_style()
        })
      }
    },
    // 赛事对阵列表有数据之后计算该列表高度
    'VrSportCtr.replay_list.length': {
      handler(n) {
        this.listsHeight = n * 33;
      }
    }
  },
  created() {
    this.$load_player_js()
    this.$root.$on(this.emit_cmd.EMIT_UPD_TIME_REFRESH_CMD, this.timer);
  },
  destroyed() {
    this.$root.$off(this.emit_cmd.EMIT_UPD_TIME_REFRESH_CMD, this.timer);
  },
  mounted(){
    this.VrSportCtr.set_result_style()
  },
  methods:{
    /**
     * @Description 计时器 
     * @param {undefined} undefined
    */
    timer(){
      this.VrSportCtr.timer()
    },
    /**
     * 监听右侧内容滚动高度
     */
    cur_scroll_height(height) {
      // 判断排行榜 title 是否吸顶
      this.isFixed = height.position >= this.listsHeight
    }
  }
};
</script>

<style lang="scss" scoped>
.c-virtual-right {
  /*  头部 */
  .header-title {
    height: 36px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding: 0 15px;
    border-radius: 6px 6px 0 0;
    .icon {
      width: 13px;
    }
    .icon-tips3 {
      cursor: pointer;
    }
    .text {
      text-align: center;
    }
  }

  /*  赛马标题 */
  .horse-title {
    height: 28px;
    display: flex;
    align-items: center;
    padding-right: 5px;
    font-size: 13px;
    position: relative;
    &::after {
      display: block;
      content: "";
      width: 3px;
      height: 14px;
      border-radius: 1.5px;
      position: absolute;
      top: 7px;
      left: 22px;
    }
    .horse-col {
      font-size: 12px;
      width: 18%;
      max-width: 96px;
      text-align: center;
    }
  }

  /*  排行榜标题 */
  .rank-title {
    height: 40px;
    display: flex;
    align-items: center;
    .item {
      flex: 1;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      &.disable {
        cursor: not-allowed;
      }
    }
  }
}
.v-scroll-area:after {
  border-left: none;
}
</style>