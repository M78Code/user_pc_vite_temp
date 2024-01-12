
  
<template>

<div>
  <!-- <div class="top-menu-content"> -->
        <!-- 体育 -->
        <!-- <span class="label">{{ i18n_t("results.sport") }}</span> -->
        <!-- <Select-Wrapper
          :sportType="sport"
          :options="sport_type"
          :isChampion="0"
          use_component_key="Select_n"
        ></Select-Wrapper>
      </div>
      <q-separator class="divider" color="#F2F5F8" inset /> -->
    <div class="c-simple-header">
      <div class="logo-icon"  :style="compute_css_obj({ key: 'pc-rule-logo' })"></div>
      
    </div>
    <div>
      <div>赛果11</div>
      <q-separator class="divider" color="#F2F5F8" inset />
    </div>
    
    <div class="search-header">
    <div class="wrap-select">
      <div class="r-select ball-games">
        <!-- 体育 -->
        <span class="label  ball-games-label">{{$root.$t('results.sport')}}</span>
        <normal-select
          :value="sport"
          :options="sport_type"
          :isChampion="0"
          class="select-style"
        ></normal-select>
      </div>
      <!-- 冠军球种才展示这个下拉选择框 -->
      <div class="r-select ball-games" v-if="current_sport_id == 0">
        <!-- 球种 -->
        <span class="label ball-games-label">{{
          i18n_t("results.ball_games")
        }}</span>
        <Select-Wrapper
          :value="champion_sport"
          :sportType="champion_sport"
          :options="champion_sport_type"
          :isChampion="1"
          :showInput="true"
          use_component_key="Select_n"
        ></Select-Wrapper>
      </div>
      <!-- 日期 -->
      <div class="r-select">
        <div class="label time-search-label">
          {{ i18n_t("results.date") }}
        </div>
        <div class="search-date-wrapper">
          <div class="date-wrap" @click.stop="startTimeShowFunc">
            <div>{{ showSelectTime }}</div>
            <q-icon name="icon-calendar"></q-icon>
          </div>
          <div class="date-picker-wrap relative-position">
          <div v-show="false">{{ LayOutMain_pc.layout_version }}</div>
            <q-date
              color="orange"
              v-icon="{
                'chevron_left': 'icon-arrow-left',
                'chevron_right': 'icon-arrow-right',
              }"
              class="q_data date_class"
              v-model="date"
              @click.stop
              @range-end="confirmDate"
              range
              v-if="startTimeShow"
              
              minimal
              :locale="locales"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="wrap-handel">
      <div class="condition">
        <div class="r-select ml-30" style="margin-right: 5px">
          <!-- 联赛 -->
          <span class="label">{{ i18n_t("results.league") }}</span>
          <select-y
            @to_hide_select="hideSelect"
            :list="api_league_type"
            :sport_id="sport_id"
            popWidth="170"
            @select_submit="select_submit"
            @ipt_search="ipt_search"
            @search_hot="search_hot"
            @confirm="isSelectConfirm"
            :cancel="cancel"
            :isTimeChanged="timeChanged"
          ></select-y>
        </div>
        <div
          class="search relative-position"
          v-if="!pournament_params.champion && (Number(sport_id) < 17 || [90, 91].includes(+sport_id))"
        >
          <!-- 赛事 -->
          <span class="label">{{ i18n_t("results.match") }}</span>
          <!-- 请输入 -->
          <input
            class="ipt"
            :placeholder="i18n_t('results.placeholder')"
            @focus="cancel = new Date().getTime()"
            v-model="results_params.matchNameStr"
            maxlength="150"
          />
        </div>
        <div class="date-time-choice" v-if="(Number(sport_id) < 17 || [90, 91].includes(+sport_id))">
          <!-- 仅虚拟赛事不能查询滚球 -->
          <div
            v-if="!results_params.isVirtualSport"
            class="checkbox"
            @click="input_radio"
          >
            <fliter-checkbox :checked="is_bowls" />
            <!-- 滚球 -->
            <span>{{ i18n_t("results.roll_ball") }}</span>
          </div>
          <div
            class="checkbox"
            v-if="results_params.sportType == '1' && show_play_back"
            @click="highlights_input_radio"
          >
            <fliter-checkbox :checked="is_highlights" /> 
            <!-- 精彩回放筛选 -->
            <span>{{ i18n_t("video.video_event_history") }}</span>
          </div> 
        </div>
      </div>
      
      <div class="flex items-center">
        <div>
        <!-- 提示语 -->
          <q-tooltip v-model="showBtn" anchor="top middle" self="bottom middle">
            <div>{{ i18n_t("results.tips") }}</div>
          </q-tooltip>
          <div
            class="match-resultstips-icon relative-position"
            @click="click_popup"
            @mouseleave="img_mouseleave"
          >
            <span class="cursor-pointer"></span>
          </div>
        </div>
        <!-- 搜索 -->
        <div class="search-btn" @click="refresh()">
            {{ i18n_t("results.search") }}
        </div>
      </div>
      
    </div>
  </div>
