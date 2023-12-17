<!--
 * @Author: Cable
 * @Date: 2020-12-29 17:13:55
 * @Description: 虚拟体育右侧
-->

<template>
  <load-data class="fit" id="virtual-right-wrap" :state="vsport_ctr.load_data_state">
    <v-scroll-area class="c-virtual-right" :class="{bg2:vsport_ctr.info.csid != 1001}" :observer_area="1" page_type="virtual_right_list" @on_scroll="cur_scroll_height">
      <!-- 头部 -->
      <template v-slot:header>
        <div class="header-title c-video-ctrl relative-position">
          <div class="text col ellipsis">
            <template v-if="vsport_ctr.info.csid == 1004">
              {{vsport_ctr.info.no}}
            </template>
            <template v-else>
              {{vsport_ctr.info.tn}}
              <!-- 足球  1011赛马期号-->
              <template v-if="[1001,1011].includes(vsport_ctr.info.csid*1)">
                &nbsp;{{vsport_ctr.info.no}}
              </template>
            </template>
          </div>

          <div class="icon"></div>

        </div>
        <!-- 视频区域 -->
        <virtual-video :vsport_ctr="vsport_ctr" />
      </template>

      <!-- 赛狗、赛马 、摩托车、泥地摩托车-->
      <template v-if="[1002,1011,1010,1009].includes(vsport_ctr.info.csid*1)">
        <!-- 赛马进程 -->
        <template v-if="vsport_ctr.status != 2">
          <div class="horse-title">
            <div style="width:40px"></div>
            <div class="col">{{vsport_ctr.info.no}}</div>
            <!-- 冠军 -->
            <div class="horse-col">{{ i18n_t('list.virtual_match_type_title.type1011.bet_col.0')}}</div>
            <!-- 前二 -->
            <div class="horse-col">{{ i18n_t('list.virtual_match_type_title.type1011.bet_col.1')}}</div>
            <!-- 前三 -->
            <div class="horse-col" v-if="vsport_ctr.info.csid !='1009'">{{ i18n_t('list.virtual_match_type_title.type1011.bet_col.2')}}</div>
          </div>
          <horse-replay :vsport_ctr="vsport_ctr" :key="vsport_ctr.vue_key" />
        </template>
        <!-- 赛马赛果 -->
        <horse-result v-else :vsport_ctr="vsport_ctr" />
      </template>

      <!-- 足球 、篮球-->
      <template v-if="[1001,1004].includes(vsport_ctr.info.csid*1)">
        <footbal-replay
          :vsport_ctr="vsport_ctr"
          v-for="(match,match_index) in vsport_ctr.replay_list" :key="match_index"
          :match="match"
          :match_index="match_index"
        />
        <!-- 足球杯赛排行榜 -->
        <template v-if="vsport_ctr.info.csid == 1001 && vsport_ctr.info.isc == 1">
          <!-- 排行榜标题 -->
          <div class="rank-title">
            <!-- 小组赛 -->
            <div class="item"
              :class="{active:vsport_ctr.cup_tab == 'group'}"
              @click="vsport_ctr.set_cup_tab('group')"
            >{{ i18n_t('vsport.group')}}</div>
            <!-- 淘汰赛 -->
            <div class="item"
              :class="{active:vsport_ctr.cup_tab == 'elimination',disable:vsport_ctr.info.mmp == 'GROUPS'}"
              @click="vsport_ctr.set_cup_tab('elimination')"
            >{{ i18n_t('vsport.elimination')}}</div>
          </div>
          <!-- 小组赛积分榜 -->
          <group-rank v-if="vsport_ctr.cup_tab == 'group'" :vsport_ctr="vsport_ctr" />
          <!-- 淘汰赛积分榜 -->
          <elimination-rank v-else :vsport_ctr="vsport_ctr" />
        </template>
        <!-- 足球联赛排行榜 -->
        <league-rank v-if="vsport_ctr.info.csid == 1001 && vsport_ctr.info.isc != 1"
        :vsport_ctr="vsport_ctr"
        :titleFixed="isFixed" />
      </template>

    </v-scroll-area>
  </load-data>
</template>
<script>
// import loadData from "/components/load_data/load_data.vue"
import eliminationRank from "src/project/yabo/components/virtual_right/elimination_rank.vue"
import groupRank from "src/project/yabo/components/virtual_right/group_rank.vue"
import leagueRank from "src/project/yabo/components/virtual_right/league_rank.vue"
import virtualVideo from "src/project/yabo/components/virtual_right/virtual_video.vue"
import horseResult from "src/project/yabo/components/virtual_right/horse_result.vue"
import horseReplay from "src/project/yabo/components/virtual_right/horse_replay.vue"
import footbalReplay from "src/project/yabo/components/virtual_right/footbal_replay.vue"
// import vScrollArea from "/components/v_scroll_area/v_scroll_area.vue";
// import vsport_ctr from "/utils/vsport/vsport_ctr.js"
// #TODO vuex
// import { mapGetters } from "vuex"
import { reactive, computed, onMounted, onUnmounted, toRefs, watch,nextTick } from "vue";
export default defineComponent({
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
  setup(props, evnet) {
    const component_data = reactive({
      // 虚拟体育操作类
      vsport_ctr: new vsport_ctr(),
      // 是否显示视频提示内容
      is_show_content:false,
      // 赛事对阵列表高度
      listsHeight: 0,
      // title 排行榜是否吸顶
      isFixed: false,
    });
    // #TODO vuex
    // computed:{
    //   ...mapGetters({
    //     // 获取右侧参数
    //     get_vsport_params: "get_vsport_params",
    //     // 获取服务器时间
    //     get_timestamp: "get_timestamp",
    //     // 获取页面尺寸
    //     get_layout_list_size: "get_layout_list_size"
    //   })
    // },
    const get_vsport_params = computed(() => {
      return ""
    })
    const get_timestamp = computed(() => {
      return ""
    })
    const get_layout_list_size = computed(() => {
      return ""
    })
    // 监听切换批次
    watch(
      () => get_vsport_params.value.id,
      () => {
        if(res){
          vsport_ctr.init()
        }
      }
    );
    watch(
      () => get_layout_list_size.width,
      () => {
        nextTick(() => {
          vsport_ctr.set_result_style()
        })
      }
    );
    watch(
      () => vsport_ctr.replay_list.length,
      () => {
        listsHeight = n * 33;
      }
    );
    onMounted(() => {
      $load_player_js()
      // useMittOn(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD, timer);

      // 原mounted
      vsport_ctr.set_result_style()

    })
    onUnmounted(() => {
      // useMittOn(MITT_TYPES.EMIT_UPD_TIME_REFRESH_CMD, timer);
    });
    /**
     * @Description 计时器
     * @param {undefined} undefined
    */
    const timer = () => {
      vsport_ctr.timer()
    };
    /**
     * 监听右侧内容滚动高度
     */
    const cur_scroll_height = (height) => {
      // 判断排行榜 title 是否吸顶
      isFixed = height.position >= listsHeight
    }
    return {
      ...toRefs(component_data),
      get_vsport_params,
      get_timestamp,
      get_layout_list_size,
      timer,
      cur_scroll_height
    }
  }
})
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
