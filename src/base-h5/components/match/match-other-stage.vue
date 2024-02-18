<!--
 * @Author: Supermark
 * @Date: 2020-08-20 18:35:53
 * @Description: 详情页上推后置顶的赛事具体状态(1.未开赛显示2.开赛时间小于1小时显示分钟)
-->
<template>
  <div class="match_stage">
      <span v-if="detail_data.ms == 0">
        <span v-if="!start_time_other">
          <!-- {{(new Date(+detail_data.mgt)).Format(i18n_t('time3'))}} -->
          {{format_time_zone(+detail_data.mgt).Format(i18n_t('time3'))}}
        </span>
        <span v-else>
          {{i18n_t("list.after_time_start",[longTime_other])}}
        </span>
      </span>
      <!-- ms=110 显示即将开赛 -->
      <span v-else-if="detail_data.ms == 110">
        {{i18n_t(`ms[${detail_data.ms}]`)}}
      </span>
      <span v-else>
        <component :is="componentId" :detail_data="detail_data" :match_time_dt="match_time_dt"></component>
      </span>
  </div>
</template>

<script>
import { useMittOn, MITT_TYPES } from "src/core/mitt/index.js";
import stage_child_1 from "src/project/components/match/otherStage/otherStage-1.vue";    // 详情页下滑动置顶title栏-足球的赛事时间
import stage_child_2 from "src/project/components/match/otherStage/otherStage-2.vue";    // 详情页下滑动置顶title栏-篮球的赛事时间
import stage_child_3 from "src/project/components/match/stage/stage-child-3.vue";        // 详情页显示棒球赛事第几节以及赛事时间
import stage_child_4 from "src/project/components/match/stage/stage-child-4.vue";        // 详情页显示冰球赛事第几节以及赛事时间
import stage_child_5 from "src/project/components/match/stage/stage_child_5.vue";        // 详情页显示网球赛事第几节以及赛事时间
import stage_child_6 from "src/project/components/match/stage/stage-child-6.vue";        // 详情页显示美式足球赛事第几节以及赛事时间
import stage_child_7 from "src/project/components/match/stage/stage-child-7.vue";        // 详情页显示斯诺克赛事第几节以及赛事时间
import stage_child_8 from "src/project/components/match/stage/stage-child-8.vue";        // 详情页显示兵乓球赛事第几节以及赛事时间
import stage_child_9 from "src/project/components/match/stage/stage-child-9.vue";        // 详情页显示排球赛事第几节以及赛事时间
import stage_child_10 from "src/project/components/match/stage/stage-child-10.vue";      // 详情页显示羽毛球赛事第几节以及赛事时间
import stage_child_11 from "src/project/components/match/stage/stage-child-11.vue";      // 详情页手球赛事阶段+赛事时间
import stage_child_12 from "src/project/components/match/stage/stage-child-12.vue";      // 详情页拳击赛事阶段
import stage_child_13 from "src/project/components/match/stage/stage-child-13.vue";      // 详情页显示沙滩排球赛事第几节以及赛事时间
import stage_child_14 from "src/project/components/match/stage/stage-child-14.vue";      // 详情页橄榄球赛事阶段+赛事时间
import stage_child_15 from "src/project/components/match/stage/stage-child-15.vue";      // 详情页显示曲棍球赛事阶段及赛事时间
import stage_child_16 from "src/project/components/match/stage/stage-child-16.vue";      // 详情页显示水球赛事第几节以及赛事时间
import stage_child_101 from "src/project/components/match/stage/stage-child-101.vue";    // 详情页 电竞第几局 以及 赛事时间
// import {mapGetters} from "vuex";
import { MenuData } from "src/output/index.js";

export default {
  name: "match_stage",
  data() {
    return {
      longTime_other: '',
      start_time_other: false,
      match_time_dt:0, // 赛事时间
      
    };
  },
  computed: {
    // ...mapGetters([
    //   "get_menu_type",
    // ]),
    componentId() {
      if(MenuData.get_menu_type() == 3000){
        return `stage-child-101`;
      }else{
        return `stage-child-${this.detail_data.csid}`;
      }
    }
  },
  watch: {
    detail_data:{
      handler(n, o){
        this.initEvent();
      },
      deep: true
    }
  },
  props: ["detail_data"],
  components: {
    'stage-child-1': stage_child_1,
    'stage-child-2': stage_child_2,
    'stage-child-3': stage_child_3,
    'stage-child-4': stage_child_4,
    'stage-child-5': stage_child_5,
    'stage-child-6': stage_child_6,
    'stage-child-7': stage_child_7,
    'stage-child-8': stage_child_8,
    'stage-child-9': stage_child_9,
    'stage-child-10': stage_child_10,
    'stage-child-11': stage_child_11,
    'stage-child-12': stage_child_12,
    'stage-child-13': stage_child_13,
    'stage-child-14': stage_child_14,
    'stage-child-15': stage_child_15,
    'stage-child-16': stage_child_16,
    'stage-child-101': stage_child_101,
  },
  created() {
    this.timerInterval_other=0;
    this.initEvent()
    // let {off: off_} = useMittOn(MITT_TYPES.EMIT_SET_MATCH_TIME, this.set_match_time); // 储存时间，保证时间同步;
 },
  methods: {
    initEvent(){
      let now = new Date().getTime();
      let bool = Number(this.detail_data.mgt) - now < 3600 * 1000;
      let longTime_other = Math.floor( (+this.detail_data.mgt -now ) / 1000 / 60 );
      if(longTime_other == 0){ longTime_other += 1;}
      this.start_time_other = bool;
      this.longTime_other = longTime_other;
      clearInterval(this.timerInterval_other);
      this.timerInterval_other = setInterval(()=>{
        let now = new Date().getTime();
        if(+this.detail_data.mgt - now < 0 ){
          clearInterval(this.timerInterval_other);
          this.start_time_other = false;
        }
        let longTime_other = Math.floor( (+this.detail_data.mgt - now )/ 1000 / 60);
        if(longTime_other == 0){ longTime_other += 1; }
        this.longTime_other = longTime_other;
      }, 1000 * 1)
    },
    // 监听set_match_time事件，储存赛事时间
    set_match_time(time) {
      // time为需要储存的赛事时间
      this.match_time_dt = time;
    },
  },
  destroyed () {
    clearInterval(this.timerInterval_other);
    this.timerInterval_other = null;

    // off_() // 清除储存时间
  },
};
</script>

<style lang="scss" scoped></style>