</div>


</template>
<script setup>
import {  ref,computed,onMounted, reactive,watch } from 'vue';
import {SelectWrapper} from "src/base-pc/components/match-results/select/index.js";
import {FliterCheckbox} from "src/components/fliter-checkbox/index.js";
import normalSelect from "src/base-pc/components/match-results/select/components/normal-select.vue";
import selectY from "src/base-pc/components/match-results/select/components/select-y.vue"
import { api_analysis } from "src/api/";
import UserCtr from "src/core/user-config/user-ctr.js";
import {LayOutMain_pc} from "src/output/project/common/pc-common.js";
import { GlobalSwitchClass} from "src/output/index.js";

import { loadLanguageAsync } from "src/output/index.js";
import { LocalStorage } from "src/core/utils/common/module/web-storage.js";
import {
  i18n_t,
  useMittEmit,
  useMittEmitterGenerator,
  MITT_TYPES,
} from "src/output/index.js";
import lodash from "lodash"
import { useGetResultConfig } from "src/base-pc/components/match-results/results-config.js";

import { compute_css_obj } from 'src/core/server-img/index.js'
const {
  //变量
  changePage
} = useGetResultConfig();
const emit = defineEmits(['refresh'])
const props = defineProps({
  current_sport_id:{
    type: null
  },
  timeChanged:{
    type: Boolean
  },
  cancel:{
    type:null
  },
  dateValue:{
    type:Object
  },
  is_show:{
    type:Boolean
  },
  results_params:{
    type:Object
  },
  sport_type: {
    type: Array,
    default: () => [],
  },
  champion_sport_type: {
    type: Array,
    default: () => [],
  },
  champion_sport: {
    type: null,
  },
  sport:{
    type:String
  },
  is_bowls:{
    type:Boolean,
    default:false
  },
  startTimeShowFunc:{
    type: Function,
  },
  select_submit:{
    type: Function,
  },
  ipt_search:{
    type: Function,
  },
  input_radio:{
    type: Function,
  },
  hideSelect:{
    type: Function,
  },
  isSelectConfirm:{
    type: Function,
  },
  click_popup:{
    type: Function,
  },
  img_mouseleave:{
    type: Function,
  },
  search_hot:{
    type: Function,
  },
  startTimeShow:{
    type: Boolean,
    default:false
  }, //日历开始时间
  showSelectTime:{
    default:null // 日期选择框内计算后的日期
  },
  api_league_type:{
    type:Array
  },
  pournament_params:{
    type:Object
  },
  sport_id:{
    type:String
  },

});
// 全局点击事件
  watch(
    () => GlobalSwitchClass.global_switch_version,
    (new_) => {
    //  props.hideSelect()
    },
    {deep:true, immediate: true }
  );
  const show_play_back=   computed(()=>{
  return !!(lodash.get(UserCtr,"user_info.merchantEventSwitchVO") && lodash.get(UserCtr,"user_info.merchantEventSwitchVO.eventSwitch"))
})
const locales = {
        days: i18n_t('time.time_date_week'),
        daysShort: i18n_t('time.time_date_week'),
        months: [
          i18n_t('time.month_1'),
          i18n_t('time.month_2'),
          i18n_t('time.month_3'),
          i18n_t('time.month_4'),
          i18n_t('time.month_5'),
          i18n_t('time.month_6'),
          i18n_t('time.month_7'),
          i18n_t('time.month_8'),
          i18n_t('time.month_9'),
          i18n_t('time.month_10'),
          i18n_t('time.month_11'),
          i18n_t('time.month_12')
        ],
        monthsShort: [
          i18n_t('time.month_1'),
          i18n_t('time.month_2'),
          i18n_t('time.month_3'),
          i18n_t('time.month_4'),
          i18n_t('time.month_5'),
          i18n_t('time.month_6'),
          i18n_t('time.month_7'),
          i18n_t('time.month_8'),
          i18n_t('time.month_9'),
          i18n_t('time.month_10'),
          i18n_t('time.month_11'),
          i18n_t('time.month_12')
        ],
        // 每周的第一天
        firstDayOfWeek: 7,
      }
const  date = ref(props.dateValue)
const  showBtn = ref(props.is_show)
/**
* @description: 时间选择确认
* @return {}
*/
const confirmDate=()=>{
  useMittEmit(MITT_TYPES.EMIT_INIT_SELECT, 1)
  props.hideSelect(date.value)
}

/**
* @description: 
* @return {}
*/
function refresh() {
  changePage({changePage: 1});
  // emit("refresh")
}
onMounted(()=>{
 loadLanguageAsync(LocalStorage.get('lang'));
})
</script>

<style scoped lang="scss">

