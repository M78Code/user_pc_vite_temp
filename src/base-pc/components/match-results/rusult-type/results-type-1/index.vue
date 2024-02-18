<!--
 * @
 * @Author: Yellow
 * @Date: 2020-08-04 17:14:23
 * @Description: 赛果各球种展示模板
-->
<template>
  <div class="wrap-index">
    <!-- 冠军球种模板 -->
    <champion
      v-if="['0'].includes(sportType)"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
    />
    <!-- 足球 -->
    <soccer
      v-if="['1'].includes(sportType)"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :results_playback_list="results_playback_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_playback_type="change_playback_type"
      @change_sort="change_sort"
      :versions="versions"
      ref="soccer_ref"
    />
    <!-- 篮球 -->
    <basketball
      v-if="sportType == '2'"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
    />
    <!-- 电子足球 -->
    <soccer
      v-if="['90'].includes(sportType)"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :results_playback_list="results_playback_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_playback_type="change_playback_type"
      @change_sort="change_sort"
      :versions="versions"
      ref="soccer_ref"
    />
    <!-- 电子篮球 -->
    <basketball
      v-if="sportType == '91'"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
    />
    <!-- 棒球 -->
    <baseball
      v-if="sportType == '3'"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
    />
    <!-- 冰球 -->
    <hockey
      v-if="sportType == '4'"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
    />
    <!-- 网球 -->
    <tennis
      v-if="sportType == '5'"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
    />
    <!-- 6 美足、14 联合式橄榄球、15 曲棍球、16 水球、 -->
    <usa-football
      v-if="['6', '14', '15', '16'].includes(sportType)"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
      :sportType="sportType"
    />
    <!-- 7 斯诺克、12 拳击 -->
    <snooker
      v-if="['7', '12'].includes(sportType)"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
      :sportType="sportType"
    />
    <!-- 乒乓球 -->
    <pingpang
      v-if="sportType == '8'"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
    />
    <!-- 9 排球、13 沙滩排球 -->
    <volleyball
      v-if="['9','13'].includes(sportType)"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
    />
    <!-- 羽毛球 -->
    <badminton
      v-if="['10'].includes(sportType)"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
    />
    <!-- 手球 -->
    <handball
      v-if="sportType == '11'"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
    />
    <!-- 1001 虚拟足球、1004 虚拟篮球 -->
    <virtual-soccer
      v-if="[1001,1004].includes(sportType*1)"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @change_sort="change_sort"
      :versions="versions"
      :sportType="sportType"
    />
    <!-- 1002 虚拟赛狗、1011 虚拟赛马、1010 虚拟摩托车 1009、虚拟泥地摩托车-->
    <virtual-race-dog
      v-if="[1002,1010,1009,1011].includes(+sportType)"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @change_sort="change_sort"
      :versions="versions"
      :sportType="sportType"
    />
    <!-- 电竞赛种 -->
    <dota2
      v-if="getCsid(sportType)"
      :load_data_state="load_data_state"
      :details_load="details_load"
      :results_list="results_list"
      :results_order_list="results_order_list"
      :is_sortUp="is_sortUp"
      :activeIndex="activeIndex"
      @get_tr_detail="get_tr_detail"
      @change_sort="change_sort"
      :versions="versions"
     />
  </div>
</template>

<script>
import { is_eports_csid } from 'src/output/index.js'
import soccer from  "src/base-pc/components/match-results/template/soccer.vue";
import basketball from "src/base-pc/components/match-results/template/basketball.vue";
import tennis from "src/base-pc/components/match-results/template/tennis.vue";
import badminton from "src/base-pc/components/match-results/template/badminton.vue";
import snooker from "src/base-pc/components/match-results/template/snooker.vue";
import pingpang from "src/base-pc/components/match-results/template/pingpang.vue";
import baseball from "src/base-pc/components/match-results/template/baseball.vue";
import hockey from "src/base-pc/components/match-results/template/hockey.vue";
import usaFootball from "src/base-pc/components/match-results/template/usa_football.vue";
import volleyball from "src/base-pc/components/match-results/template/volleyball.vue";
import handball from "src/base-pc/components/match-results/template/handball.vue";
import champion from "src/base-pc/components/match-results/template/champion.vue"
import virtual_soccer from "src/base-pc/components/match-results/template/virtual_soccer.vue";
import virtual_race_dog from "src/base-pc/components/match-results/template/virtual_race_dog.vue";
import virtualBasketball from "src/base-pc/components/match-results/template/virtual_soccer.vue";