@import "./result-header.scss";
.c-simple-header{
  display: flex;
  padding: 0 20px 0 15px;
  height: 61px;
  min-height: 61px;
  align-items: center;
  text-transform: uppercase;
  .rule-logo{
    width: 127px;
    height: 30rpx;
    .logo-img{
      width: 130px;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
  }
}

.top-menu-content {
    height: 40px;
    border-top: 1px solid var(--q-announce-left-menu-color-2);
    background: var(--q-gb-bg-c-11);
    color: var(--q-gb-t-c-6);
    &:after {
        -content: "";
        -position: absolute;
        -width: 100%;
        -height: 14px;
        -top: 111px;
        -right: 0;
        -background-color: var(--q-gb-bd-c-2);
    }
    :deep(.q-tab__indicator){
            display: none;
        }
  };
/* ************** 筛选条件 *************** -S */
.divider{
  display: inline-block;
  -width: 100%;
  height: 6px;
  margin: 0;
}
.search-header {
  display: flex;
  align-items: center;
  padding: 28px 0px 14px 0px;
  border-bottom:1px solid #ff7000;
  

  /* ************** select *************** -S */
  .wrap-select {
    display: flex;

    .r-select {
      display: flex;
      align-items: center;
    }

    .r-select {
      :deep(.q-field) {
        height: 28px;
        color: #5a6074;
        font-size: 12px;
          .q-field__control,
          .items-center {
            min-height: 0px;
            height: 28px;

            .q-field__native {
              color: #5a6074;

              & > span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }

          .q-field__control {
            padding: 0 0 0 15px;
            border-radius: 2px;

            &:before {
              border: 1px solid #d0d8de;
            }

            &:hover {
              &:before {
                border-color: var(--qq--yb-text-color1);
              }
            }

            &:after {
              transform: scale3d(0, 1, 1);
            }

            .q-field__marginal {
              margin-right: 6px;
              padding: 2px 0 0 0;
              height: auto;

              &.q-anchor--skip {
                display: none;
              }
            }
          }

          .items-center {
            padding: 0;
          }
        
      }

      .ball-games-label {
        //margin-left: 10px;
        white-space: nowrap;
      }
    }

    .ball-games {
      :deep(.q-field__native) {
        input {
          position: absolute;
          left: -6px;
        }
      }
    }

    .label {
      margin-right: 10px;
    }

    .time-search-label {
      margin: 0 8px 0 8px;
      line-height: 28px;
      white-space: nowrap;
    }

    .search-date-wrapper {
      width: 185px;
      height: 28px;

      .date-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px;
        width: 100%;
        height: 100%;
        border-radius: 2px;
        cursor: pointer;
        & :deep(.icon-calendar) {
          font-size: 14px;
        }
        &:hover {
          // border: 1px solid var(--q-gb-bd-c-1);
          border: 1px solid #ff7000;
          // color: var(--q-gb-t-c-18);
          .icon-calendar {
            &:before {
              // color: var(--q-gb-t-c-18)
            }
          }
        }
      }

      .date-picker-wrap {
        :deep(.q-date) {
          .q-icon {
            font-size: 12px;
            &::before {
              color: var(--qq--yb-text-color3);
            }
          }
        }
        .q-date {
          position: relative;
          z-index: 2;
          :deep(.q-date__calendar-item > div) {
            width: auto;
          }
          /*  星期X 字体颜色正常显示 */
          :deep(.q-date__calendar-weekdays > div) {
            opacity: 1;
          }
        }

        .calendar-wrap {
          height: 276px;
          top: 10px;
          overflow: hidden;
        }

        .calendar-wrap:nth-child(1) {
          left: -135px;
        }

        .calendar-wrap:nth-child(2) {
          left: 175px;
          border-left: 1px solid transparent;

          :deep(.horn) {
            display: none !important;
          }
        }
      }
    }
  }

  /* ************** select *************** -E */
  /* ************** 日期、单选框、搜索 *************** -S */
  .wrap-handel {
    // width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 20px;
    .r-select {
      display: flex;
      align-items: center;
      min-width: 210px;

      .label {
        margin: 0 10px 0 0;
        line-height: 28px;
      }
    }

    .condition {
      display: flex;
    }

    .search {
      white-space: nowrap;

      .label {
        margin-right: 10px;
      }

      .ipt {
        width: 122px;
        height: 28px;
        outline: medium;
        background: transparent;
        border: 1px solid #d0d8de;
        color: #5a6074;
        border-radius: 2px;
        padding-left: 15px;
      }
    }

    .checkbox {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-left: 10px;
    }

    .date-time-choice {
      display: flex;
      white-space: nowrap;
      padding-right: 5px;

      .time-search-title {
        margin: 0 10px;
        line-height: 28px;
      }
    }

    .search-btn {
      display: inline-block;
      width: 80px;
      height: 28px;
      border-radius: 100px;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
      background: #179CFF;
      color:#ffffff;
      // &:hover {
      //     background: #ffb001;
      //   }
    }
  }

  /* ************** 日期、单选框、搜索 *************** -E */
}
:deep(.q-date__view){
background: #ffffff;
}
.q_data{
  :deep(.material-icons){  
    line-height: 12px !important;
  }

  .logo-icon{
    width:130px;
  }
}

</style>