import dota2 from "src/base-pc/components/match-results/template/dota2.vue";
export default {
  components: {
    soccer,
    basketball,
    tennis,
    badminton,
    snooker,
    pingpang,
    baseball,
    usaFootball,
    hockey,
    volleyball,
    "virtual-soccer": virtual_soccer,
    "virtual-race-dog": virtual_race_dog,
    virtualBasketball,
    handball,
    champion,
    dota2,
  },
  props:{
    sportType: {//球类id
      type: String,
      default: "1",
    },
    results_list: {//表格数据
      type: [Array, Object],
      default: () => {
        return [];
      },
    },
    results_order_list: {//点击行详情
      type: [Array, Object],
      default: () => {
        return [];
      },
    },
    results_playback_list: {//点击行详情
      type: [Array, Object],
      default: () => {
        return [];
      },
    },
    load_data_state: String, //loading状态
    details_load: String, //loading状态
    is_sortUp: Boolean, //是否升序
    activeIndex: Number, //查看表格内详情的index
    versions: String,//版本
  },
  methods: {
    getCsid (val){
      return is_eports_csid(val)
    },
    /**
     * @description: 获取父组件点击行详情
     * @param {Array} data
     * @return {undefined} undefined
     */
    get_tr_detail(data,index) {
      this.$emit("get_tr_detail", [data,index]);
    },
    /**
     * @description: 父组件升降排序
     * @return {undefined} undefined
     */
    change_sort() {
      this.$emit("change_sort");
    },
    /**
     * @description: 切换精彩回顾列表类型
     * @param {Array} data
     * @return {undefined} undefined
     */
     change_playback_type(data) {
      this.$emit("change_playback_type", data);
    },
    // 切换精彩赛事类型
    change_current_events_type() {
      if(this.$refs.soccer_ref){
        this.$refs.soccer_ref.change_current_events_type()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap-index {
  flex: 1;
  /*  滚动条样式 */
  :deep(.q-scrollarea__thumb) {
    background-color: rgba(60, 63, 76, 0.3);
    z-index: 2;
  }

  /* ************** 球类模板穿透 *************** -S */
 
    :deep(.table-header) {
      // border-bottom: 1px solid #d0d8de;
      .table-col:first-child {
        padding-left: 20px;
      }
      .table-col_date:first-child {
        padding-left: 20px;
      }
      .table-col {
        .icon {
          background-size: 100%;
        }
      }
      .table-col_date {
        .icon {
          background-size: 100%;
        }
      }
    }
    :deep( .tbale-body) {
      color: #17191d;
      .active {
        background: var(--q-gb-bd-c-7);
        position: sticky;
        position: -webkit-sticky;
        top: 0;
        z-index: 1;
      }

      /* ************** 表格tr *************** -S */
      .table-tr-td {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #d0d8de;
        border-left: 1px solid #d0d8de;
        cursor: pointer;
        &:hover {
          background: #f5f7fa;
        }
        .table-col,.table-col_date {
          position: relative;
          height: 58px;
          // border-right: 1px solid #d0d8de;
          
          & > div {
            height: 29px;
            line-height: 29px;
          }
          &:first-child {
            padding-left: 8px;
            user-select: text;
            position: static;
            .time-icon {
              margin-right: 5px;
            }
            .time-wrap {
              height: auto !important;
              line-height: 12px !important;
              .match-stage {
                margin-top: 5px;
                color: #40ab70;
                &.cancel {
                  color: #e93d3d;
                }
                &.roll {
                  color: #40ab70;
                }
              }
            }
          }
          &:nth-child(2) {
            display: flex;
            align-items: center;
            //padding: 0 0;
            user-select: text;
          }
          &:nth-child(3) {
            user-select: text;
          }
          .tournament-logo {
            min-width: 18px;
            height: 18px;
            margin-right: 5px;
          }
          .ellipsis-line-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      }
      /* ************** 表格tr *************** -E */
      /* ************** 详情 *************** -S */
      .table-tr-detail {
        display: flex;
        min-height: 40px;
        border-left: 1px solid #d0d8de;
        background: #f5f7fa;
        .tr-detail-title {
          display: flex;
          align-items: center;
          padding: 0 20px;
          border-right: 1px solid #d0d8de;
          border-bottom: 1px solid #d0d8de;
          color: #6d7278;
        }
        .tr-detail-item {
          display: flex;
          flex: 1;
          flex-wrap: wrap;
          .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            height: 40px;
            border-right: 1px solid #d0d8de;
            border-bottom: 1px solid #d0d8de;
            .lose-color {
              color: #99a3b1;
            }
            .win-color {
              color: #e93d3d;
            }
            &:nth-child(even) {
              flex: 1;
            }
          }
        }
      }

      /* ************** 详情 *************** -E */
      /* ************** loading *************** -S */
      .wrap-load {
        border-bottom: 1px solid #d0d8de;
        background: #f5f7fa;
        .loading-wrap,
        .empty-wrap {
          margin: 10px 0 !important;
        }

        /*暂无数据*/
        .empty-wrap {
          .img {
            width: 50px !important;
            margin: 0 auto 10px;
            background-repeat: no-repeat;
            background-position: center;
            padding-bottom: 0;
            height: 50px !important;
            // background-image: url($SCSSPROJECTPATH+"/image/png/no_data_01.png");
            background-image: url($SCSSPROJECTPATH+"/image/svg/no-data.svg");
          }
          .text-center {
            color: #999;
            font-size: 12px;
          }
        }
      }

      /* ************** loading *************** -E */
    }
  

  /* ************** 球类模板穿透 *************** -E */
}
</style>